const express = require("express");
const { Pool } = require("pg");

const app = express();

const shard1 = new Pool({
  host: "localhost",
  user: "postgres",
  password: "postgres",
  database: "employees_shard1",
  port: 5432,
});

const shard2 = new Pool({
  host: "localhost",
  user: "postgres",
  password: "postgres",
  database: "employees_shard2",
  port: 5432,
});

// rule:
// Users 1 - 5000  -> Shard 1
// Users > 5000    -> Shard 2

function getDatabase(userId) {
  if (userId <= 5000) {
    return {
      name: "Shard 1",
      pool: shard1,
    };
  }

  return {
    name: "Shard 2",
    pool: shard2,
  };
}

app.get("/users/:id", async (req, res) => {
  const userId = Number(req.params.id);

  const { name, pool } = getDatabase(userId);

  console.log("\n----------------------------");
  console.log(`Incoming Request : /users/${userId}`);
  console.log(`Routing to       : ${name}`);

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );

    console.log("Query Executed Successfully");

    res.json({
      shard: name,
      user: result.rows[0] || null,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// GET /users/1
// GET /users/1000001