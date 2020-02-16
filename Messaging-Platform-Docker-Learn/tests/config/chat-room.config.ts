export function getChatRoomJson() {
  return {
    userId: [24, 25],
    chat_room_title: 'Sample chat room',
  };
}

export function getChatRoomJsonWhenUserDoesNotExist() {
  return {
    userId: [24, -1],
    chat_room_title: 'Sample chat room',
  };
}
