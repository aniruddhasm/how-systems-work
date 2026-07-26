const express = require("express");
const pool = require("../db");

const app = express();

app.use(express.json());

app.delete("/users/:id", async (req, res) => {
    await pool.query(`
        UPDATE users
        SET deleted = TRUE
        WHERE id = $1`,
        [req.params.id]
    );
    res.send("User Soft Deleted");
});

app.get("/users", async (req, res) => {
    const result = await pool.query(`
        SELECT *
        FROM users
        WHERE deleted = FALSE`
    );
    res.json(result.rows);
});

app.put("/users/:id/restore", async (req, res) => {
    await pool.query(`
        UPDATE users
        SET deleted = FALSE
        WHERE id = $1`,
        [req.params.id]
    );
    res.send("User Restored");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});