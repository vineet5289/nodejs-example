import { MessageStatusOrder, MessageStatusType } from '../common/enums';
import { CollectionName } from '../common/mongodb.constant';
import { SearchDefaultEnum } from '../constants/search.constants';
import Mongo from '../db/mongodb';
import { ChatMessageStatusDto } from '../interfaces/chat-message-status.interface';
import { ChatRoomDetailsSearchFilters } from '../interfaces/dataObject.interface';

export default class ChatMessageStatusDao {
  public static async insertOrIgnoreIfExits(
    chatMessageStatusDto: ChatMessageStatusDto,
    callback: any
  ) {
    const collection = Mongo.getInstance().collection('chat_message_status');
    const messageStatusDoc = await collection
      .findOne({
        user_id: chatMessageStatusDto.user_id,
        chat_room_id: chatMessageStatusDto.chat_room_id,
      })
      .then((record: any) => record);

    if (!messageStatusDoc) {
      chatMessageStatusDto.message_status_order = ChatMessageStatusDao.setMessageStatusOrder(
        chatMessageStatusDto.message_status,
        chatMessageStatusDto.message_status_order
      );
      return await collection.insertOne(
        ChatMessageStatusDao.createMessageStatusObject(chatMessageStatusDto),
        callback
      );
    } else {
      return callback(undefined, messageStatusDoc);
    }
  }

  public static async updateMessageStatus(
    chatMessageStatusDto: ChatMessageStatusDto,
    callback: any
  ) {
    const collection = Mongo.getInstance().collection('chat_message_status');
    return await collection.findOneAndUpdate(
      {
        user_id: chatMessageStatusDto.user_id,
        chat_room_id: chatMessageStatusDto.chat_room_id,
      },
      {
        $set: ChatMessageStatusDao.createMessageStatusObject(
          chatMessageStatusDto
        ),
      },
      callback
    );
  }

  /**
   * @param chat_room_id
   * @param new_last_updated_at
   * @param new_message_status
   * It take chat room id, update time stamp, message_status and update all document belong to given chat room id
   */
  public static async updateChatRoomMessageStatus(
    updateClause: any,
    updatedValue: any,
    upsertClause: any
  ) {
    const collection = Mongo.getInstance().collection('chat_message_status');
    return await collection.updateMany(
      updateClause,
      updatedValue,
      upsertClause
    );
  }

  /**
   * @param chat_room_id
   * @param new_last_updated_at
   * @param unread_message_count
   * It take chat room id, update time stamp, message_status, increase unread message count
   * and update all document belong to given chat room id
   */
  public static async markChatRoomUnreadAndIncrementUnreadCounter(
    chat_room_id: number,
    new_last_updated_at: Date,
    unread_message_count: number
  ) {
    const updatedValue = {
      $set: {
        message_status: MessageStatusType.UNREAD,
        message_status_order: ChatMessageStatusDao.setMessageStatusOrder(
          MessageStatusType.UNREAD
        ),
        last_message_updated_at: new_last_updated_at,
      },
      $inc: { unread_message_count },
    };

    const updateClause = { chat_room_id };
    const upsertClause = { upsert: false };
    return ChatMessageStatusDao.updateChatRoomMessageStatus(
      updateClause,
      updatedValue,
      upsertClause
    );
  }

  /**
   * @param chatRoomId
   * @param userId
   * It take chat room id and userId, mark message status to read and reset unread message counter
   */
  public static async markUserChatRoomReadAndResetUnreadCounter(
    chatRoomId: number,
    userId: number
  ) {
    const updatedValue = {
      $set: {
        message_status: MessageStatusType.READ,
        message_status_order: ChatMessageStatusDao.setMessageStatusOrder(
          MessageStatusType.READ
        ),
        unread_message_count: 0,
      },
    };

    const updateClause = { chat_room_id: chatRoomId, user_id: userId };
    const upsertClause = { upsert: false };

    return ChatMessageStatusDao.updateChatRoomMessageStatus(
      updateClause,
      updatedValue,
      upsertClause
    );
  }

