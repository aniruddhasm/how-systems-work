const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

let counter = 0;

setInterval(() => {
  counter++;

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          message: `Current Counter: ${counter}`,
          timestamp: new Date().toLocaleTimeString(),
        })
      );
    }
  });
}, 5000);

app.use(express.static("public"));

server.listen(3000, () => {
  console.log("WebSocket Server Running on Port 3000");
});