
const {
  Worker,
  isMainThread,
  threadId,
  parentPort
} = require("worker_threads");

if (isMainThread) {
  console.log("Main Thread Started");
  console.log("Main Thread ID:", threadId);
  console.log("Process ID:", process.pid);

  // Create a separate worker thread for PDF generation
  const worker = new Worker(__filename);

  worker.on("message", (message) => {
    console.log(message);
  });

  // Main thread continues doing other work
  console.log("Main Thread: Handling application requests...");
  console.log("Main Thread: Processing user activity...");

} else {
  console.log("Worker Thread Started");
  console.log("Worker Thread ID:", threadId);
  console.log("Process ID:", process.pid);

  // PDF-related work happens in this thread
  console.log("Worker: Generating PDF...");
  
  // Actual PDF generation logic goes here
  // For example:
  // - Read data for the PDF
  // - Generate or modify the PDF
  // - Save the PDF to disk

  parentPort.postMessage("Worker: PDF generation completed!");
}
