import { MessageStatusType } from "../../common/enums";
import Mongo from "../../db/mongodb";
import { ChatMessageStatusDto } from "../../interfaces/chat-message-status.interface";

export default class ChatMessageStatusDao {
  public static async insertOrIgnoreIfExits(
    chatMessageStatusDto: ChatMessageStatusDto,
    callback: any
  ) {
    return callback(undefined, {});
  }

  /**
   * this method is used as a mock method in unit test case.
   * Method return valuse based on following
   * a) when dto object is null then assume some internal server error happen in systme and return error
   * b) if chat_room_id => 1 & user_id => 1 then assume some internal server error happen in systme and return error
   * c) if chat_room_id => 2 & user_id => 1 then assume chat room record not present in mongo message status document
   * d) if chat_room_id => 3 & user_id => 1 then assume chat room record not present in mongo message status document
   * e) else chat message record present in mongo db and message status updated
   */
  public static async updateMessageStatus(
    chatMessageStatusDto: ChatMessageStatusDto,
    callback: any
  ) {
    if (
      !chatMessageStatusDto ||
      (chatMessageStatusDto.chat_room_id === 1 &&
        chatMessageStatusDto.user_id === 1)
    ) {
      callback(new Error(), undefined);
    } else if (
      chatMessageStatusDto.chat_room_id === 2 &&
      chatMessageStatusDto.user_id === 1
    ) {
      callback(undefined, undefined);
    } else if (
      chatMessageStatusDto.chat_room_id === 3 &&
      chatMessageStatusDto.user_id === 1
    ) {
      const result = {};
      callback(undefined, result);
    } else {
      const result = { value: 1 };
      callback(undefined, result);
    }
  }

  public static async findByUserAndChatRoomId(
    userId: number,
    chatRoomId: number
  ) {
    if (userId === 1 && chatRoomId === 2) {
      return { chat_room_id: chatRoomId, user_id: userId };
    } else {
      return undefined;
    }
  }

  /**
   * @param chat_room_id
   * @param new_last_updated_at
   * @param new_message_status
   * It take chat room id, update time stamp, message_status and update all document belong to given chat room id
   */
  public static async updateChatRoomMessageStatus(
    chat_room_id: number,
    new_last_updated_at: Date,
    new_message_status: MessageStatusType
  ) {
    const collection = Mongo.getInstance().collection("chat_message_status");
    return await collection.updateMany(
      { chat_room_id },
      {
        $set: {
          message_status: new_message_status,
          last_updated_at: new_last_updated_at
        }
      },
      { upsert: false }
    );
  }

  public static async findByUserIdOrderByLastUpdateAt(
    userId: number,
    chatRoomId: number
  ) {
    const collection = Mongo.getInstance().collection("chat_message_status");

    return await collection
      .find({ user_id: userId, chat_room_id: chatRoomId })
      .then((record: any) => record);
  }

  private static createMessageStatusObject(
    chatMessageStatusDto: ChatMessageStatusDto
  ) {
    const messageStatusData: any = {
      user_id: chatMessageStatusDto.user_id,
      chat_room_id: chatMessageStatusDto.chat_room_id
    };
    if (
      chatMessageStatusDto.message_id &&
      chatMessageStatusDto.message_id !== ""
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
    return messageStatusData;
  }
}
