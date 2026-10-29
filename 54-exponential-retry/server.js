function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let apiAttempts = 0;

async function callApi() {
  apiAttempts++;
  console.log(`Calling API (attempt ${apiAttempts})...`);

  // Simulate temporary failures
  if (apiAttempts < 10) {
    throw new Error("Temporary failure");
  }

  return { status: "success" };
}

async function retryWithBackoff(maxRetries = 10) {
  for (let attempt = 0; ; attempt++) {
    try {
      const result = await callApi();
      console.log("API succeeded:", result);
      return result;
    } catch (error) {
      if (attempt >= maxRetries) {
        console.error("All retries exhausted:", error.message);
        throw error;
      }

      const baseDelay = 1000 * 2 ** attempt;
      const jitter = Math.random() * baseDelay;
      const delay = baseDelay;
      //const delay = baseDelay + jitter; // Uncomment this line to add jitter to the delay

      console.log(
        `Retrying in ${(delay / 1000).toFixed(2)} seconds...`
      );

      await sleep(delay);
    }
  }
}

retryWithBackoff().catch(() => {});