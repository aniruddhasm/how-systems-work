const express = require("express");

function startServer(port, name) {
  const app = express();

  app.get("/", (req, res) => {
    res.send(`Response from ${name}`);
  });

  app.listen(port, () => {
    console.log(`${name} running on port ${port}`);
  });
}

// Start 3 servers
startServer(3001, "Server 1");
startServer(3002, "Server 2");
startServer(3003, "Server 3");