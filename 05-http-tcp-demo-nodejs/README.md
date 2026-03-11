# HTTP vs TCP Demo

This demo shows how HTTP works on top of TCP using Node.js.

## 1. TCP Demo

Raw socket communication using Node's `net` module.

Run:

node tcp-demo/server.js
node tcp-demo/client.js

## 2. HTTP Demo

HTTP request/response using Node's `http` module.

Run:

node http-demo/server.js
node http-demo/client.js

## Key Idea

HTTP is an application protocol that runs on top of TCP.

Use curl to show an HTTP request
curl -v http://localhost:3000


Show HTTP over TCP using telnet

telnet localhost 3000

Then type manually:
GET / HTTP/1.1
Host: localhost