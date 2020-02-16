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

    socket.on('newMessgaeToServer', (msg) => {
        io.emit('messageToClient', {text: msg.text});
        console.log(msg);
    });
});