
const {
  Worker,
  isMainThread,
  threadId,
  parentPort
} = require("worker_threads");

if (isMainThread) {
  console.log("Main Thread ID:", threadId);
  console.log("Process ID:", process.pid);

  for (let i = 1; i <= 2; i++) {
    const worker = new Worker(__filename);

    worker.on("message", (message) => {
      console.log(message);
    });
  }
} else {
  console.log("Worker Thread ID:", threadId);
  console.log("Process ID:", process.pid);

  parentPort.postMessage(
    `Worker ${threadId} running in process ${process.pid}`
  );
}
