const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "postgres",
  database: "employees",
  host: "localhost",
});

module.exports = pool;