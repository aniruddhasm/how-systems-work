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

    console.log("Deducting 100 from Account A");

    await client.query(`
      UPDATE accounts
      SET balance = balance - 100
      WHERE id = 1
    `);

    console.log("Money deducted");

    throw new Error("Server Crashed");

    await client.query(`
      UPDATE accounts
      SET balance = balance + 100
      WHERE id = 2
    `);

    await client.query("COMMIT");
  } catch (err) {
    console.log("Error occurred.");
    await client.query("ROLLBACK");    
    console.log("Rollback Executed");
  }
  await client.end();
}

transfer();