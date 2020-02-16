const io = require('./index.js'),
    redis = require('./redis.js');

//var io = socketio(server);

var errorEmit = (socket) => {
    return (err) => {
        console.log(err);
        socket.broadcast.emit('user.event', 'Something went wrong!');
    };
};

io.on('connection', (socket) => {
    console.log(socket)
    socket.broadcast.emit('user.events', 'someone has joined');
    socket.on('name', (name) => {
        redis.storeUser(socket.id, name)
            .then(() => {
                console.log(`${name} say hello!`);
                socket.broadcast.emit('name', name);
            }, errorEmit(socket));
    });

    socket.on('disconnect', () => {
        redis.getUser(socket.id)
            .then((user) => {
                if (user == null) return 'Someone';
                else return user;
            })
            .then((user) => {
                console.log(`${user} has left`);
                socket.broadcast.emit('user.events', `${user} left room`);
            }, errorEmit(socket));
    });
});

