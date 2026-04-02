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

req.end(); // This is important to send the request to the server. if you don't call this, the request will not be sent.