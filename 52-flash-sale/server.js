const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "flash_sale",
    password: "postgres",
    port: 5432
});

app.post("/buy", async (req, res) => {
    const productId = req.body.productId;
    const userId = Math.floor(Math.random() * 9000) + 1000;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Lock the product row
        const result = await client.query(
            `SELECT stock FROM products WHERE id = $1 FOR UPDATE`, [productId]
        );

        const product = result.rows[0];

        if (!product) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (product.stock <= 0) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                message: "Sold out"
            });
        }

        // Reduce stock
        await client.query(
            `UPDATE products SET stock = stock - 1 WHERE id = $1`, [productId]
        );

        // Create order
        await client.query(
            `INSERT INTO orders (user_id, product_id)
             VALUES ($1, $2)`,
            [userId, productId]
        );

        await client.query("COMMIT");

        res.json({
            message: "Purchase successful",
            productId: productId
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({
            message: "Something went wrong"
        });

    } finally {
        client.release();
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});