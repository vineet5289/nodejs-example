const express = require('express');
const socketio = require('socket.io');
// Load MongoDB utils
let namespaces = require('./data/namespaces');

const app = express();

app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(9000);
const io = socketio(expressServer);

//main namespace connection
io.on('connection', (socket) => {
    //build an array to send back with image and end points for each ns
    let nsData = namespaces.map((ns) => {
        return {
            img: ns.img,
            endpoint: ns.endpoint
        }
    });

    //send ns data back to the client
    socket.emit('nsList', nsData);
});


//loop all namespace
namespaces.forEach((namespace) => {
    io.of(namespace.endpoint).on('connection', (nsSocket) => {
        const userName = nsSocket.handshake.query.userName;
        // console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
        // a socket has connected to one of our chatgroup namespaces, sending that namespace group details back
        nsSocket.emit('nsRoomLoad', namespace.rooms);
        nsSocket.on('joinRoom', (roomToJoin, numberOfUserUpdateCallback) => {
            nsSocket.join(roomToJoin);
            // io.of('/wiki').in(roomToJoin).clients((err, clients) => {
            //     numberOfUserUpdateCallback(clients.length);    
            // });
            const roomTitle = Object.keys(nsSocket.rooms)[1];
            nsSocket.leave(roomTitle);
            updateUserCountInRoom(namespace, roomTitle);
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === roomToJoin;
            });

            nsSocket.emit('historyCatchUp', nsRoom.history);
            // send number of user in this room to all socket connected with this room
            updateUserCountInRoom(namespace, roomToJoin);
        });
        nsSocket.on('newMessgaeToServer', (msg) => {
            const fullMessgae = {
                text: msg.text,
                time: Date.now(),
                userName: userName,
                avatar: 'https://via.placeholder.com/30'
            }
            const roomTitle = Object.keys(nsSocket.rooms)[1];
            //find room details
            console.log(`=>${userName}<=`);
            console.log(`=>${roomTitle}<=`);
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === roomTitle;
            });
            nsRoom.addMessage(fullMessgae);
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMessgae);
        });
    });
});

function updateUserCountInRoom(namespace, roomToJoin) {
    io.of(namespace.endpoint).in(roomToJoin).clients((err, clients) => {
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length);
    });
}

function mongodbConnection() {
    // Connect to MongoDB and put server instantiation code inside
    // because we start the connection first
    MongoDB.connectDB(async (err) => {
        if (err) throw err
        // Load db & collections
        const db = MongoDB.getDB()
        const messages = db.collection('messages')

        // try {
        //     // Run some sample operations
        //     // and pass users collection into models
        //     const newUser = await Users.createUser(users, seedUser)
        //     const listUsers = await Users.getUsers(users)
        //     const findUser = await Users.findUserById(users, newUser._id)

        //     console.log('CREATE USER')
        //     console.log(newUser)
        //     console.log('GET ALL USERS')
        //     console.log(listUsers)
        //     console.log('FIND USER')
        //     console.log(findUser)
        // } catch (e) {
        //     throw e
        // }
    });
}