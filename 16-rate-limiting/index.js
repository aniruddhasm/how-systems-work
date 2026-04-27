const express = require("express");

const app = express();

const MAX_TOKENS = 5;        // bucket size
const REFILL_RATE = 1;       // tokens per second

const users = {};

// Token bucket middleware
function tokenBucket(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  if (!users[ip]) {
    users[ip] = {
      tokens: MAX_TOKENS,
      lastRefill: now,
    };
  }

  const user = users[ip];

  // Calculate time passed
  const timePassed = (now - user.lastRefill) / 1000;
  
  // Refill tokens
  const tokensToAdd = Math.floor(timePassed * REFILL_RATE);
  user.tokens = Math.min(MAX_TOKENS, user.tokens + tokensToAdd);
  user.lastRefill = now;

  if (user.tokens > 0) {
    user.tokens--;
    console.log(`Allowed → Tokens left: ${user.tokens}`);
    next();
  } else {
    console.log("Blocked → No tokens left");
    res.status(429).send("Too many requests. Try later");
  }
}

app.use(tokenBucket);

app.get("/", (req, res) => {
  res.send("Request successful");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});