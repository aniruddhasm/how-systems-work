const express = require("express");
const app = express();
app.use(express.json());
const queue = [];

/*
 * Worker
 */
setInterval(() => {
  if (queue.length === 0) {
    return;
  }
  const task = queue.shift();
  console.log(`Processing Order ${task.id} at ${new Date().toISOString()}`);
}, 3000);

/*
 * Create Order
 */
app.get("/order", (req, res) => {
  const order = {id: Date.now()};
  queue.push(order);
  console.log(`Order ${order.id} added to queue at ${new Date().toISOString()}`);
  console.log(`Queue Size = ${queue.length}`);

  res.json({
    message:
    "Order received successfully"
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});