const express = require("express");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
  user: "postgres",
  password: "postgres",
  database: "employees",
  host: "localhost",
});

app.get("/offset", async (req, res) => {
    console.time("Offset Pagination");
  const page = Number(req.query.page);
  const limit = 20;
  const offset = (page - 1) * limit;
  const result = await pool.query(
    `
    SELECT *
    FROM users
    ORDER BY id
    LIMIT $1
    OFFSET $2
    `,
    [limit, offset]
  );
  console.timeEnd("Offset Pagination");
  res.json(result.rows);
});

app.get("/cursor", async (req, res) => {
    console.time("Cursor Pagination");
    const cursor = Number(req.query.cursor || 0);
    const result = await pool.query(`
        SELECT *
        FROM users
        WHERE id > $1
        ORDER BY id
        LIMIT 20`,
        [cursor]
    );
    console.timeEnd("Cursor Pagination");
    res.json(result.rows);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});