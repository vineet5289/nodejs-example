const redis = require('redis');
const config = require('../config/config');
const { promisify } = require('util');

export default class Redis {
  /**
   * Return redis instance, if not created this will create a new one
   */
  public static getInstance() {
    if (!Redis.instance) {
      Redis.instance = Redis.createInstance();
    }
    return Redis.instance;
  }

  // Returns value from redis cache as promise
  public static async getValueAsync(key: string) {
    const client = this.getInstance();
    const redisGetAsync = promisify(client.get).bind(client);

    // Resolve promise
    return await redisGetAsync(key);
  }

  public static close(callback?: any) {
    if (Redis.instance) {
      Redis.instance.quit();
      if (callback) {
        callback();
      }
    }

    Redis.instance = undefined;
  }

  private static instance: any;

  /**
   * Create a new instance of redis client
   */
  private static createInstance() {
    const client = redis.createClient({
      host: config.redis.host,
      port: config.redis.port,
    });

    // Set key for authentication purpose
    client.auth(config.redis.key);
    return client;
  }
}
