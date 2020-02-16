import { Timestamp } from 'bson';

export interface ChatRoom {
  chat_room_id: number;
  last_message?: string;
  last_message_id?: string;
  last_message_updated_at?: Date;
  created_epoch?: Timestamp;
  created_at?: Date;
  is_active?: number;
  is_deleted?: number;
}
