const express = require("express");
const { Pool } = require("pg");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "employees",
  password: "postgres",
  port: 5432,
});

let waitingClients = [];

/*
 * Long Poll Endpoint
 */
app.get("/messages", (req, res) => {

  console.log("Client waiting...");

  waitingClients.push(res);

  console.log(
    `Waiting Clients: ${waitingClients.length}`
  );

  req.on("close", () => {
    waitingClients =
      waitingClients.filter(
        client => client !== res
      );
  });
});

/*
 * Insert Message
 */
app.post("/send-tweet", async (req, res) => {

  try {

    const { text } = req.body;

    await pool.query(
      "INSERT INTO messages(text) VALUES($1)",
      [text]
    );

    const countResult =
      await pool.query(
        "SELECT COUNT(*) FROM messages"
      );

    const totalMessages =
      Number(
        countResult.rows[0].count
      );

    console.log(
      `New Message Added. Total Messages = ${totalMessages}`
    );

    waitingClients.forEach(client => {
      client.json({
        totalMessages
      });
    });

    waitingClients = [];

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Something went wrong"
    });

  }

});

app.listen(3000, () => {
  console.log(
    "Server running on port 3000"
  );
});