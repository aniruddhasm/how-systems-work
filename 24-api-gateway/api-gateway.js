const express = require("express");
const axios = require("axios");

const app = express();

app.get("/users", async (req, res) => {

  console.log("Gateway -> User Service");

  const response =
    await axios.get(
      "http://localhost:3001/users"
    );

  res.json(response.data);

});

app.get("/products", async (req, res) => {

  console.log("Gateway -> Product Service");

  const response =
    await axios.get(
      "http://localhost:3002/products"
    );

  res.json(response.data);

});

app.listen(3000, () => {
  console.log("API Gateway running on 3000");
});