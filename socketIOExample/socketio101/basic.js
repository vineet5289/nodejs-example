const http = require('http');
const socketIO = require('socket.io');


const server = http.createServer((req, res) => {
    res.end("I am connected");
});

const io = socketIO(server);

io.on('connection', (socket, req) => {
    socket.emit('welcome', 'I am server');
    socket.on('message', (msg) => {
        console.log(msg);
    })
});

server.listen(8000);