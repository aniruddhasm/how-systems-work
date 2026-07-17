const express = require("express");
const { Pool } = require("pg");

const app = express();

const primary = new Pool({
  database: "employees_primary",
  user: "postgres",
  password: "postgres",
});

const replica = new Pool({
  database: "employees_replica",
  user: "postgres",
  password: "postgres",
});

app.get("/users/:id", async (req, res) => {

  console.log("Reading from Replica");

  const result = await replica.query(
    "SELECT * FROM users WHERE id=$1",
    [req.params.id]
  );

  res.json(result.rows[0]);

});

app.post("/users", express.json(), async (req, res) => {

  console.log("Writing to Primary");

  await primary.query(

    "INSERT INTO users(id,name) VALUES($1,$2)",

    [req.body.id, req.body.name]

  );

  res.send("User Created");

});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});