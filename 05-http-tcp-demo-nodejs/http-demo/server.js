const http = require("http");

const server = http.createServer((req, res) => {

    console.log("Request received");
    console.log("Method:", req.method);
    console.log("URL:", req.url);

    res.writeHead(200, {
        "Content-Type": "text/plain"
    });

    res.end("Hello from HTTP server");
});

// server.on("connection", (socket) => {
//     console.log("New TCP connection established");
// });

server.listen(3000, () => {
    console.log("HTTP server running on port 3000");
});