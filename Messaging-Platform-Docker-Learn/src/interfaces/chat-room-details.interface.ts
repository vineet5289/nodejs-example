import { MessageStatusType } from '../common/enums';

export interface ChatRoomDetailsResponseDto {
    user_id: number;
    chat_room_id: number;
    last_message_updated_at?: Date;
    have_unread_messages?: boolean;
    message_status?: MessageStatusType;
    last_message?: string;
    last_message_id?: string;
    chat_room_title?: string;
    participants?: any;
    is_active?: number;
    is_deleted?: number;
    created_epoch?: number;
  }
