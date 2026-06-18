const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  password: "postgres",
  database: "employees",
});

async function transfer() {
  await client.connect();

  try {
  console.log("Deducting 100 from Account A");
  await client.query(`
    UPDATE accounts
    SET balance = balance - 100
    WHERE id = 1
  `);

  throw new Error("Server Crashed");

  await client.query(`
    UPDATE accounts
    SET balance = balance + 100
    WHERE id = 2
  `);
  } catch (err) {
    console.log("Error occurred.");   
  }
  await client.end();
}

transfer();