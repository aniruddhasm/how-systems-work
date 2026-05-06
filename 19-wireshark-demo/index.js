const express = require("express");
const cors = require("cors");
const { Client } = require("pg");

const app = express();
app.use(cors());

app.get("/users", async (req, res) => {
    const client = new Client({
        user: "postgres",
        host: "localhost",
        database: "employees",
        password: "postgres",
        port: 5432,
    });

  try {
    await client.connect();
    const result = await client.query("SELECT name, email FROM users limit 10");
    await client.end();
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});