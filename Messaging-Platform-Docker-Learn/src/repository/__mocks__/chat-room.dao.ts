export default class ChatRoomDao {
  public static async findOne(chatRoomId: number) {
    if (!chatRoomId || chatRoomId === 10) {
      return Promise.resolve(undefined);
    } else {
      return Promise.resolve({
        _id: '5dd65ae632667e325f7470a9',
        chat_room_id: 692,
        chat_room_title: 'Updated Title',
        last_message: '',
        is_active: 1,
        is_deleted: 0,
        created_at: '2019-11-21T09:02:34.000Z',
        total_items: 2,
        messages: [
          { from: 1, message: 'test message 1' },
          { from: 2, message: 'test message 2' }
        ]
      });
    }
  }

  public static async findChatHistory(
    chatRoomId: number,
    pageSize: number,
    page: number
  ) {
    if (!chatRoomId || chatRoomId === 10) {
      return Promise.resolve(undefined);
    } else {
      return Promise.resolve({
        _id: '5dd65ae632667e325f7470a9',
        chat_room_id: 692,
        chat_room_title: 'Updated Title',
        last_message: '',
        is_active: 1,
        is_deleted: 0,
        created_at: '2019-11-21T09:02:34.000Z',
        total_items: 2,
        messages: [
          { from: 1, message: 'test message 1' },
          { from: 2, message: 'test message 2' }
        ]
      });
    }
  }

  public static async insertOne(body: any, callback: any) {
    callback(undefined, {
      _id: '5dd65ae632667e325f7470a9',
      chat_room_id: 692,
      chat_room_title: 'Updated Title',
      last_message: '',
      is_active: 1,
      is_deleted: 0,
      created_at: '2019-11-21T09:02:34.000Z',
      total_items: 2,
      messages: [
        { from: 1, message: 'test message 1' },
        { from: 2, message: 'test message 2' }
      ]
    });
  }

  public static async updateOne(chatRoomId: number, body: any) {
    return Promise.resolve({
      total_items: 2,
      messages: [
        { from: 1, message: 'test message 1' },
        { from: 2, message: 'test message 2' }
      ]
    });
  }

  /**
   * Push a new message in chat-room
   * @param body JSON object with field to be updated
   */
  public static async appendMessage(
    chatRoomId: number,
    body: any,
    message: any
  ) {
    return Promise.resolve({
      total_items: 2,
      messages: [
        { from: 1, message: 'test message 1' },
        { from: 2, message: 'test message 2' }
      ]
    });
  }
}
