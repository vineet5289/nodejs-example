class Room{
    constructor(roomId, roomTitle, namespace, privateRoom = false){
        this.roomId = roomId;
        this.roomTitle = roomTitle;
        this.namespace = namespace;
        this.privateRoom = privateRoom;
        this.history = [];
    }
    addMessage(message){
        this.history.push(message);
    }
    clearHistory(){
        this.history = [];
    }
}
// Add default namespace
const CreateRoom = async (rooms, room) => {
    try {
        const results = await rooms.insertOne(room)
        return results.ops[0]
    } catch (e) {
        throw e
    }
}

const FetchRooms = async (rooms) => {
    try {
        const results = await rooms.find().toArray()
        return results
    } catch (e) {
        throw e
    }
}

module.exports = {Room, CreateRoom, FetchRooms};