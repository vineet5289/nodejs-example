export interface Message {
  room: string;
  message: string;
  user: string;
  last_message_updated_at: Date;
  sender_id: string;
  message_id: string;
}

export interface MessageSearchIndexFieldPropertiesDto {
  type: boolean;
  index: boolean;
  store: boolean;
}

export interface MessageSearchCreateIndexDto {
  template: string;
  order: number;
  settings: {
    number_of_shards: number;
    number_of_replicas: number;
  };
  mappings: {
    properties: {
      chat_room_id: MessageSearchIndexFieldPropertiesDto;
      message_id: MessageSearchIndexFieldPropertiesDto;
      message: MessageSearchIndexFieldPropertiesDto;
      user_ids: MessageSearchIndexFieldPropertiesDto;
      is_deleted: MessageSearchIndexFieldPropertiesDto;
      is_active: MessageSearchIndexFieldPropertiesDto;
      created_at: MessageSearchIndexFieldPropertiesDto;
      created_epoch: MessageSearchIndexFieldPropertiesDto;
    };
  };
}

export interface MessageSearchCreateDocumentDto {
  chat_room_id: number;
  message_id: string;
  message: string;
  user_ids: number[];
  is_deleted: boolean;
  is_active: boolean;
  created_at: Date;
  created_epoch: Date;
}

export const convertToMessageSearchDocuments = (
  chatRoomId: number,
  data: Message,
  userIds: number[]
) => {
  const messageDocument: MessageSearchCreateDocumentDto = {
    chat_room_id: chatRoomId,
    message_id: data.message_id,
    message: data.message,
    user_ids: userIds,
    created_at: data.last_message_updated_at,
    created_epoch: data.last_message_updated_at,
    is_active: true,
    is_deleted: false,
  };
  return messageDocument;
};
