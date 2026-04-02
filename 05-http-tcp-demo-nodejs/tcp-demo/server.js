const net = require("net");

const server = net.createServer((socket) => {
    console.log("Client connected");

    socket.on("data", (data) => {
        console.log("Received buffered data:", data);
        console.log("Received:", data.toString());
        socket.write("Message received by TCP server");
    });

    socket.on("end", () => {
        console.log("Client disconnected");
    });
});

server.listen(4000, () => {
    console.log("TCP server running on port 4000");
});