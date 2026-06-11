const express = require("express");

const app = express();

app.get("/users", (req, res) => {

  console.log("User Service Called");

  res.json({
    service: "User Service",
    users: ["Aniruddha", "John"]
  });

});

app.listen(3001, () => {
  console.log("User Service running on 3001");
});