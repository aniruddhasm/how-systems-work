const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const SECRET = "random-secret-key";

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  // check if username and password are correct from the database
  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
  
  res.json({ token });
});

// Protected route
app.get("/protected", (req, res) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send("Token missing");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    res.send(`Welcome ${decoded.username}`);
  } catch (err) {
    res.status(403).send("Invalid token");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});