let socket = io.connect('http://localhost:8080');

function init() {
    draw();
    socket.emit('init', {
        playerName = player.name
    });
}

socket.on('initReturn', (data) => {
    orbs = data.orbs;
});