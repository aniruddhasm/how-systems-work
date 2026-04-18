const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

const ACCESS_SECRET = "demo-access-secret";
const REFRESH_SECRET = "demo-refresh-secret";


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  const accessToken = jwt.sign({ username }, ACCESS_SECRET, {
    expiresIn: "10s",
  });
  const refreshToken = jwt.sign({ username }, REFRESH_SECRET);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: 'lax', // "strict" in production,
  });
    // sameSite scenarios:
    // 'lax'    → frontend & backend on same domain (http://localhost:3000) [current setup]
    // 'strict' → high security (banking/admin), won't send cookie even on link click from another site
    // 'none'   → frontend & backend on different domains (app.mysite.com → api.mysite.com), requires secure: true (HTTPS only)
  res.json({ accessToken });
});

app.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).send("Refresh token missing");
  }

  try {
    const user = jwt.verify(token, REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { username: user.username },
      ACCESS_SECRET,
      { expiresIn: "10s" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).send("Invalid or expired refresh token");
  }
});

app.get("/protected", (req, res) => {
    const authHeader = req.headers["authorization"];
 
    if (!authHeader) {
      return res.status(401).send("Token missing");
    }
  
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, ACCESS_SECRET);
      res.send(`Welcome ${decoded.username}`);
    } catch (err) {
      res.status(401).send("Invalid token or token expired");
    }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});