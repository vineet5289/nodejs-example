const express = require('express'),
    socketio = require('socket.io'),
    process = require('process'),
    config = require('./config'),
    socketioredis = require('socket.io-redis');

var app = express();
var server = app.listen(process.argv[2]);
var io = socketio(server);

console.log(`socket server started at ${process.argv[2]}`)
app.use(express.static(__dirname + '/public'));

io.adapter(socketioredis({host: config.redis_host, port: config.redis_port}));

io.on('connection', (socket) => {
    socket.on('room.join', (room) => {
        console.log(socket.rooms);
        Object.keys(socket.rooms)
        .filter((r) => r != socket.id)
        .forEach((r) => socket.leave(r));

        setTimeout(() => {
            socket.join(room);
            socket.emit('event', 'Joined room ' + room);
            socket.broadcast.to(room).emit('event', 'Someone Joined room ' + room);
        }, 0);

        socket.on('event', (e) => {
            socket.broadcast.to(room).emit('event', e.name + " says hello");
        });
    });
});