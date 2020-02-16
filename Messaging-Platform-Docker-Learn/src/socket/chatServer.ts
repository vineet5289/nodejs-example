import chatRoomController from '../api/v1/controllers/chat-room.controller';
import UserController from '../api/v1/controllers/user.controller';
import { EventType } from '../common/enums';
import Redis from '../db/redis';
import { UpdateChatMessageStatusDto } from '../interfaces/chat-message-status.interface';
import { Message } from '../interfaces/message.interface';
import ChatMessageStatusDao from '../repository/chat-message-status.dao';
import { APIError } from '../util/httpErrors.util';
import { intToString } from '../util/index.util';
import logger from '../util/logger.util';
import IO from './io';
const uuid = require('uuid/v1');

export function configureSocket() {
  const io = IO.getInstance();
  const redisCli = Redis.getInstance();

  /**
   * io.use will be triggered as soon as a connection is made with socket.io.
   */
  io.use((socket: any, next: any) => {
    // Connection is not allowed if user iD is not found.
    if (socket.handshake.query.userToken) {
      let userId: any;
      UserController.getUserByUserToken(
        socket.handshake.query.userToken,
        (err, user) => {
          if (err) {
            logger.error(
              `User authentication failed with error message ${err.message}`
            );
            next(APIError.errUnauthorized('User authentication failed.'));
          } else {
            userId = user.user_id;
            redisCli.set(`users:${userId}`, socket.id);
            // As soon as socket connection is stablished. Make sure socket is listening to
            // all the chat rooms user is part of.
            UserController.getChatRoomByUserID(userId, (chatRoomList) => {
              chatRoomList.forEach((chatRoom: any) => {
                logger.info(
                  `User[id: + ${userId} + ] joined chat room[id: + ${chatRoom.chat_room_id} +]`
                );
                socket.join(chatRoom.chat_room_id);
              });
            });

            // Register different event handlers
            socket.on(EventType.DISCONNECT, (data: Message) => {
              socket.leave(data.room);
            });

            socket.on(EventType.MESSAGE, newMessageEvent(userId, io, socket));

            // Portal should info chat
            socket.on(
              EventType.MARK_CHAT_AS_READ,
              markMessageStatusReadEvent(userId)
            );

            emitAuthenticationSuccessMessageEvent(
              io,
              socket.id,
              EventType.AUTHENTICATED,
              'Socket connection successful'
            );
            return next();
          }
        }
      );
    } else {
      emitErrorMessageEvent(
        io,
        socket.id,
        EventType.CONNECTION_ERROR,
        'User authentication token is missing.'
      );
    }
  });
}

export function newMessageEvent(userId: number, io: any, socket: any) {
  return (data: Message) => {
    if (data.message) {
      data.last_message_updated_at = new Date();
      data.message_id = uuid();
      data.user = intToString(userId);
      data.sender_id = intToString(userId);
      // Save chat to NoSQL database asynchronously
      chatRoomController.saveChatAsync(data);
      ChatMessageStatusDao.markChatRoomUnreadAndIncrementUnreadCounter(
        parseInt(data.room, 10),
        data.last_message_updated_at,
        1
      );

      // Braodcast received message to all the users on that chat room.
      emitChatMessageEvent(io, data, EventType.NEW_MESSAGE);
    } else {
      emitErrorMessageEvent(
        io,
        socket.id,
        EventType.INVALID_CHAT_MESSAGE,
        'received empty chat message'
      );
    }
  };
}

export function markMessageStatusReadEvent(userId: number) {
  return (updateChatMessageStatusDto: UpdateChatMessageStatusDto) => {
    if (updateChatMessageStatusDto.chat_room_id) {
      ChatMessageStatusDao.markUserChatRoomReadAndResetUnreadCounter(
        updateChatMessageStatusDto.chat_room_id,
        userId
      );
    } else {
      logger.error('Received undefined chat room id');
    }
  };
}

export function emitChatMessageEvent(io: any, data: any, eventType: EventType) {
  io.to(data.room).emit(eventType, {
    user: data.sender_id,
    message: data.message,
    room: data.room,
    created_at: data.last_message_updated_at,
    unread_message_count: 1,
  });
}

export function emitErrorMessageEvent(
  io: any,
  socketId: any,
  eventType: EventType,
  message: string
) {
  io.to(socketId).emit(eventType, { message });
}

export function emitAuthenticationSuccessMessageEvent(
  io: any,
  socketId: any,
  eventType: EventType,
  message: string
) {
  io.to(socketId).emit(eventType, { message });
}
