var http = require('http'),
    app = require('express')(),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    logger = require('winston'),
    program = require('commander');
    
//  
// SETUP
//

logger.cli();
logger.default.transports.console.timestamp = true;
    
program.version('0.1')
    .option('-p, --port [num]', 'Set the server port (default 8080)')
    .option('-H, --disableheartbeats', 'Disable heartbeats')
    .parse(process.argv)
    
var server = "localhost";
if(program.args.length==1) {
    server = program.args[0];
} else if (program.args.length==0) {
    logger.warn("Defaulting to localhost.");
}

var port = 8080;
if(program.port) {
    logger.info("Setting port to " + program.port);
    port = program.port;
}

app.listen(port);

if(program.disableheartbeats) {
    io.set("heartbeats", false)
}

io.set("log level", 0);


//
// LISTENERS
//

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


//
// GLOBALS
//
var connectedUsersCount = 0;
var messagesPerSecond = 0;

io.sockets.on('connection', function(socket) {
    connectedUsersCount++;
    
    socket.on('chat', function(data) {
        // logger.info("chat message arrived");
        io.sockets.emit('chat', {text:data.text});
        
        messagesPerSecond++;
    });

    socket.on('disconnect', function(data) {
        connectedUsersCount--;
    });
});

setTimeout(logStatus, 1000);

//
// FUNCTIONS
//

function logStatus() {
    setTimeout(logStatus, 1000);
    
    
    logger.info("users: " + connectedUsersCount + "\tmessagesPerSecond: " + messagesPerSecond);
    messagesPerSecond = 0;
}

