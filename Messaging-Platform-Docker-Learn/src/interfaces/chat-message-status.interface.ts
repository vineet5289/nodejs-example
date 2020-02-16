import { MessageStatusOrder, MessageStatusType } from '../common/enums';

export interface ChatMessageStatusDto {
  chat_room_id: number;
  user_id: number;
  message_id?: string;
  message_status: MessageStatusType;
  message_status_order?: MessageStatusOrder;
  last_message_updated_at?: Date;
  unread_message_count?: number;
}

export interface UnreadChatMessageCountDto {
  user_id: number;
  unread_message_count: number;
}

export interface UpdateChatMessageStatusDto {
  chat_room_id: number;
}
