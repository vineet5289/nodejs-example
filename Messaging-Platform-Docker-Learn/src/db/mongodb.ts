import mongodb from 'mongodb';
import logger from '../util/logger.util';
const config = require('../config/config');

export default class Mongo {
  public static getInstance(callback?: any) {
    if (!Mongo.instance) {
      Mongo.createInstance(callback);
    }
    return Mongo.instance;
  }
  private static instance: any;

  private static createInstance(callback?: any) {
    mongodb.MongoClient.connect(
      config.db.url,
      { useUnifiedTopology: true, useNewUrlParser: true },
      async (err: any, client: any) => {
        if (err) {
          throw new Error(`Could not connect to MongoDB: ${err}`);
        } else {
          Mongo.instance = client.db('messaging_platform');
          const chatMessageStatus = Mongo.instance.collection('chat_message_status');
          await chatMessageStatus.createIndex(
            {user_id: 1, chat_room_id: 1},
            {unique: true},
            (createIndexErr: any, result: any) => {
            if (createIndexErr) {
              logger.info(err);
            } else {
              logger.info(result);
            }
          });
          if (callback) {
            callback();
          }
        }
      }
    );
  }
}
