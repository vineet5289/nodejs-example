import Mongo from '../db/mongodb';
import Redis from '../db/redis';
import { Message } from '../interfaces/message.interface';
import Crypto from '../util/crypto.util';

export default class ChatRoomDao {
  public static async getDocumentId(chatRoomId: number) {
    if (chatRoomId) {
      let documentId = await Redis.getValueAsync(`chat-room:${chatRoomId}`);
      if (!documentId) {
        const chatRoom = await ChatRoomDao.findOne(chatRoomId);
        if (chatRoom) {
          Redis.getInstance().set(
            `chat-room:${chatRoomId}`,
            chatRoom._id,
            'EX',
            60 * 60 * 24
          ); // Expiry 24 hours
          documentId = chatRoom._id;
        }
      }
      return documentId;
    }
  }

  /**
   * Method returns a chat-room
   * @param chatRoomId  chat-room id
   */
  public static async findOne(chatRoomId: number) {
    const collection = Mongo.getInstance().collection('chat_rooms');

    return await collection
      .findOne({ chat_room_id: chatRoomId })
      .then((record: any) => {
        if (record && record.messages) {
          record.messages = [];
        }
        return record;
      });
  }

  public static async findChatHistory(
    chatRoomId: number,
    pageSize: number,
    page: number
  ) {
    const collection = Mongo.getInstance().collection('chat_rooms');
    return await collection
      .findOne({ chat_room_id: chatRoomId })
      .then((record: any) => {
        if (record) {
          record.total_pages = Math.ceil(record.total_items / pageSize);
          record.page = Math.min(page, record.total_pages);
          record.page_size = pageSize;

          if (record.messages && record.messages.length > 0) {
            // Start index can't be negative
            const startIndex = Math.max(
              record.total_items - page * pageSize,
              0
            );
            let endIndex = startIndex + pageSize;

            if (startIndex === 0) {
              // End index can't be negative
              endIndex = Math.max(
                record.total_items - (page - 1) * pageSize,
                0
              );
            }
            record.messages = record.messages.slice(startIndex, endIndex);

            for (const i in record.messages) {
              if (record.messages[i] && record.messages[i].message) {
                record.messages[i].message = Crypto.decrypt(
                  record.messages[i].message,
                  record._id
                );
              }
            }
          }
        }
        return record;
      });
  }

  /**
   * The method creates a new chat-room. If does not check if chat-room already exist.
   * @param body JSON Object to representing chat-room
   */
  public static async insertOne(body: any, callback: any) {
    const collection = Mongo.getInstance().collection('chat_rooms');

    collection.insertOne(body, (err: any, result: any) => {
      callback(err, result.ops[0]);
    });
  }

  /**
   * Update chat-room document
   * @param body JSON object with field to be updated
   */
  public static async updateOne(chatRoomId: number, body: any) {
    const collection = Mongo.getInstance().collection('chat_rooms');

    return await collection.updateOne(
      { chat_room_id: chatRoomId },
      {
        $set: body,
      }
    );
  }

  /**
   * Push a new message in chat-room
   * @param body JSON object with field to be updated
   */
  public static async appendMessage(chatRoomId: number, body: any, data: any) {
    const collection = Mongo.getInstance().collection('chat_rooms');
    const documentID = await this.getDocumentId(chatRoomId);
    data.message = Crypto.encrypt(data.message, documentID);

    return await collection.updateOne(
      { chat_room_id: chatRoomId },
      {
        $set: body,
        $inc: { total_items: 1 },
        $push: {
          messages: data,
        },
      }
    );
  }

  public static async findAndMapChatRoomsLastMessageByChatRoomIds(
    chatRoomIds: number[]
  ) {
    const collection = Mongo.getInstance().collection('chat_rooms');
    return collection
      .find(
        { chat_room_id: { $in: chatRoomIds } },
        {
          chat_room_id: 1,
          last_message: 1,
          last_message_updated_at: 1,
        }
      )
      .toArray();
  }
}
