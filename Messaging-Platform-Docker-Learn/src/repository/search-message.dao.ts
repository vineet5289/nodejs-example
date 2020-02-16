import {
  convertToMessageSearchDocuments,
  Message
} from '../interfaces/message.interface';
import { MessageSearchCreateDocumentDto } from '../interfaces/message.interface';
import ElasticSearchCommonUtil from '../util/elasticsearch/elasticSearchCommon.utils';
import ElasticSearchIndexUtil from '../util/elasticsearch/elasticSearchDocument.util';
import ChatMessageStatusDao from './chat-message-status.dao';
const messageSearchIndex = require('../config/config').messageSearchIndex;

export default class SearchMessageDao {
  public static addMessageDocument = async (data: Message) => {
    const chatRoomId: number = parseInt(data.room, 10);
    const indexName: string = ElasticSearchCommonUtil.constructMessagingIndexName(
      messageSearchIndex.indexNamePrefix
    );
    const userIds: number[] = await SearchMessageDao.findAllUserOfChatRoom(
      chatRoomId
    );

    const messageDocument: MessageSearchCreateDocumentDto = convertToMessageSearchDocuments(
      chatRoomId,
      data,
      userIds
    );

    ElasticSearchIndexUtil.addDocument(
      data.message_id,
      indexName,
      messageDocument
    );
  };

  private static findAllUserOfChatRoom = async (chatRoomId: number) => {
    const userIds: number[] = [];
    const chatRoomUsersRecords = await ChatMessageStatusDao.findByChatRoomId(
      chatRoomId
    );
    if (chatRoomUsersRecords && chatRoomUsersRecords.length > 0) {
      chatRoomUsersRecords.forEach((chatRoomUsersRecord: any) => {
        userIds.push(chatRoomUsersRecord.user_id);
      });
    }
    return userIds;
  };
}
