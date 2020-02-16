const io = require('../server').io

const Orb = require('./classes/Orb');
const Player = require('./classes/Player');
const PlayerData = require('./classes/PlayerData');
const PlayerConfig = require('./classes/PlayerConfig');

let orbs = [];
let settings = {
    defaultOrbs: 500,
    defaultSpeed: 6,
    defaultSize: 6,
    // once player get bigger we need to zoom out 
    defaultZoom: 1.5,
    worldWidth: 600,
    worldHeight: 600
}
initGame();

io.sockets.on('connect', (socket) => {
    socket.on('init', (data) => {
        // make player config 
        let playerConfig = new PlayerConfig(settings);
        let playerData = new PlayerData(data.playerName, settings);
        let player = new Player(socket.id, playerConfig, playerData);
        socket.emit('initReturn', {
            orbs
        });
        players.push(player);
    });
});
//run at the beggining of game
function initGame() {
    for(let i = 0; i < settings.defaultOrbs; i++) {
        orbs.push(new Orb(settings));
    }
}

module.exports = io;