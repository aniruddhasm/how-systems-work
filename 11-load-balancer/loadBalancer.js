const express = require("express");
const http = require("http");

const app = express();

const servers = [
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
];

let index = 0;

app.get("/", (req, res) => {
  const target = servers[index];

  console.log(`Forwarding request to ${target}`);

  // Round Robin
  index = (index + 1) % servers.length;

  http.get(target, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      res.send(data);
    });
  });
});

app.listen(3000, () => {
  console.log("Load Balancer running on port 3000");
});