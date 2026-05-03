const express = require("express");
const { Client } = require("pg");

const app = express();

app.get("/", async (req, res) => {
  const start = Date.now();

  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "postgres",
    port: 5432,
  });

  try {
    await client.connect();
    await client.query("SELECT pg_sleep(2);");
    await client.end();
    const end = Date.now();
    res.json({
      message: "Without Pool",
      timeTakenMs: end - start,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.listen(3000, () => {
  console.log("Server running WITHOUT pool on port 3000");
});