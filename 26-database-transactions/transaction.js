const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  password: "postgres",
  database: "employees",
});

async function transfer() {
  await client.connect();
  
  try {
    await client.query("BEGIN");
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

    await client.query("COMMIT");

  } catch (err) {
    console.log("Error occurred. Rolling back...");
    await client.query("ROLLBACK");
  }
  await client.end();
}

transfer();