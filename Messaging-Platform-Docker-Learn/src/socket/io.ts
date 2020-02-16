const socketio = require('socket.io');
const conf = require('../config/config');
const redisAdapter = require('socket.io-redis');

export default class IO {
  public static getInstance() {
    return IO.instance;
  }

  public static initialize(server: any) {
    const sio = socketio(server, { origins: '*:*', serveClient: false });

    sio.adapter(
      redisAdapter({
        host: conf.redis.host,
        port: conf.redis.port,
        auth_pass: conf.redis.key,
      })
    );
    sio.set('origins', '*:*');
    IO.instance = sio;
    return IO.instance;
  }

  private static instance: any;
}
