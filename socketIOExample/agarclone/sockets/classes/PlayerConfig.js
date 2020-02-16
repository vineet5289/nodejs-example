// data related to specific player, no other player need to know

class PlayerConfig {
    constructor(settings) {
        this.xVector = 0;
        this.yVector = 0;
        this.speed = settings.defaultSpeed
    }
}

module.exports = PlayerConfig