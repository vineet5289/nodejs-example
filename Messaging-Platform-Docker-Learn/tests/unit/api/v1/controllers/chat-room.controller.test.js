//Mock function should be on top else it won't work
jest.mock("../../../../../src/repository/chat-room.dao");
jest.mock("../../../../../src/repository/chat-message-status.dao");
jest.mock("../../../../../src/service/connect-api.service");
jest.mock("../../../../../src/util/elasticsearch/elasticSearchDocument.util");
const httpMocks = require("node-mocks-http");
const Redis = require("../../../../../src/db/redis");

const controller = require("../../../../../src/api/v1/controllers/chat-room.controller")
  .default;
const ChatMessageStatusDao = require("../../../../../src/repository/chat-message-status.dao")
  .default;
const ConnectAPIService = require("../../../../../src/service/connect-api.service")
  .default;
const ChatRoomDao = require("../../../../../src/repository/chat-room.dao")
  .default;

const mockRequest = {
  params: {
    id: 20
  },
  query: {
    papage_size: 20,
    page: 1
  }
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Chat room controller test class", () => {
  afterAll(done => {
    Redis.default.close(done);
  });

  test("Chat room controller get method returns chat room details", async () => {
    let next = () => {};

    const res = mockResponse();

    await controller.get(mockRequest, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: "5dd65ae632667e325f7470a9",
      chat_room_id: 692,
      chat_room_title: "Updated Title",
      last_message: "",
      is_active: 1,
      is_deleted: 0,
      created_at: "2019-11-21T09:02:34.000Z",
      total_items: 2,
      messages: [
        {
          from: 1,
          message: "test message 1"
        },
        {
          from: 2,
          message: "test message 2"
        }
      ]
    });
  });

  test("Chat room controller post method returns chat room since it already exist", async () => {
    let next = () => {};

    const req = mockRequest;
    const res = mockResponse();

    req.body = {
      userId: [24, 43],
      chat_room_title: "Sample chat room"
    };

    await controller.post(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: "5dd65ae632667e325f7470a9",
      chat_room_id: 692,
      chat_room_title: "Updated Title",
      last_message: "",
      is_active: 1,
      is_deleted: 0,
      created_at: "2019-11-21T09:02:34.000Z",
      total_items: 2,
      messages: [
        {
          from: 1,
          message: "test message 1"
        },
        {
          from: 2,
          message: "test message 2"
        }
      ]
    });
  });

  // test('Chat room controller post method creates a new chat room since it does not exist', async () => {
  //   let next = () => {};

  //   const req = mockRequest;
  //   const res = mockResponse();

  //   req.body = {
  //     userId: [24, 43],
  //     chat_room_title: 'DOES_NOT_EXIST'
  //   };

  //   await controller.post(req, res, next);
  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.json).toHaveBeenCalledWith({
  //     _id: '5dd65ae632667e325f7470a9',
  //     chat_room_id: 692,
  //     chat_room_title: 'Updated Title',
  //     last_message: '',
  //     is_active: 1,
  //     is_deleted: 0,
  //     created_at: '2019-11-21T09:02:34.000Z',
  //     total_items: 2,
  //     messages: [
  //       {
  //         from: 1,
  //         message: 'test message 1'
  //       },
  //       {
  //         from: 2,
  //         message: 'test message 2'
  //       }
  //     ]
  //   });
  // });

  describe("Fetch chat room details by userId", () => {
    it("should throw unauthorized error in case looged-in user is missing from request", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/v1/chat-room/getChatRoomDetailsByUserId"
      });
      let res = httpMocks.createResponse();
      await controller.getChatRoomDetailsByUserId(req, res, err => {
        expect(err.statusCode).toBe(401);
        expect(err.name).toBe("Unauthorized");
        expect(err.message).toBe("Client Authorization Failed.");
      });
    });

    it("should throw 404 status code and 1003 error code when no chat room found for given search message", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url:
          "/api/v1/chat-room/getChatRoomDetailsByUserId?message=unknown search message"
      });
      req.user = { user_id: 1 };
      let res = httpMocks.createResponse();
      await controller.getChatRoomDetailsByUserId(req, res, err => {
        expect(err.errorCode).toBe(1003);
        expect(err.statusCode).toBe(404);
        expect(err.name).toBe("Resource not found");
        expect(err.message).toBe("Requested resource does not exist");
        expect(err.data).toBe("No chat room record present for message");
      });
    });

    it("should throw 404 status code and 1003 error code when no chat room aggregated record is empty for given message", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url:
          "/api/v1/chat-room/getChatRoomDetailsByUserId?message=empty agg message"
      });
      req.user = { user_id: 1 };
      let res = httpMocks.createResponse();
      await controller.getChatRoomDetailsByUserId(req, res, err => {
        expect(err.errorCode).toBe(1003);
        expect(err.statusCode).toBe(404);
        expect(err.name).toBe("Resource not found");
        expect(err.message).toBe("Requested resource does not exist");
        expect(err.data).toBe("No chat room record present for message");
      });
    });

    it("should throw 404 status code and 1003 error code when no chat room bucket contains zero element for given message", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url:
          "/api/v1/chat-room/getChatRoomDetailsByUserId?message=empty bucket message"
      });
      req.user = { user_id: 1 };
      let res = httpMocks.createResponse();
      await controller.getChatRoomDetailsByUserId(req, res, err => {
        expect(err.errorCode).toBe(1003);
        expect(err.statusCode).toBe(404);
        expect(err.name).toBe("Resource not found");
        expect(err.message).toBe("Requested resource does not exist");
        expect(err.data).toBe("No chat room record present for message");
      });
    });

    it("should throw 404 status code and 1003 error code when no chat room record hit found in elastic search for given message", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url:
          "/api/v1/chat-room/getChatRoomDetailsByUserId?message=empty group hit message"
      });
      req.user = { user_id: 1 };
      let res = httpMocks.createResponse();
      await controller.getChatRoomDetailsByUserId(req, res, err => {
        expect(err.errorCode).toBe(1003);
        expect(err.statusCode).toBe(404);
        expect(err.name).toBe("Resource not found");
        expect(err.message).toBe("Requested resource does not exist");
        expect(err.data).toBe("No chat room record present for message");
      });
    });

    it("should throw 404 status code and 1002 error code when chat room return from elastic search not present in message status document", async () => {
      const chatMessageStatusDaoMock = jest.fn();
      chatMessageStatusDaoMock.mockReturnValue([]);

      ChatMessageStatusDao.findByUserIdAndOption = chatMessageStatusDaoMock.bind(
        ChatMessageStatusDao
      );

      const req = httpMocks.createRequest({
        method: "GET",
        url:
          "/api/v1/chat-room/getChatRoomDetailsByUserId?message=match with one record"
      });
      req.user = { user_id: 1 };
      let res = httpMocks.createResponse();
      await controller.getChatRoomDetailsByUserId(req, res, err => {
        expect(err.errorCode).toBe(1002);
        expect(err.statusCode).toBe(404);
        expect(err.name).toBe("Resource not found");
        expect(err.message).toBe("Requested resource does not exist");
        expect(err.data).toBe("No chat details found");
      });
    });

    it("should throw 500 status code and 2002 error code when fetch chat room details from api service failed", async () => {
      const chatMessageStatusDaoMock = jest.fn();
      const connectApiServiceMock = jest.fn();
      const chatRoomDaoMock = jest.fn();

      connectApiServiceMock.mockReturnValue(undefined);
      chatRoomDaoMock.mockReturnValue([{ user_id: 1, chat_room_id: 1 }]);
      chatMessageStatusDaoMock.mockReturnValue([
        { user_id: 1, chat_room_id: 1 }
      ]);

      ChatMessageStatusDao.findByUserIdAndOption = chatMessageStatusDaoMock.bind(
        ChatMessageStatusDao
      );
      ConnectAPIService.getChatRoomAndParticipantDetails = connectApiServiceMock.bind(
        ConnectAPIService
      );
      ChatRoomDao.findAndMapChatRoomsLastMessageByChatRoomIds = chatRoomDaoMock.bind(
        ChatRoomDao
      );

      const req = httpMocks.createRequest({
        method: "GET",
        url:
          "/api/v1/chat-room/getChatRoomDetailsByUserId?message=match with one record"
      });
      req.user = { user_id: 1 };
      let res = httpMocks.createResponse();
      await controller.getChatRoomDetailsByUserId(req, res, err => {
        expect(err.errorCode).toBe(2002);
        expect(err.statusCode).toBe(500);
        expect(err.name).toBe("Internal Server Error");
        expect(err.message).toBe("Request could not be carried out.");
        expect(err.data).toBe("Chat room fetch details call failed.");
      });
    });

    it("should throw 500 status code and 2002 error code when fetch chat room details from document db failed", async () => {
      const chatMessageStatusDaoMock = jest.fn();
      const connectApiServiceMock = jest.fn();
      const chatRoomDaoMock = jest.fn();

      connectApiServiceMock.mockReturnValue({
        chatRooms: [
          {
            user_id: 1,
            chat_room_id: 1,
            is_active: true,
            is_deleted: false,
            chat_room_title: "Test Chat Room"
          }
        ]
      });
      chatRoomDaoMock.mockReturnValue(undefined);
      chatMessageStatusDaoMock.mockReturnValue([
        { user_id: 1, chat_room_id: 1 }
      ]);

      ChatMessageStatusDao.findByUserIdAndOption = chatMessageStatusDaoMock.bind(
        ChatMessageStatusDao
      );
      ConnectAPIService.getChatRoomAndParticipantDetails = connectApiServiceMock.bind(
        ConnectAPIService
      );
      ChatRoomDao.findAndMapChatRoomsLastMessageByChatRoomIds = chatRoomDaoMock.bind(
        ChatRoomDao
      );

      const req = httpMocks.createRequest({
        method: "GET",
        url:
          "/api/v1/chat-room/getChatRoomDetailsByUserId?message=match with one record"
      });
      req.user = { user_id: 1 };
      let res = httpMocks.createResponse();
      await controller.getChatRoomDetailsByUserId(req, res, err => {
        expect(err.errorCode).toBe(2002);
        expect(err.statusCode).toBe(500);
        expect(err.name).toBe("Internal Server Error");
        expect(err.message).toBe("Request could not be carried out.");
        expect(err.data).toBe("Chat room fetch details call failed.");
      });
    });

    it("should merge data from api service and message service and return response", async () => {
      const mockCountUserUnreadMessage = jest.fn();
      const connectApiServiceMock = jest.fn();
      const chatRoomDaoMock = jest.fn();

      connectApiServiceMock.mockReturnValue({
        chatRooms: [
          {
            user_id: 1,
            chat_room_id: 1,
            is_active: true,
            is_deleted: false,
            chat_room_title: "Test Chat Room",
            participants: [
              {
                chat_participant_id: 1,
                user_id: 1,
                chat_room_id: 1,
                user: {
                  user_id: 1,
                  user_slug: "user1"
                }
              },
              {
                chat_participant_id: 2,
                user_id: 2,
                chat_room_id: 1,
                user: {
                  user_id: 2,
                  user_slug: "user2"
                }
              }
            ]
          }
        ]
      });
      chatRoomDaoMock.mockReturnValue([
        {
          user_id: 1,
          chat_room_id: 1,
          last_message: "Last received message",
          last_message_id: "8b313e40-20ae-11ea-9368-63d77af4bcb5"
        }
      ]);
      mockCountUserUnreadMessage.mockReturnValue([
        {
          user_id: 1,
          chat_room_id: 1,
          message_status: "unread",
          message_status_order: 0,
          have_unread_messages: true
        }
      ]);

      ChatMessageStatusDao.findByUserIdAndOption = mockCountUserUnreadMessage.bind(
        ChatMessageStatusDao
      );
      ConnectAPIService.getChatRoomAndParticipantDetails = connectApiServiceMock.bind(
        ConnectAPIService
      );
      ChatRoomDao.findAndMapChatRoomsLastMessageByChatRoomIds = chatRoomDaoMock.bind(
        ChatRoomDao
      );

      const req = httpMocks.createRequest({
        method: "GET",
        url:
          "/api/v1/chat-room/getChatRoomDetailsByUserId?message=match with one record"
      });
      req.user = { user_id: 1 };
      let res = httpMocks.createResponse();
      await controller.getChatRoomDetailsByUserId(req, res, err => {
        expect(err).toBe(undefined);
      });
      expect(res.statusCode).toBe(200);
      expect(JSON.stringify(res._getJSONData())).toBe(
        '{"message":"Success","statusCode":200,"data":{"page":1,"pageSize":1,"totalItems":1,"totalPages":1,"chatRoomsDetails":[{"user_id":1,"chat_room_id":1,"message_status":"unread","message_status_order":0,"have_unread_messages":true,"last_message":"Last received message","last_message_id":"8b313e40-20ae-11ea-9368-63d77af4bcb5","participants":[{"chat_participant_id":1,"user_id":1,"chat_room_id":1,"user":{"user_id":1,"user_slug":"user1"}},{"chat_participant_id":2,"user_id":2,"chat_room_id":1,"user":{"user_id":2,"user_slug":"user2"}}],"is_active":true,"is_deleted":false,"chat_room_title":"Test Chat Room"}]}}'
      );
    });
  });

  describe("Fetch chat room detail by chat room id", () => {
    it("should throw unauthorized error in case looged-in user is missing from request", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/v1/chat-room/detailsById",
        params: { id: 1 }
      });
      let res = httpMocks.createResponse();
      await controller.getChatRoomDetailsByChatRoomId(req, res, err => {
        expect(err.statusCode).toBe(401);
        expect(err.name).toBe("Unauthorized");
        expect(err.message).toBe("Client Authorization Failed.");
      });
    });

    it("should throw internal server error when chat room id is in invalid format", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/v1/chat-room/detailsById",
        params: { id: "abcd5abcd" }
      });
      req.user = { user_id: 1 };

      let res = httpMocks.createResponse();
      await controller.getChatRoomDetailsByChatRoomId(req, res, err => {
        expect(err.statusCode).toBe(400);
        expect(err.name).toBe("InvalidParameterValue");
        expect(err.data).toBe("Invalid chat room id");
        expect(err.message).toBe("Invalid Request Param");
        expect(err.errorCode).toBe(3001);
      });
    });

    it("should throw 404 status code and 1003 error code when no chat room found for given chat room id", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/v1/chat-room/detailsById",
        params: { id: 1 }
      });
      req.user = { user_id: 1 };

      let res = httpMocks.createResponse();
      await controller.getChatRoomDetailsByChatRoomId(req, res, err => {
        expect(err.statusCode).toBe(404);
        expect(err.errorCode).toBe(1002);
        expect(err.name).toBe("Resource not found");
        expect(err.message).toBe("Requested resource does not exist");
      });
    });

    it("should throw 500 status code and 2002 error code when fetch chat room details from api service failed", async () => {
      const chatMessageStatusDaoMock = jest.fn();
      const connectApiServiceMock = jest.fn();
      const chatRoomDaoMock = jest.fn();

      connectApiServiceMock.mockReturnValue(undefined);
      chatRoomDaoMock.mockReturnValue([{ user_id: 1, chat_room_id: 2 }]);
      chatMessageStatusDaoMock.mockReturnValue([
        { user_id: 1, chat_room_id: 2 }
      ]);

      ChatMessageStatusDao.findByUserIdAndOption = chatMessageStatusDaoMock.bind(
        ChatMessageStatusDao
      );
      ConnectAPIService.getChatRoomAndParticipantDetails = connectApiServiceMock.bind(
        ConnectAPIService
      );
      ChatRoomDao.findAndMapChatRoomsLastMessageByChatRoomIds = chatRoomDaoMock.bind(
        ChatRoomDao
      );

      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/v1/chat-room/detailsById",
        params: { id: 2 }
      });
      req.user = { user_id: 1 };
      let res = httpMocks.createResponse();
      await controller.getChatRoomDetailsByChatRoomId(req, res, err => {
        expect(err.errorCode).toBe(2002);
        expect(err.statusCode).toBe(500);
        expect(err.name).toBe("Internal Server Error");
        expect(err.message).toBe("Request could not be carried out.");
        expect(err.data).toBe("Chat room fetch details call failed.");
      });
    });

    it("should throw 500 status code and 2002 error code when fetch chat room details from document db failed", async () => {
      const chatMessageStatusDaoMock = jest.fn();
      const connectApiServiceMock = jest.fn();
      const chatRoomDaoMock = jest.fn();

      connectApiServiceMock.mockReturnValue({
        chatRooms: [
          {
            user_id: 1,
            chat_room_id: 1,
            is_active: true,
            is_deleted: false,
            chat_room_title: "Test Chat Room"
          }
        ]
      });
      chatRoomDaoMock.mockReturnValue(undefined);
      chatMessageStatusDaoMock.mockReturnValue([
        { user_id: 1, chat_room_id: 1 }
      ]);

      ChatMessageStatusDao.findByUserIdAndOption = chatMessageStatusDaoMock.bind(
        ChatMessageStatusDao
      );
      ConnectAPIService.getChatRoomAndParticipantDetails = connectApiServiceMock.bind(
        ConnectAPIService
      );
      ChatRoomDao.findAndMapChatRoomsLastMessageByChatRoomIds = chatRoomDaoMock.bind(
        ChatRoomDao
      );

      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/v1/chat-room/detailsById",
        params: { id: 2 }
      });
      req.user = { user_id: 1 };
      let res = httpMocks.createResponse();
      await controller.getChatRoomDetailsByChatRoomId(req, res, err => {
        expect(err.errorCode).toBe(2002);
        expect(err.statusCode).toBe(500);
        expect(err.name).toBe("Internal Server Error");
        expect(err.message).toBe("Request could not be carried out.");
        expect(err.data).toBe("Chat room fetch details call failed.");
      });
    });

    it("should merge data from api service and message service and return response", async () => {
      const mockCountUserUnreadMessage = jest.fn();
      const connectApiServiceMock = jest.fn();
      const chatRoomDaoMock = jest.fn();

      connectApiServiceMock.mockReturnValue({
        chatRooms: [
          {
            user_id: 1,
            chat_room_id: 2,
            is_active: true,
            is_deleted: false,
            chat_room_title: "Test Chat Room",
            participants: [
              {
                chat_participant_id: 1,
                user_id: 1,
                chat_room_id: 2,
                user: {
                  user_id: 1,
                  user_slug: "user1"
                }
              },
              {
                chat_participant_id: 2,
                user_id: 2,
                chat_room_id: 1,
                user: {
                  user_id: 2,
                  user_slug: "user2"
                }
              }
            ]
          }
        ]
      });
      chatRoomDaoMock.mockReturnValue([
        {
          user_id: 1,
          chat_room_id: 2,
          last_message: "Last received message",
          last_message_id: "8b313e40-20ae-11ea-9368-63d77af4bcb5"
        }
      ]);
      mockCountUserUnreadMessage.mockReturnValue([
        {
          user_id: 1,
          chat_room_id: 2,
          message_status: "unread",
          message_status_order: 0,
          have_unread_messages: true
        }
      ]);

      ChatMessageStatusDao.findByUserIdAndOption = mockCountUserUnreadMessage.bind(
        ChatMessageStatusDao
      );
      ConnectAPIService.getChatRoomAndParticipantDetails = connectApiServiceMock.bind(
        ConnectAPIService
      );
      ChatRoomDao.findAndMapChatRoomsLastMessageByChatRoomIds = chatRoomDaoMock.bind(
        ChatRoomDao
      );

      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/v1/chat-room/detailsById",
        params: { id: 2 }
      });
      req.user = { user_id: 1 };
      let res = httpMocks.createResponse();
      await controller.getChatRoomDetailsByChatRoomId(req, res, err => {
        expect(err).toBe(undefined);
      });
      expect(res.statusCode).toBe(200);
      expect(JSON.stringify(res._getJSONData())).toBe(
        '{"chat_room_id":2,"user_id":1,"have_unread_messages":false,"last_message":"Last received message","last_message_id":"8b313e40-20ae-11ea-9368-63d77af4bcb5","participants":[{"chat_participant_id":1,"user_id":1,"chat_room_id":2,"user":{"user_id":1,"user_slug":"user1"}},{"chat_participant_id":2,"user_id":2,"chat_room_id":1,"user":{"user_id":2,"user_slug":"user2"}}],"is_active":true,"is_deleted":false,"chat_room_title":"Test Chat Room"}'
      );
    });
  });
});
