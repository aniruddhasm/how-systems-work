const express = require("express");
const { Pool } = require("pg");
const app = express();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres",
  port: 5432,
  max: 5, // DEFAULT SIZE IS 10
});

//max_connections default value in postgresql.conf
//max_connections = 100

// if you have 5 app servers and each server makes 10 requests, 
// then total requests will be 50 and within the range of max_connections

// if you have 15 app servers and each server makes 10 requests, 
// then total requests will be 150 and it is not within the range of max_connections 
// and you will get error: too many connections

app.get("/", async (req, res) => {
  const start = Date.now();
  try {
    const client = await pool.connect();
    await client.query("SELECT pg_sleep(2);");
    client.release();
    const end = Date.now();
    res.json({
      message: "With Pool",
      timeTakenMs: end - start,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.listen(3000, () => {
  console.log("Server running WITH pool on port 3000");
});