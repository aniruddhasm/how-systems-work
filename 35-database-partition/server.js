const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  database: "employees",
  port: 5432,
});

app.post("/orders", async (req, res) => {
  const { customer, amount, date } = req.body;

  await pool.query(
    `
    INSERT INTO orders
    (customer_name, amount, order_date)
    VALUES ($1,$2,$3)
    `,
    [customer, amount, date]
  );

  console.log(`Inserted order for ${date}`);

  res.send("Order Created");
});

app.get("/orders/:date", async (req, res) => {
  const date = req.params.date;
  const result = await pool.query(
    `
    EXPLAIN ANALYZE
    SELECT *
    FROM orders
    WHERE order_date = $1
    `,
    [date]
  );

  console.log(result.rows);
  res.json(result.rows);

});