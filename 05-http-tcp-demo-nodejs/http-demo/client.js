const http = require("http");

const options = {
    hostname: "example.com",
    method: "GET"
};

const req = http.request(options, (res) => {
    console.log("Status Code:", res.statusCode);
    res.on("data", (data) => {
        console.log("Response:", data.toString());
    });
});

req.end();