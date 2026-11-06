
const express = require("express");

const app = express();
const PORT = 3000;

const FAILURE_THRESHOLD = 2;
const RESET_TIMEOUT = 5000;

let state = "CLOSED";
let failureCount = 0;
let openedAt = 0;
let halfOpenProbeInFlight = false;
let downstreamAttempts = 0;

// Simulated downstream service
async function callDownstream() {
  downstreamAttempts++;
  console.log(`Calling downstream (attempt ${downstreamAttempts})`);

  if (downstreamAttempts <= 2) {
    throw new Error("Downstream service unavailable");
  }

  return { message: "Downstream service is healthy", state };
}

class CircuitOpenError extends Error {}

function openCircuit() {
  state = "OPEN";
  openedAt = Date.now();
  console.log("Circuit breaker: OPEN");
}

async function circuitBreaker(fn) {
  if (state === "OPEN") {
    if (Date.now() - openedAt < RESET_TIMEOUT) {
      throw new CircuitOpenError("Circuit is OPEN. Fail fast.");
    }

    state = "HALF_OPEN";
    console.log("Circuit breaker: HALF_OPEN");
  }

  if (state === "HALF_OPEN") {
    if (halfOpenProbeInFlight) {
      throw new CircuitOpenError("Recovery test already in progress");
    }

    halfOpenProbeInFlight = true;
  }

  const isProbe = state === "HALF_OPEN";

  try {
    const result = await fn();

    state = "CLOSED";
    failureCount = 0;
    console.log("Circuit breaker: CLOSED");

    return result;
  } catch (error) {
    if (isProbe) {
      openCircuit();
    } else if (state === "CLOSED") {
      failureCount++;

      console.log(`Failure count: ${failureCount}`);

      if (failureCount >= FAILURE_THRESHOLD) {
        openCircuit();
      }
    }

    throw error;
  } finally {
    if (isProbe) {
      halfOpenProbeInFlight = false;
    }
  }
}

app.get("/data", async (req, res) => {
  try {
    const result = await circuitBreaker(callDownstream);
    res.json(result);
  } catch (error) {
    const status = error instanceof CircuitOpenError ? 503 : 502;

    res.status(status).json({
      error: error.message,
      circuitState: state
    });
  }
});

app.get("/status", (req, res) => {
  res.json({ state, failureCount });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
