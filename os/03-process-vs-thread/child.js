
console.log("Child Process PID:", process.pid);

process.send(`Child process ${process.pid} is running`);
