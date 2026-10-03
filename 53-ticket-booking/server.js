const express = require("express");
const { Pool } = require("pg");

const app = express();

const PORT = 3000;

// Seat will remain HELD for 30 seconds in this demo
const HOLD_TIME = 30 * 1000;


// PostgreSQL connection
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "ticket_booking",
    password: "postgres",
    port: 5432
});


app.use(express.json());

app.use(express.static("public"));


// Store active timers
const holdTimers = new Map();


// ======================================================
// GET ALL SEATS
// ======================================================

app.get("/api/seats/:eventId", async (req, res) => {

    const { eventId } = req.params;

    try {

        const result = await pool.query(
            `
            SELECT
                id,
                seat_number,
                status,
                user_id
            FROM seats
            WHERE event_id = $1
            ORDER BY id
            `,
            [eventId]
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch seats"
        });

    }
});


// ======================================================
// BOOK / HOLD SEAT
// AVAILABLE → HELD
// ======================================================

app.post("/api/book", async (req, res) => {

    const { userId, eventId, seatId } = req.body;

    if (!userId || !eventId || !seatId) {

        return res.status(400).json({
            message: "userId, eventId and seatId are required"
        });

    }


    const client = await pool.connect();


    try {

        await client.query("BEGIN");


        // Lock the seat row
        const seatResult = await client.query(
            `
            SELECT
                id,
                seat_number,
                status,
                user_id
            FROM seats
            WHERE id = $1
            AND event_id = $2
            FOR UPDATE
            `,
            [seatId, eventId]
        );


        if (seatResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Seat not found"
            });

        }


        const seat = seatResult.rows[0];


        // Seat is already held
        if (seat.status === "HELD") {

            await client.query("ROLLBACK");

            return res.status(409).json({
                message: `Seat ${seat.seat_number} is currently held by another user`
            });

        }


        // Seat is already booked
        if (seat.status === "BOOKED") {

            await client.query("ROLLBACK");

            return res.status(409).json({
                message: `Seat ${seat.seat_number} is already booked`
            });

        }


        // Hold the seat
        await client.query(
            `
            UPDATE seats
            SET
                status = 'HELD',
                user_id = $1
            WHERE id = $2
            `,
            [userId, seatId]
        );


        await client.query("COMMIT");


        // ------------------------------------------------
        // Start demo timer
        // ------------------------------------------------

        const timer = setTimeout(async () => {

            try {

                const result = await pool.query(
                    `
                    UPDATE seats
                    SET
                        status = 'AVAILABLE',
                        user_id = NULL
                    WHERE id = $1
                    AND status = 'HELD'
                    AND user_id = $2
                    RETURNING seat_number
                    `,
                    [seatId, userId]
                );


                if (result.rows.length > 0) {

                    console.log(
                        `Hold expired: Seat ${result.rows[0].seat_number} is AVAILABLE again`
                    );

                }

            } catch (error) {

                console.error(
                    "Error releasing expired seat:",
                    error
                );

            }


            holdTimers.delete(seatId);

        }, HOLD_TIME);


        holdTimers.set(seatId, timer);


        res.json({

            message: `Seat ${seat.seat_number} is held for payment`,

            seat: seat.seat_number,

            seatId: seatId,

            userId: userId,

            holdTime: HOLD_TIME / 1000

        });


    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({
            message: "Unable to hold seat"
        });

    } finally {

        client.release();

    }

});


// ======================================================
// PAYMENT SUCCESS
// HELD → BOOKED
// ======================================================

app.post("/api/payment-success", async (req, res) => {

    const { userId, seatId } = req.body;


    if (!userId || !seatId) {

        return res.status(400).json({
            message: "userId and seatId are required"
        });

    }


    const client = await pool.connect();


    try {

        await client.query("BEGIN");


        // Lock the seat
        const result = await client.query(
            `
            SELECT
                id,
                seat_number,
                status,
                user_id
            FROM seats
            WHERE id = $1
            FOR UPDATE
            `,
            [seatId]
        );


        if (result.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Seat not found"
            });

        }


        const seat = result.rows[0];


        // Make sure this user owns the hold
        if (
            seat.status !== "HELD" ||
            seat.user_id !== Number(userId)
        ) {

            await client.query("ROLLBACK");

            return res.status(409).json({
                message: "Seat is no longer held by you"
            });

        }


        // Stop expiry timer
        if (holdTimers.has(seatId)) {

            clearTimeout(holdTimers.get(seatId));

            holdTimers.delete(seatId);

        }


        // Confirm booking
        await client.query(
            `
            UPDATE seats
            SET status = 'BOOKED'
            WHERE id = $1
            `,
            [seatId]
        );


        await client.query("COMMIT");


        res.json({

            message: `Payment successful. Seat ${seat.seat_number} is booked.`,

            seat: seat.seat_number,

            userId: userId

        });


    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({
            message: "Payment confirmation failed"
        });

    } finally {

        client.release();

    }

});


// ======================================================
// CANCEL PAYMENT
// HELD → AVAILABLE
// ======================================================

app.post("/api/cancel", async (req, res) => {

    const { userId, seatId } = req.body;


    if (!userId || !seatId) {

        return res.status(400).json({
            message: "userId and seatId are required"
        });

    }


    const client = await pool.connect();


    try {

        await client.query("BEGIN");


        // Lock the seat
        const result = await client.query(
            `
            SELECT
                id,
                seat_number,
                status,
                user_id
            FROM seats
            WHERE id = $1
            FOR UPDATE
            `,
            [seatId]
        );


        if (result.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Seat not found"
            });

        }


        const seat = result.rows[0];


        // Make sure this user owns the hold
        if (
            seat.status !== "HELD" ||
            seat.user_id !== Number(userId)
        ) {

            await client.query("ROLLBACK");

            return res.status(409).json({
                message: "Seat is no longer held by you"
            });

        }


        // Stop timer
        if (holdTimers.has(seatId)) {

            clearTimeout(holdTimers.get(seatId));

            holdTimers.delete(seatId);

        }


        // Release seat
        await client.query(
            `
            UPDATE seats
            SET
                status = 'AVAILABLE',
                user_id = NULL
            WHERE id = $1
            `,
            [seatId]
        );


        await client.query("COMMIT");


        res.json({

            message: `Payment cancelled. Seat ${seat.seat_number} is available again.`,

            seat: seat.seat_number

        });


    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({
            message: "Unable to cancel booking"
        });

    } finally {

        client.release();

    }

});


// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});