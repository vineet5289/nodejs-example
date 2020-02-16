import { NextFunction, Response } from 'express';
import { ApiErrorCode } from '../../../common/api-error-code.constant';
import {
  ChatRoomSearchSortableFieldEnum,
  MessageStatusType
} from '../../../common/enums';
import { MessageSearchConstant } from '../../../common/message-search.constant';
import { SearchDefaultEnum } from '../../../constants/search.constants';
import Redis from '../../../db/redis';
import { ChatMessageStatusDto } from '../../../interfaces/chat-message-status.interface';
import { ChatRoomDetailsResponseDto } from '../../../interfaces/chat-room-details.interface';
import { ChatRoom } from '../../../interfaces/chat-room.interface';
import {
  ChatRoomDetailsSearchFilters,
  ChatRoomQueryParams
} from '../../../interfaces/dataObject.interface';
import { MessageSearchDocumentDto } from '../../../interfaces/message-search.dto';
import { Message } from '../../../interfaces/message.interface';
import ChatMessageStatusDao from '../../../repository/chat-message-status.dao';
import ChatRoomDao from '../../../repository/chat-room.dao';
import SearchMessageDao from '../../../repository/search-message.dao';
import ConnectAPIService from '../../../service/connect-api.service';
import IO from '../../../socket/io';
import ElasticSearchDocumentUtil from '../../../util/elasticsearch/elasticSearchDocument.util';
import { CustomRequest } from '../../../util/express.util';
import { APIError, PublicInfo } from '../../../util/httpErrors.util';
import {
  isAValidEnum,
  isNonEmptyString,
  stringToInt,
  trim
} from '../../../util/index.util';
import logger from '../../../util/logger.util';

export default class ChatRoomController {
  public static async get(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    const chatRoomId: number = parseInt(req.params.id, 10);

    let pageSize: number = req.query.page_size
      ? parseInt(req.query.page_size, 10)
      : 100;

    if (pageSize <= 0) {
      pageSize = 100;
    }

    let page: number = req.query.page ? parseInt(req.query.page, 10) : 1;
    if (page <= 0) {
      page = 1;
    }

    ChatRoomDao.findChatHistory(chatRoomId, pageSize, page).then(
      (record: any) => {
        if (record) {
          return res.status(200).json(record);
        } else {
          return res.status(200).json({});
        }
      }
    );

    // TODO: Below code works fine with MongoAtlas but not with CosmosDB

    // chatRoomCollection
    //   .find({ chat_room_id: chatRoomId })
    //   .project({
    //     messages: { $slice: [-20, 20] }
    //   })
    //   .toArray()
    //   .then((result: any) => {
    //     if (result && result.length > 0) {
    //       const record = result[0];
    //       record.total_pages = Math.ceil(record.total_items / pageSize);
    //       record.page = Math.min(page, record.total_pages);
    //       record.page_size = pageSize;

    //       // The last page should show only remaining elements
    //       if (record.page === record.total_pages) {
    //         const remainingElements = record.total_items % pageSize;
    //         if (remainingElements > 0 && record.messages.length > 0) {
    //           record.messages = record.messages.splice(0, remainingElements);
    //         }
    //       }
    //       res.status(200).json(record);
    //     } else {
    //       res.status(200).json({});
    //     }
    //   });
  }

  /**
   * 1. Create chat room in connect_API in MYSQL
   * 2. Create participants in connect_API in MYSQL
   * 3. Create chat room on Messaging_platform under NoSQL
   *
   * If chat room already exist, return the same
   */
  public static post = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Create chat room in connect API
      const connectChatRoomResponse: ChatRoom = await ConnectAPIService.postChatRoom(
        req,
        res
      );

      let chatMesageStatusEntryCreated: boolean = false;
      // insert chat room and user details in message_status document and if success then only
      // processed futher else stop chat room creation
      if (connectChatRoomResponse) {
        chatMesageStatusEntryCreated = await ChatRoomController.createMessageStatusRecord(
          req.body.userId,
          connectChatRoomResponse.chat_room_id
        );
      }

