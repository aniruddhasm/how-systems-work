const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  password: "postgres",
  database: "employees"
});

async function saveNote() {
  await client.connect();

  await client.query("BEGIN");
  await client.query(`
    INSERT INTO notes(message) VALUES ('Hello Durability')
    `);

  await client.query("COMMIT");

  console.log("Transaction Committed");

  await client.end();
}

saveNote();