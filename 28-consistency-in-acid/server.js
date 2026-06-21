const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  password: "postgres",
  database: "employees",
});

async function withdraw() {
  await client.connect();

  try {
    await client.query(`
      UPDATE accounts
      SET balance = balance - 2000
      WHERE id = 1
    `);
  } catch (err) {
    console.log("Transaction Rejected");
    console.log(err.message);
  }
  await client.end();
}

withdraw();