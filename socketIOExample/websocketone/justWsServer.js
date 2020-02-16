const http = require('http');
const webSocket = require('ws');


const server = http.createServer((req, res) => {
    res.end("I am connected");
});

const webSocketServer = new webSocket.Server({server});

webSocketServer.on('headers', (headers, req) => {
    console.log(headers);
});

webSocketServer.on('connection', (ws, req) => {
    // console.log(req)
    ws.send('Welcome to the web socket server!!');
    ws.on('message', (msg) => {
        console.log(msg);
    });
});

server.listen(8000);