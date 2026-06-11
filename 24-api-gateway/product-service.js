const express = require("express");

const app = express();

app.get("/products", (req, res) => {

  console.log("Product Service Called");

  res.json({
    service: "Product Service",
    products: ["Laptop", "Phone"]
  });

});

app.listen(3002, () => {
  console.log("Product Service running on 3002");
});