enum EventType {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  MESSAGE = 'message',
  NEW_MESSAGE = 'new_message',
  MARK_CHAT_AS_READ = 'mark_chat_as_read',
  AUTHENTICATED = 'authenticated',
  CONNECTION_ERROR = 'socket_connection_failed',
  MESSAGE_PROCESS_ERROR = 'socket_connection_failed',
  INVALID_CHAT_MESSAGE = 'invalid chat message',
}

enum MessageStatusType {
  SENT = 'sent',
  RECEIVED = 'received',
  READ = 'read',
  UNREAD = 'unread',
  DELETED = 'deleted',
}

enum MessageStatusOrder {
  UNREAD = 0,
  READ = 1,
  SENT = 2,
  RECEIVED = 3,
  DELETED = 4,
}

enum ChatRoomSearchSortableFieldEnum {
  UpdatedAtASC = 'updatedatasc',
  UpdatedAtDESC = 'updatedatdesc',
}

enum DefaultMessageStatusCount {
  UNREAD = 1,
  READ = 0,
  SENT = 1,
  RECEIVED = 1,
  DELETED = 0,
}

export {
  EventType,
  MessageStatusType,
  ChatRoomSearchSortableFieldEnum,
  MessageStatusOrder,
  DefaultMessageStatusCount
};
