const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/stream", (req, res) => {

  res.setHeader(
    "Content-Type",
    "text/event-stream"
  );

  res.setHeader(
    "Cache-Control",
    "no-cache"
  );

  res.setHeader(
    "Connection",
    "keep-alive"
  );

  const answer =
  "Server Sent Events or SSE allow the server to send data to the browser without the browser repeatedly making requests. The connection remains open and the server pushes updates whenever new data becomes available.";
  const words = answer.split(" ");

  let index = 0;

  const interval = setInterval(() => {

    if (index >= words.length) {

      clearInterval(interval);

      res.write(
        `event: done\n`
      );

      res.write(
        `data: complete\n\n`
      );

      return;
    }

    res.write(
      `data: ${words[index]}\n\n`
    );

    index++;

  }, 300);

  req.on("close", () => {
    clearInterval(interval);
  });

});

app.listen(3000, () => {
  console.log(
    "Server running on port 3000"
  );
});