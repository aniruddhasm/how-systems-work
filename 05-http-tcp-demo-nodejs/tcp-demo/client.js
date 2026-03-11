const net = require("net");

const client = new net.Socket();

client.connect(4000, "localhost", () => {
    console.log("Connected to TCP server");
    client.write("Hello from TCP client");
});

client.on("data", (data) => {
    console.log("Server response:", data);
    client.destroy();
});

client.on("close", () => {
    console.log("Connection closed");
});