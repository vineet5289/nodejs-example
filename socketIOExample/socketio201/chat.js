const express = require('express');
const app = express();
const socketio = require('socket.io');

app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on('connection', (socket) => {
    socket.emit('messageFromServer', {data: 'data to server'});
    socket.on('messageToServer', (dataToServer) => {
        console.log(dataToServer);
    });
    socket.join('level1');
    socket.to('level1').emit('joined', `${socket.id} says i have joined the level1`);
});

io.of('/admin').on('connection', (socket) => {
    console.log('Someone has already connected with admin namespace');
    io.of('/admin').emit('welcome', 'Welcome to the admin namespace');
});