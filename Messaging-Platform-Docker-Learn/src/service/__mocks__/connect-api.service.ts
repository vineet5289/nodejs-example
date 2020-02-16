export default class ConnectAPIService {
  public static async postChatRoom(req: any, res: any) {
    if (req.body.chat_room_title === 'DOES_NOT_EXIST') {
      return Promise.resolve({
        chat_room_id: 10,
        chat_room_title: 'Chat Room Title',
        last_message: '',
        is_active: 1,
        is_deleted: 0,
        created_at: '2019-11-21T09:02:34.000Z',
        last_message_updated_at: undefined,
        created_epoch: 1574326953856
      });
    } else {
      return Promise.resolve({
        _id: '5dd65ae632667e325f7470a9',
        chat_room_id: 692,
        chat_room_title: 'Updated Title',
        last_message: '',
        is_active: 1,
        is_deleted: 0,
        created_at: '2019-11-21T09:02:34.000Z',
        last_message_updated_at: undefined,
        created_epoch: 1574326953856,
        total_pages: undefined,
        page: undefined,
        page_size: 20
      });
    }
  }

  public static async patchChatRoom(url: string, data: any) {
    return Promise.resolve({
      _id: '5dd65ae632667e325f7470a9',
      chat_room_id: 692,
      chat_room_title: 'Updated Title',
      last_message: '',
      is_active: 1,
      is_deleted: 0,
      created_at: '2019-11-21T09:02:34.000Z',
      last_message_updated_at: undefined,
      created_epoch: 1574326953856,
      total_pages: undefined,
      page: undefined,
      page_size: 20
    });
  }
}
