/**
 * Node.js event loop — quick reference
 *
 * Phases (each turn of the loop, roughly):
 *   1. Timers          — setTimeout / setInterval callbacks due now
 *   2. Pending         — deferred I/O (e.g. TCP errors)
 *   3. Poll            — I/O; may block for sockets; schedules timers
 *   4. Check           — setImmediate callbacks
 *   5. Close           — e.g. socket.on("close")
 *
 * Not a phase: process.nextTick — its queue drains after the current JS stack
 *   and before the event loop continues; it runs before Promise microtasks.
 *
 * Microtasks (Promises, queueMicrotask) run after nextTick in the same "tick".
 */

const http = require("http");

const server = http.createServer((req, res) => {
    console.log("\n--- Request: Poll phase runs this handler ---\n");

    console.log("handler: sync start");

    process.nextTick(() => console.log("handler: nextTick"));
    
    setTimeout(() => console.log("handler: setTimeout"), 0);
    setImmediate(() => console.log("handler: setImmediate"));

    console.log("handler: sync end");

    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(
        "Open the terminal and watch log order.\n" +
            "Event loop: Timers → Pending → Poll → Check → Close.\n" +
            "nextTick and microtasks run between operations, not as named phases.\n"
    );
});

server.listen(8000, () => {
    console.log("\n=== 3) HTTP server (Poll phase for each connection) ===\n");
    console.log("  Listen on http://127.0.0.1:8000 — curl it to see request logs.\n");
});
