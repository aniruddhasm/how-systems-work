const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Set cookie
app.get("/set-cookie", (req, res) => {
  res.cookie("demoCookie", "HelloCookie", {
    httpOnly: false, // set true to show security difference
  });
  res.send("Cookie set!");
});

// Read cookie
app.get("/get-cookie", (req, res) => {
  res.json(req.cookies);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});