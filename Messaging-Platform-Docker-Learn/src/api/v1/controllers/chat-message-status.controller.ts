import {
  DefaultMessageStatusCount,
  MessageStatusType
} from '../../../common/enums';
import {
  ChatMessageStatusDto,
  UnreadChatMessageCountDto
} from '../../../interfaces/chat-message-status.interface';
import ChatMessageStatusDao from '../../../repository/chat-message-status.dao';
import { CustomRequestHandler } from '../../../util/express.util';
import { APIError, PublicInfo } from '../../../util/httpErrors.util';
import { isAValidEnum } from '../../../util/index.util';
import logger from '../../../util/logger.util';

export default class ChatMessageStatusController {
  public static updateChatRoomMessageStatus: CustomRequestHandler = async (
    req,
    res,
    next
  ) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        return next(APIError.errUnauthorized());
      }
      const requiredFields = ['chat_room_id', 'message_status'];
      const givenFields = Object.getOwnPropertyNames(req.body);
      if (!requiredFields.every((field) => givenFields.includes(field))) {
        return next(APIError.errMissingBody());
      }

      const chatMessageStatusUpdate: ChatMessageStatusDto = req.body;
      if (
        !isAValidEnum(chatMessageStatusUpdate.message_status, MessageStatusType)
      ) {
        return next(
          APIError.errRequestBodyParameter(
            'Incorrect Message Status Update Request Data'
          )
        );
      }

      chatMessageStatusUpdate.user_id = loggedInUser.user_id;
      chatMessageStatusUpdate.unread_message_count = await ChatMessageStatusController.getOrDefaultMessageCount(
        chatMessageStatusUpdate.message_status,
        chatMessageStatusUpdate.unread_message_count
      );

      await ChatMessageStatusDao.updateMessageStatus(
        chatMessageStatusUpdate,
        (err: any, result: any) => {
          if (err) {
            return next(
              APIError.errResourceUpdateFailed('Meaasage status update failed')
            );
          } else if (!result || !result.value) {
            return next(APIError.errNotFound('Chat message record not found'));
          }
          res.json(PublicInfo.infoUpdated('Chat message status updated'));
        }
      );
    } catch (e) {
      return next(e);
    }
  };

  public static fetchUnReadMessageCount: CustomRequestHandler = async (
    req,
    res,
    next
  ) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        return next(APIError.errUnauthorized());
      }

      const unreadMessageAggCountResponse: UnreadChatMessageCountDto = {
        unread_message_count: 0,
        user_id: loggedInUser.user_id,
      };

      const unreadMessageAggCount: UnreadChatMessageCountDto[] = await ChatMessageStatusDao.countUserUnreadMessage(
        loggedInUser.user_id
      );
      if (unreadMessageAggCount && unreadMessageAggCount.length > 0) {
        unreadMessageAggCountResponse.unread_message_count =
          unreadMessageAggCount[0].unread_message_count;
      }
      res.json(PublicInfo.infoSelected(unreadMessageAggCountResponse));
    } catch (e) {
      return next(e);
    }
  };

  private static getOrDefaultMessageCount = async (
    messageStatus: MessageStatusType,
    messageStatusCount?: number
  ) => {
    if (messageStatusCount) {
      return messageStatusCount;
    } else if (messageStatus && messageStatus === MessageStatusType.UNREAD) {
      return DefaultMessageStatusCount.UNREAD;
    }
    return DefaultMessageStatusCount.READ;
  };
}
