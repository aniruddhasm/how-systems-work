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

// Test Database Connection
pool.connect()
  .then(client => {
    console.log("✅ Connected to PostgreSQL");
    client.release();
  })
  .catch(err => console.error(err));

/**
 * Insert an Order
 */
app.post("/orders", async (req, res) => {
  try {
    const { customer, amount, date } = req.body;

    await pool.query(
      `
      INSERT INTO orders
      (customer_name, amount, order_date)
      VALUES ($1, $2, $3)
      `,
      [customer, amount, date]
    );

    console.log(`Inserted order into partition for ${date}`);

    res.json({
      success: true,
      message: "Order Created"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});

/**
 * Get Orders for a Date
 */
app.get("/orders/:date", async (req, res) => {
  try {
    const { date } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM orders
      WHERE order_date = $1
      `,
      [date]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});

/**
 * Show Query Plan (Partition Pruning Demo)
 */
app.get("/orders/explain/:date", async (req, res) => {
  try {
    const { date } = req.params;

    const result = await pool.query(
      `
      EXPLAIN ANALYZE
      SELECT *
      FROM orders
      WHERE order_date = $1
      `,
      [date]
    );

    // console.log(result.rows);

    res.json(result.rows.map(r => r["QUERY PLAN"]));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});

/**
 * Count rows in each partition
 */
app.get("/partitions", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
          tableoid::regclass AS partition_name,
          COUNT(*) AS total_rows
      FROM orders
      GROUP BY tableoid
      ORDER BY partition_name;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});