const { Client } = require("pg");

async function withdraw(name) {

  const client = new Client({
    user: "postgres",
    password: "postgres",
    database: "employees"
  });

  await client.connect();

  await client.query("BEGIN");

  const result =
    await client.query(
      "SELECT balance FROM accounts WHERE id = 1"
    );

  const balance = result.rows[0].balance;

  console.log(`${name} read balance = ${balance}`);

  await new Promise(r =>
    setTimeout(r, 5000)
  );

  await client.query(`
    UPDATE accounts
    SET balance = $1
    WHERE id = 1
  `, [balance - 800]);

  await client.query("COMMIT");

  console.log(`${name} withdrew 800`);

  await client.end();
}

withdraw(process.argv[2]);