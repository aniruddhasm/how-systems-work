const express = require("express");
const pool = require("../db");

const app = express();

app.get("/users", async (req, res) => {
  console.log("\nQuery #1");
  console.time("N+1");
  const users = await pool.query("SELECT * FROM users");
  const result = [];
  for (const user of users.rows) {
    console.log(`Fetching orders for User ${user.id}`);
    const orders = await pool.query(`
      SELECT *
      FROM orders
      WHERE user_id=$1`,
      [user.id]
    );

    result.push({
      ...user,
      orders: orders.rows,
    });
  }
  console.timeEnd("N+1");
  res.json(result);
});

app.get("/users-join", async (req, res) => {
  console.log("Executing ONE query...");
  console.time("JOIN");
  const result = await pool.query(`
    SELECT users.id, users.name, orders.product
    FROM users
    LEFT JOIN orders
    ON users.id = orders.user_id
    ORDER BY users.id;
  `);
  console.timeEnd("JOIN");
  res.json(result.rows);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});