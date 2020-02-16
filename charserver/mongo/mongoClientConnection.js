const mongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/messagedb";
let _db

const connectDB = async (callback) => {
    try {
        mongoClient.connect(url, (err, db) => {
            _db = db
            return callback(err)
        })
    } catch (e) {
        throw e
    }
}

const getDB = () => _db

const disconnectDB = () => _db.close()

module.exports = { connectDB, getDB, disconnectDB }