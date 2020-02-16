const express = require('express'),
    socketio = require('socket.io'),
    process = require('process'),
    redis = require('./redis.js');

var app = express();
app.use(express.static(__dirname + '/public'));

var server = app.listen(8080);
var io = socketio(server);

var errorEmit = (socket) => {
    return (err) => {
        console.log(err);
        socket.broadcast.emit('user.event', 'Something went wrong!');
    };
};

io.on('connection', (socket) => {
    socket.on('room.join', (room) => {
        console.log(socket.rooms);
        Object.keys(socket.rooms).filter((r) => r != socket.id)
        .forEach((r) => socket.leave(r));

        setTimeout(() => {
            socket.join(room);
            socket.emit('event', 'Joined room ' + room);
            socket.broadcast.to(room).emit('event', 'Someone joined room ' + room);
        }, 0);
    });
    socket.on('event', (e) => {
        socket.broadcast.to(e.room).emit('event', e.name + ' says hello!');
    });
    //console.log(socket)
    // socket.broadcast.emit('user.events', 'someone has joined');
    // socket.on('name', (name) => {
    //     redis.storeUser(socket.id, name)
    //         .then(() => {
    //             console.log(`${name} say hello!`);
    //             socket.broadcast.emit('name', name);
    //         }, errorEmit(socket));
    // });

    // socket.on('disconnect', () => {
    //     redis.getUser(socket.id)
    //         .then((user) => {
    //             if (user == null) return 'Someone';
    //             else return user;
    //         })
    //         .then((user) => {
    //             console.log(`${user} has left`);
    //             socket.broadcast.emit('user.events', `${user} left room`);
    //         }, errorEmit(socket));
    // });
});

// start setting redis data
// redis.redisClient.flushall();
// redis.redisClient.hmset('dog:1', ['name', 'gizmo', 'age', '5']);
// redis.redisClient.hmset('dog:2', ['name', 'dexter', 'age', '6']);
// redis.redisClient.hmset('dog:3', ['name', 'fido', 'age', '5']);

// redis.redisClient.set('dog:name:gizmo', 'dog:1');
// redis.redisClient.set('dog:name:dexter', 'dog:2');
// redis.redisClient.set('dog:name:fido', 'dog:3');

// redis.redisClient.lpush('dog:age:5', ['dog:1', 'dog:3']);
// redis.redisClient.lpush('dog:age:6', 'dog:2');

// app.use((req, res, next) => {
//     console.time('request');
//     next();
// });

//default host api
// app.get('/dog/name/:name', (req, res) => {
//     var now = Date.now();

//     redis.redisClient.zadd('dog:last-lookup', [now, 'dog:name:' + req.params.name]);
//     redis.get('dog:name:' + req.params.name)
//     .then((data) => {
//         redis.redisClient.hset(data, 'last-lookup', now)
//         return data;
//     })
//     .then(redis.hgetall)
//     .then((data) => res.send(data));
//     console.timeEnd('request');
// });

// app.get('/dog/age/:age', (req, res) => {
//     redis.lrange('dog:age:' + req.params.age)
//     .then((data) => Promise.all(data.map(redis.hgetall)))
//     .then((data) => res.send(data));
//     console.timeEnd('request');
// });

// app.get('/dog/any', (req, res) => {
//     redis.zrevrangebyscore('dog:last-lookup', '+inf', '-inf')
//     .then((data) => Promise.all(data.map(redis.get)))
//     .then((data) => Promise.all(data.map(redis.hgetall)))
//     .then((data) => res.send(data));
//     console.timeEnd('request');
// });

// app.get('/dog/latest', (req, res) => {
//     var now = Date.now();
//     var minAgo = now - 60000;
    
//     redis.zrevrangebyscore('dog:last-lookup', now, minAgo)
//     .then((data) => Promise.all(data.map(redis.get)))
//     .then((data) => Promise.all(data.map(redis.hgetall)))
//     .then((data) => res.send(data));
//     console.timeEnd('request');
// });


// redis.redisClient.geoadd('places', 86.2520, 41.6764, 'South Bend');
// redis.redisClient.geoadd('places', 85.9767, 41.6820, 'Elkhart');
// redis.redisClient.geoadd('places', 87.6298, 41.8781, 'Chicago');

// app.get('/aroundsb/:miles', (req, res) => {
//     redis.aroundSB(parseInt(req.params.miles))
//     .then((data) => res.send(data));
// });

// app.get('/around/:long/:lat/:miles', (req, res) => {
//     redis.aroundLoc(parseInt(req.params.long, req.params.lat, req.params.miles))
//     .then((data) => res.send(data));
// });