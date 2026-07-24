const express = require("express");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
  user: "postgres",
  password: "postgres",
  database: "employees",
  host: "localhost",
});

app.get("/users/:id", async (req, res) => {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM users_int WHERE id = $1", [id]);
    res.json(result.rows[0]);
});
app.get("/users_uuid/:id", async (req, res) => {
    const result = await pool.query(
    "SELECT * FROM users_uuid WHERE id=$1",
    [req.params.id]
    );
    res.json(result.rows[0]);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});