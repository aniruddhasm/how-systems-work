const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clientCounter = 1;

wss.on("connection", (ws) => {
  const clientId = clientCounter++;

  ws.clientId = clientId;

  console.log(`Client-${clientId} connected`);

  ws.send(
    JSON.stringify({
      type: "welcome",
      clientId,
    })
  );

  ws.on("message", (message) => {
    console.log(
      `Received from Client-${clientId}: ${message.toString()}`
    );

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            from: `Client-${clientId}`,
            message: message.toString(),
          })
        );
      }
    });
  });

  ws.on("close", () => {
    console.log(`Client-${clientId} disconnected`);
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});