
const { fork } = require("child_process");

console.log("Main Process PID:", process.pid);

for (let i = 1; i <= 2; i++) {
  const child = fork("./os/03-process-vs-thread/child.js");

  child.on("message", (message) => {
    console.log(message);
  });
}