      if (chatMesageStatusEntryCreated) {
        // Check if chat room exist in NoSQL
        const chatRoom = await ChatRoomDao.findOne(
          connectChatRoomResponse.chat_room_id
        );
        // If chat room does not exist, create one with additional details
        if (!chatRoom) {
          ChatRoomDao.insertOne(
            connectChatRoomResponse,
            (err: any, result: any) => {
              if (err) {
                return res.status(500).send(err);
              } else {
                // Once new chat room has created, Get sockets for all the participants
                // Make sure all participant sockets listen to newly created chat room
                const userIdArr = req.body.userId;

                const redisCli = Redis.getInstance();
                redisCli.set(
                  `chat-room:${result.chat_room_id}`,
                  result._id,
                  'EX',
                  60 * 60 * 24
                );

                for (const userId of userIdArr) {
                  redisCli.get(
                    `users:${userId}`,
                    (error: any, socketId: any) => {
                      if (socketId) {
                        logger.info(
                          'UserId: SocketId ' + userId + ': ' + socketId
                        );

                        const participantSocket = IO.getInstance().sockets
                          .sockets[socketId];
                        if (participantSocket) {
                          participantSocket.join(
                            connectChatRoomResponse.chat_room_id
                          );
                        }
                      }
                    }
                  );
                }
                // }
                return res.status(200).json(result);
              }
            }
          );

          // TODO: uncomment below code when Redis is installed on dev
          // var client = redis.createClient();
          // client.on('connect', function() {
          //   const userIdArr = req.body.userId;
          //   for (let i = 0; i < userIdArr.length; i++) {
          //     client.get(`users:${userIdArr[i]}`, function(
          //       err: any,
          //       socketID: any,
          //     ) {
          //       if (!err && socketID) {
          //         const participantSocket = global.io.sockets.sockets[socketID];
          //         if (participantSocket) {
          //           participantSocket.join(chatRoom.chat_room_id);
          //         }
          //       }
          //     });
          //   }
          // });
        } else {
          // Return the same chat room if exist
          return res.status(200).json(chatRoom);
        }
      } else {
        res.status(500).json('OOPS: Could not get chat room details from API');
      }
    } catch (err) {
      logger.error('Chat room creation failed with error: ' + err);
      res.status(500).json('OOPS: ' + err);
    }
  };

  public static updateChatRoom = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const chatRoomBody: ChatRoom = req.body;
    let chatRoom;

    if (chatRoomBody.chat_room_id) {
      // Check if chat room exist in NoSQL
      chatRoom = await ChatRoomDao.findOne(chatRoomBody.chat_room_id);
      if (!chatRoom) {
        return res.status(404).send('Resource not found');
      }
    } else {
      return res.status(400).send('BAD Request');
    }
    try {
      const response: any = await ChatRoomController.updateChatRoomAsync(
        chatRoomBody
      );
      if (
        response &&
        response.data &&
        response.data.statusCode &&
        response.data.statusCode === 201
      ) {
        const chatRoomJson = response.data.data;
        // Update chat room details in NoSQL
        await ChatRoomDao.updateOne(chatRoomBody.chat_room_id, chatRoomJson);
        res.status(200).json(chatRoomJson);
      } else {
        res.status(500).json('Internal Server Error');
      }
    } catch (error) {
      next(error);
    }
  };

  public static getChatRoomDetailsByUserId = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        return next(APIError.errUnauthorized());
      }

      const filters: ChatRoomDetailsSearchFilters = await ChatRoomController.chatRoomDetailsQueryFilters(
        req,
        loggedInUser.user_id
      );
      if (
        filters.search_message_persent &&
        filters.include_chat_room.length === 0
      ) {
        logger.error('No chat room details found for given message');
        return next(
          APIError.errNotFound(
            'No chat room record present for message',
            ApiErrorCode.CHAT_ROOM_RECORD_NOT_FOUND_SEARCH_MESSAGE
          )
        );
      }

      const chatRoomMessageStatusDtos: ChatRoomDetailsResponseDto[] = await ChatMessageStatusDao.findByUserIdAndOption(
        loggedInUser.user_id,
        filters
      );
      const chatRoomDetailsResponseDtos: any = await ChatRoomController.fetchAndAppendChatMessageAndParticipantDetails(
        req,
        res,
        next,
        chatRoomMessageStatusDtos,
        filters
      );
      const paginated = PublicInfo.infoPaginated(
        'chatRoomsDetails',
        chatRoomDetailsResponseDtos,
        chatRoomDetailsResponseDtos.length,
        filters.page,
        filters.limit
      );
      res.json(paginated);
    } catch (e) {
      logger.error(e);
    }
  };

  public static getChatRoomDetailsByChatRoomId = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        return next(APIError.errUnauthorized());
      }

      const chatRoomId: number = parseInt(req.params.id, 10);
      if (!chatRoomId) {
        logger.error('Received invalid chat room id in request parameter');
        return next(
          APIError.errInvalidParameterValue(
            'Invalid Request Param',
            'Invalid chat room id',
            ApiErrorCode.INVALID_URL_PARAM
          )
        );
      }

      const chatRoomMessageStatusDto: ChatRoomDetailsResponseDto = await ChatMessageStatusDao.findByUserAndChatRoomId(
        loggedInUser.user_id,
        chatRoomId
      );

      if (chatRoomMessageStatusDto === undefined) {
        logger.error('No chat room details found for given id');
        return next(
          APIError.errNotFound(
            'No chat room found',
            ApiErrorCode.CHAT_ROOM_RECORD_NOT_FOUND
          )
        );
      }

      const chatRoomDetailsResponseDtos: any = await ChatRoomController.fetchAndAppendChatMessageAndParticipantDetails(
        req,
        res,
        next,
        [chatRoomMessageStatusDto]
      );

      if (
        chatRoomDetailsResponseDtos &&
        chatRoomDetailsResponseDtos.length > 0
      ) {
        return res.json(chatRoomDetailsResponseDtos[0]);
      }
    } catch (e) {
      logger.error(e);
      return next(APIError.errServerError());
    }
  };

  public static updateChatRoomAsync = async (data: ChatRoom) => {
    if (data.last_message && data.last_message.length > 1024) {
      data.last_message = data.last_message.substring(0, 1024);
    }

    return await ConnectAPIService.patchChatRoom(
      `/chat-room/${data.chat_room_id}`,
      data
    );
  };

  public static saveChatAsync = async (data: Message) => {
    const body = {
      last_message: data.message,
      last_message_id: data.message_id,
      last_message_updated_at: data.last_message_updated_at,
    };

    // TODO:: we need to remove 'from ' from document after portal fix
    const message = {
      sender_id: data.sender_id,
      from: data.sender_id,
      message_id: data.message_id,
      message: data.message,
      created_at: data.last_message_updated_at,
    };

    ChatRoomDao.appendMessage(parseInt(data.room, 10), body, message);

    // save message to es
    SearchMessageDao.addMessageDocument(data);
  };

  public static chatRoomDetailsQueryFilters = async (
    req: CustomRequest,
    loggedInUser: number
  ) => {
    const queryParams: ChatRoomQueryParams = req.query;
    const filters: ChatRoomDetailsSearchFilters = {
      query:
        queryParams.query && isAValidEnum(queryParams.query, MessageStatusType)
          ? queryParams.query
          : SearchDefaultEnum.DefaultQuery,
      page: ChatRoomController.fetchOrDefaultPageFromQueryParams(queryParams),
      limit: ChatRoomController.fetchOrDefaultLimitFromQueryParams(queryParams),
      sort:
        queryParams.sort &&
        isAValidEnum(queryParams.sort, ChatRoomSearchSortableFieldEnum)
          ? ChatRoomController.sortableFields(queryParams.sort)
          : ChatRoomController.sortableFields(),
      search_message_persent: isNonEmptyString(queryParams.message)
        ? true
        : false,
      include_chat_room: isNonEmptyString(queryParams.message)
        ? await ChatRoomController.searchChatRoomByMessage(
            loggedInUser,
            trim(queryParams.message),
            ChatRoomController.fetchOrDefaultPageFromQueryParams(queryParams),
            ChatRoomController.fetchOrDefaultLimitFromQueryParams(queryParams)
          )
        : [],
    };

    return filters;
  };

  public static sortableFields = (sortKey?: string) => {
    let orderBySql: {} = {
      last_message_updated_at: -1,
    };
    switch (sortKey) {
      case ChatRoomSearchSortableFieldEnum.UpdatedAtASC:
        orderBySql = { last_message_updated_at: 1 };
        break;

      case ChatRoomSearchSortableFieldEnum.UpdatedAtDESC:
        orderBySql = { last_message_updated_at: -1 };
        break;
    }
    return orderBySql;
  };

  private static createMessageStatusRecord = async (
    userIds: number[],
    chatRoomId: number
  ): Promise<boolean> => {
    for (const userId of userIds) {
      const chatMessageStatusDto: ChatMessageStatusDto = {
        chat_room_id: chatRoomId,
        user_id: userId,
        last_message_updated_at: new Date(),
        message_status: MessageStatusType.UNREAD,
      };
      await ChatMessageStatusDao.insertOrIgnoreIfExits(
        chatMessageStatusDto,
        (err: any, result: any) => {
          if (err) {
            logger.error('Message status record creation failed');
            return false;
          }
        }
      );
    }
    return true;
  };

  private static fetchChatRoomIds = (
    chatRoomDetailsResponseDtos: ChatRoomDetailsResponseDto[]
  ) => {
    const chatRoomIds: number[] = [];
    chatRoomDetailsResponseDtos.forEach((chatRoomDetailsResponseDto) => {
      chatRoomIds.push(chatRoomDetailsResponseDto.chat_room_id);
    });
    return chatRoomIds;
  };

  private static createChatRoomAndParticipantDetailsFilter = async (
    chatRoomIds: number[],
    filters?: ChatRoomDetailsSearchFilters
  ) => {
    const params = new URLSearchParams();
    chatRoomIds.forEach((chatRoomId: number) => {
      params.append('query', chatRoomId.toString());
    });
    if (filters) {
      params.append('limit', filters.limit.toString());
      params.append('page', filters.page.toString());
    }

    return params;
  };

  private static mergeChatRoomDetails = async (
    chatRoomMessageStatusDtos: ChatRoomDetailsResponseDto[],
    chatRoomLastMessageDtos: ChatRoomDetailsResponseDto[],
    chatRoomAndParticipantDtos: ChatRoomDetailsResponseDto[]
  ) => {
    const chatRoomLastMessageGroupByChatRoomId = await ChatRoomController.groupByChatRoomId(
      chatRoomLastMessageDtos
    );
    const chatRoomAndParticipantGroupByChatRoomId = await ChatRoomController.groupByChatRoomId(
      chatRoomAndParticipantDtos
    );
    const chatRoomDetailsResponseDto: ChatRoomDetailsResponseDto[] = [];

    chatRoomMessageStatusDtos.forEach((chatRoomMessageStatusDto) => {
      chatRoomMessageStatusDto.have_unread_messages = ChatRoomController.isUnMessageRead(
        chatRoomMessageStatusDto.message_status
      );
      const chatRoomLastMessageDto =
        chatRoomLastMessageGroupByChatRoomId[
          chatRoomMessageStatusDto.chat_room_id
        ];
      if (chatRoomLastMessageDto) {
        chatRoomMessageStatusDto.last_message =
          chatRoomLastMessageDto.last_message;
        chatRoomMessageStatusDto.last_message_id =
          chatRoomLastMessageDto.last_message_id;
      }
      const chatRoomAndParticipantDto =
        chatRoomAndParticipantGroupByChatRoomId[
          chatRoomMessageStatusDto.chat_room_id
        ];
      if (chatRoomAndParticipantDto) {
        chatRoomMessageStatusDto.participants =
          chatRoomAndParticipantDto.participants;
        chatRoomMessageStatusDto.is_active =
          chatRoomAndParticipantDto.is_active;
        chatRoomMessageStatusDto.is_deleted =
          chatRoomAndParticipantDto.is_deleted;
        chatRoomMessageStatusDto.created_epoch =
          chatRoomAndParticipantDto.created_epoch;
        chatRoomMessageStatusDto.chat_room_title =
          chatRoomAndParticipantDto.chat_room_title;
      }
      chatRoomDetailsResponseDto.push(chatRoomMessageStatusDto);
    });
    return chatRoomDetailsResponseDto;
  };

  private static groupByChatRoomId = async (
    chatRoomDtos: ChatRoomDetailsResponseDto[]
  ) => {
    const chatRoomDtoGroup: any = {};
    chatRoomDtos.forEach((chatRoomDto) => {
      chatRoomDtoGroup[chatRoomDto.chat_room_id] = chatRoomDto;
    });
    return chatRoomDtoGroup;
  };

  private static isUnMessageRead = (messageStatus?: MessageStatusType) => {
    if (messageStatus && messageStatus === MessageStatusType.UNREAD) {
      return true;
    }
    return false;
  };

  private static fetchAndAppendChatMessageAndParticipantDetails = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
    chatRoomMessageStatusDtos: ChatRoomDetailsResponseDto[],
    filters?: ChatRoomDetailsSearchFilters
  ) => {
    const chatRoomIds: number[] = ChatRoomController.fetchChatRoomIds(
      chatRoomMessageStatusDtos
    );

    if (chatRoomIds === undefined || chatRoomIds.length === 0) {
      return next(
        APIError.errNotFound(
          'No chat details found',
          ApiErrorCode.CHAT_ROOM_RECORD_NOT_FOUND
        )
      );
    }

    const chatRoomAndParticipantFilter = await ChatRoomController.createChatRoomAndParticipantDetailsFilter(
      chatRoomIds,
      filters
    );

    const chatRoomAndParticipantDetailsPromise = ConnectAPIService.getChatRoomAndParticipantDetails(
      req,
      res,
      chatRoomAndParticipantFilter
    );

    const chatRoomLastMessagePromise = ChatRoomDao.findAndMapChatRoomsLastMessageByChatRoomIds(
      chatRoomIds
    );

    const [
      chatRoomAndParticipantDetails,
      chatRoomLastMessage,
    ] = await Promise.all([
      chatRoomAndParticipantDetailsPromise,
      chatRoomLastMessagePromise,
    ]);

    if (!chatRoomAndParticipantDetails || !chatRoomLastMessage) {
      logger.error('One of the chat details fetch promise call failed.');
      return next(
        APIError.errServerError(
          'Chat room fetch details call failed.',
          ApiErrorCode.CHAT_ROOM_RECORD_FETCH_FAILED
        )
      );
    }

    const chatRoomDetailsResponseDtos: ChatRoomDetailsResponseDto[] = await ChatRoomController.mergeChatRoomDetails(
      chatRoomMessageStatusDtos,
      chatRoomLastMessage,
      chatRoomAndParticipantDetails.chatRooms
    );
    return chatRoomDetailsResponseDtos;
  };

  private static searchChatRoomByMessage = async (
    userId: number,
    searchMessage: string,
    from: number,
    size: number
  ) => {
    const seDoc: MessageSearchDocumentDto = new MessageSearchDocumentDto(
      searchMessage,
      userId,
      size,
      from * size
    );
    const record: any = await ElasticSearchDocumentUtil.searchDocument(
      MessageSearchConstant.CHAT_ROOM_INDEX_NNAME_PREFIX,
      seDoc
    );

    const chatRoomIds: number[] = [];
    if (ChatRoomController.isChatRoomBucketsAvailable(record)) {
      record.aggregations.chat_room_bucket.buckets.forEach((bucket: any) => {
        const chatRoomId: number = ChatRoomController.parseChatRoomIdFromSearchBucket(
          bucket
        );
        if (chatRoomId !== undefined) {
          chatRoomIds.push(chatRoomId);
        }
      });
    }
    return chatRoomIds;
  };

  private static isChatRoomBucketsAvailable = (record: any) => {
    return (
      record &&
      record.aggregations &&
      record.aggregations.chat_room_bucket &&
      record.aggregations.chat_room_bucket.buckets &&
      record.aggregations.chat_room_bucket.buckets.length > 0
    );
  };

  private static parseChatRoomIdFromSearchBucket = (chatRoombucket: any) => {
    if (
      chatRoombucket &&
      chatRoombucket.group_docs &&
      chatRoombucket.group_docs.hits &&
      chatRoombucket.group_docs.hits.hits.length > 0
    ) {
      return chatRoombucket.group_docs.hits.hits[0]._source.chat_room_id;
    }
  };

  private static fetchOrDefaultLimitFromQueryParams = (
    queryParams: ChatRoomQueryParams
  ) => {
    return stringToInt(queryParams.limit)
      ? stringToInt(queryParams.limit)
      : SearchDefaultEnum.DefaultLimit;
  };
  private static fetchOrDefaultPageFromQueryParams = (
    queryParams: ChatRoomQueryParams
  ) => {
    return queryParams.page && stringToInt(queryParams.page) > 0
      ? stringToInt(queryParams.page) - 1
      : SearchDefaultEnum.DefaultPage;
  };
}
