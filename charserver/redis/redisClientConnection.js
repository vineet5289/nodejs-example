const redis = require('redis');
//create connection with redis
const client = redis.createClient(8089, 'localhost'); // this creates a new client

client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log(`Something went wrong ${err}`);
});

module.exports = client;