  public static async findByUserAndChatRoomId(
    userId: number,
    chatRoomId: number
  ) {
    const collection = Mongo.getInstance().collection('chat_message_status');

    return await collection
      .findOne({ user_id: userId, chat_room_id: chatRoomId })
      .then((record: any) => record);
  }

  public static async findByUserIdOrderByLastUpdateAt(
    userId: number,
    chatRoomId: number
  ) {
    const collection = Mongo.getInstance().collection('chat_message_status');

    return await collection
      .find({ user_id: userId, chat_room_id: chatRoomId })
      .then((record: any) => record);
  }

  public static async findByUserIdAndOption(
    userId: number,
    options: ChatRoomDetailsSearchFilters
  ) {
    const collection = await Mongo.getInstance().collection(
      CollectionName.ChatMessageStatus
    );
    const whereCondition: any = {};
    whereCondition.user_id = userId;
    if (options.query && options.query !== SearchDefaultEnum.DefaultQuery) {
      whereCondition.message_status = options.query;
    }
    if (options.include_chat_room && options.include_chat_room.length > 0) {
      whereCondition.chat_room_id = { $in: options.include_chat_room };
    }

    return collection
      .find(whereCondition)
      .sort(options.sort)
      .limit(options.limit)
      .skip(options.page * options.limit)
      .toArray();
  }

  public static async findByChatRoomId(chatRoomId: number) {
    const collection = Mongo.getInstance().collection('chat_message_status');

    return collection.find({ chat_room_id: chatRoomId }).toArray();
  }

  public static async countUserUnreadMessage(userId: number) {
    const collection = Mongo.getInstance().collection('chat_message_status');
    return collection
      .aggregate([
        {
          $match: {
            user_id: userId,
          },
        },
        {
          $group: {
            _id: undefined,
            user_id: { $first: '$user_id' },
            unread_message_count: {
              $sum: '$unread_message_count',
            },
          },
        },
      ])
      .toArray();
  }

  private static createMessageStatusObject(
    chatMessageStatusDto: ChatMessageStatusDto
  ) {
    const messageStatusData: any = {
      user_id: chatMessageStatusDto.user_id,
      chat_room_id: chatMessageStatusDto.chat_room_id,
    };
    if (
      chatMessageStatusDto.message_id &&
      chatMessageStatusDto.message_id !== ''
    ) {
      messageStatusData.message_id = chatMessageStatusDto.message_id;
    }
    if (chatMessageStatusDto.last_message_updated_at) {
      messageStatusData.last_message_updated_at =
        chatMessageStatusDto.last_message_updated_at;
    }

    if (chatMessageStatusDto.message_status) {
      messageStatusData.message_status = chatMessageStatusDto.message_status;
    }

    if (chatMessageStatusDto.message_status_order) {
      messageStatusData.message_status_order =
        chatMessageStatusDto.message_status_order;
    } else {
      messageStatusData.message_status_order = ChatMessageStatusDao.setMessageStatusOrder(
        chatMessageStatusDto.message_status
      );
    }

    if (chatMessageStatusDto.unread_message_count) {
      messageStatusData.unread_message_count =
        chatMessageStatusDto.unread_message_count;
    }

    return messageStatusData;
  }

  private static setMessageStatusOrder = (
    messageStatus: MessageStatusType,
    messageStatusOrder?: MessageStatusOrder
  ) => {
    return messageStatusOrder
      ? messageStatusOrder
      : ChatMessageStatusDao.getMessageStatusOrder(messageStatus);
  };

  private static getMessageStatusOrder = (messageStatus: MessageStatusType) => {
    switch (messageStatus) {
      case MessageStatusType.READ:
        return MessageStatusOrder.READ;
      case MessageStatusType.UNREAD:
        return MessageStatusOrder.UNREAD;
      case MessageStatusType.SENT:
        return MessageStatusOrder.SENT;
      case MessageStatusType.DELETED:
        return MessageStatusOrder.DELETED;
      case MessageStatusType.RECEIVED:
        return MessageStatusOrder.RECEIVED;
      default:
        return MessageStatusOrder.READ;
    }
  };
}
