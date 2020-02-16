const express = require('express'),
    session = require('express-session'),
    socketio = require('socket.io'),
    router = require('./routes.js'),
    sockets = require('./sockets.js');

var app = express();

var server = app.listen(8080);
var io = socketio(server);

app.use('/', router);

var bears = io.of('/bears');
var cubs = io.of('/cubs');

bears.on('connection', sockets.brarsNamespace);
cubs.on('connection', sockets.cubsNamespace);

io.on('connection', (socket) => {

});
// create session middleware
// var sessionMiddleware = session({
//     secret: 'make this a good secret',
//     resave: false,
//     saveUninitialized: true
// });

// //set up express to use session middleware
// app.use(sessionMiddleware);
// app.use((req, res, next) => {
//     console.log(`From Express: ${req.session.name}`);
//     next();
// });

// app.use(express.static(__dirname + '/public'));

// //socket.io middleware
// io.use((socket, next) => {
//     sessionMiddleware(socket.request, {}, next);
// });

// io.on('connection', (socket) => {
//     if(socket.request.session.name !== undefined) {
//         socket.emit('name', socket.request.session.name);
//         io.emit('event', socket.request.session.name + ' has joine');
//     }

//     socket.on('name', (name) => {
//         socket.request.session.name = name;
//         socket.request.session.save();
//         socket.broadcast.emit('event', name + ' say hello');
//     });
// });