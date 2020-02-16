const config = require('./config.js'),
    redis = require('redis');

//connect to redis
var redisClient = redis.createClient(config.redis_port, config.redis_host);

var promiser = (resolve, reject) => {
    return (err, data) => {
        if(err) reject(err);
        resolve(data);
    }
}

// var get = (key) => {
//     return new Promise((resolve, reject) => {
//         redisClient.get(key, promiser(resolve, reject));
//     });
// };

// var hgetall = (key) => {
//     return new Promise((resolve, reject) => {
//         if(key == null) reject();
//         redisClient.hgetall(key, promiser(resolve, reject));
//     });
// };

// var lrange = (key) => {
//     return new Promise((resolve, reject) => {
//         redisClient.lrange(key, [0, -1], (err, data) => {
//             if(err) reject(err);
//             resolve(data);
//         });
//     });
// };

// var zrevrangebyscore = (key, max, min) => {
//     console.log(`${key}, ${max}, ${min}`);
//     return new Promise((resolve, reject) => {
//         redisClient.zrevrangebyscore(key, max, min, promiser(resolve, reject));
//     });
// }

// var aroundLoc = (long, lat, miles) => {
//     return new Promise((resolve, reject) => {
//         redisClient.georadius('places', long, lat, miles, 'mi', 'WITHDIST', promiser(resolve, reject));
//     })
// }

// var aroundSB = (miles) => {
//     return new Promise((resolve, reject) => {
//         redisClient.georadiusbymember('places', 'South Bend', miles, 'mi', 'WITHDIST', promiser(resolve, reject));
//     })
// }

// module.exports.get = get;
// module.exports.hgetall = hgetall;
// module.exports.lrange = lrange;
// module.exports.zrevrangebyscore = zrevrangebyscore;
// module.exports.aroundLoc = aroundLoc;
// module.exports.aroundSB = aroundSB;


var storeUser = (socketId, user) => {
    return new Promise((resolve, reject) => {
        redisClient.setex(socketId, config.expire, user, promiser(resolve, reject));
    });
}

var getUser = (socketId, user) => {
    return new Promise((resolve, reject) => {
        redisClient.get(socketId, promiser(resolve, reject));
    });
}

module.exports.storeUser = storeUser;
module.exports.getUser = getUser;
module.exports.redisClient = redisClient;