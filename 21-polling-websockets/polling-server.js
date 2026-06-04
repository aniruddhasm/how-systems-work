const express = require("express");

const app = express();

let counter = 0;

setInterval(() => {
  counter++;
}, 5000);

app.get("/messages", (req, res) => {
  console.log("Polling Request Received");

  res.json({
    message: `Current Counter: ${counter}`,
    timestamp: new Date().toLocaleTimeString(),
  });
});

app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Polling Server Running on Port 3000");
});