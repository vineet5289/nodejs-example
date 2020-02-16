jest.mock("../../../../../src/repository/chat-message-status.dao");
const ChatMessageStatusDao = require("../../../../../src/repository/chat-message-status.dao")
  .default;
const ChatMessageStatusController = require("../../../../../src/api/v1/controllers/chat-message-status.controller")
  .default;
const httpMocks = require("node-mocks-http");

describe("Chat message status controller test", () => {
  describe("Fetch unread message count of user", () => {
    it("should throw unauthorized error in case looged-in user is missing from request", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/v1/chat-message-status/count"
      });
      let res = httpMocks.createResponse();
      await ChatMessageStatusController.fetchUnReadMessageCount(
        req,
        res,
        err => {
          expect(err.statusCode).toBe(401);
          expect(err.name).toBe("Unauthorized");
          expect(err.message).toBe("Client Authorization Failed.");
        }
      );
    });

    it("should return response with unread message count to zero if no unread message data db", async () => {
      const mockCountUserUnreadMessage = jest.fn();
      mockCountUserUnreadMessage.mockReturnValue(undefined);

      ChatMessageStatusDao.countUserUnreadMessage = mockCountUserUnreadMessage.bind(
        ChatMessageStatusDao
      );

      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/v1/chat-message-status/count"
      });

      req.user = { user_id: 1 };
      let res = httpMocks.createResponse();
      await ChatMessageStatusController.fetchUnReadMessageCount(
        req,
        res,
        err => {
          expect(err).toBe(undefined);
        }
      );
      expect(res.statusCode).toBe(200);
      expect(JSON.stringify(res._getJSONData())).toBe(
        '{"message":"Success","statusCode":200,"data":{"unread_message_count":0,"user_id":1}}'
      );
    });

    it("should return response with unread message count to zero if no entry message status present for given user", async () => {
      const mockCountUserUnreadMessage = jest.fn();
      mockCountUserUnreadMessage.mockReturnValue([]);

      ChatMessageStatusDao.countUserUnreadMessage = mockCountUserUnreadMessage.bind(
        ChatMessageStatusDao
      );

      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/v1/chat-message-status/count"
      });

      req.user = { user_id: 1 };
      let res = httpMocks.createResponse();
      await ChatMessageStatusController.fetchUnReadMessageCount(
        req,
        res,
        err => {
          expect(err).toBe(undefined);
        }
      );
      expect(res.statusCode).toBe(200);
      expect(JSON.stringify(res._getJSONData())).toBe(
        '{"message":"Success","statusCode":200,"data":{"unread_message_count":0,"user_id":1}}'
      );
    });

    it("should return response constains agg unread message count from db", async () => {
      const mockCountUserUnreadMessage = jest.fn();
      mockCountUserUnreadMessage.mockReturnValue([{ unread_message_count: 5 }]);

      ChatMessageStatusDao.countUserUnreadMessage = mockCountUserUnreadMessage.bind(
        ChatMessageStatusDao
      );

      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/v1/chat-message-status/count"
      });

      req.user = { user_id: 1 };
      let res = httpMocks.createResponse();
      await ChatMessageStatusController.fetchUnReadMessageCount(
        req,
        res,
        err => {
          expect(err).toBe(undefined);
        }
      );
      expect(res.statusCode).toBe(200);
      expect(JSON.stringify(res._getJSONData())).toBe(
        '{"message":"Success","statusCode":200,"data":{"unread_message_count":5,"user_id":1}}'
      );
    });
  });

  describe("Update chat room message status", () => {
    it("should throw unauthorized error in case looged-in user is missing from request", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/v1/chat-message-status"
      });
      let res = httpMocks.createResponse();
      await ChatMessageStatusController.updateChatRoomMessageStatus(
        req,
        res,
        err => {
          expect(err.statusCode).toBe(401);
          expect(err.name).toBe("Unauthorized");
          expect(err.message).toBe("Client Authorization Failed.");
        }
      );
    });

    it("should return error when chat room id is missing in request body", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/v1/chat-message-status"
      });
      req.user = { user_id: 1 };
      req.body = { message_status: "read" };
      let res = httpMocks.createResponse();
      await ChatMessageStatusController.updateChatRoomMessageStatus(
        req,
        res,
        err => {
          expect(err.statusCode).toBe(400);
          expect(err.message).toBe("Missing Data in Request Body.");
          expect(err.name).toBe("MissingBody");
        }
      );
    });

    it("should return error when message status is missing in request body", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/v1/chat-message-status"
      });
      req.user = { user_id: 1 };
      req.body = { chat_room_id: 1 };
      let res = httpMocks.createResponse();
      await ChatMessageStatusController.updateChatRoomMessageStatus(
        req,
        res,
        err => {
          expect(err.statusCode).toBe(400);
          expect(err.message).toBe("Missing Data in Request Body.");
          expect(err.name).toBe("MissingBody");
        }
      );
    });

    it("should return error when message status is invaild in request body", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/v1/chat-message-status"
      });
      req.user = { user_id: 1 };
      req.body = { chat_room_id: 1, message_status: "invalidstatus" };
      let res = httpMocks.createResponse();
      await ChatMessageStatusController.updateChatRoomMessageStatus(
        req,
        res,
        err => {
          expect(err.statusCode).toBe(400);
          expect(err.message).toBe(
            "Incorrect Message Status Update Request Data"
          );
          expect(err.name).toBe("InvalidRequestBodyParameter");
        }
      );
    });

    it("should return error when chat record status update in db failed", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/v1/chat-message-status"
      });
      req.user = { user_id: 1 };
      req.body = { chat_room_id: 1, message_status: "read" };
      let res = httpMocks.createResponse();
      await ChatMessageStatusController.updateChatRoomMessageStatus(
        req,
        res,
        err => {
          expect(err.statusCode).toBe(409);
          expect(err.message).toBe("Meaasage status update failed");
          expect(err.name).toBe("ResourceUpdateFailed");
        }
      );
    });

    it("should return error when chat record not found for given user and chat room", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/v1/chat-message-status"
      });
      req.user = { user_id: 1 };
      req.body = { chat_room_id: 3, message_status: "read" };
      let res = httpMocks.createResponse();
      await ChatMessageStatusController.updateChatRoomMessageStatus(
        req,
        res,
        err => {
          expect(err.statusCode).toBe(404);
          expect(err.message).toBe("Requested resource does not exist");
          expect(err.name).toBe("Resource not found");
          expect(err.data).toBe("Chat message record not found");
        }
      );
    });

    it("should update chat message record status and return success message", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/v1/chat-message-status"
      });
      req.user = { user_id: 1 };
      req.body = { chat_room_id: 5, message_status: "read" };
      let res = httpMocks.createResponse();
      await ChatMessageStatusController.updateChatRoomMessageStatus(
        req,
        res,
        err => {
          expect(err.statusCode).toBe(404);
          expect(err.message).toBe("Requested resource does not exist");
          expect(err.name).toBe("Resource not found");
          expect(err.data).toBe("Chat message record not found");
        }
      );
      expect(JSON.stringify(res._getJSONData())).toBe(
        '{"message":"Resource Updated","statusCode":201,"data":"Chat message status updated"}'
      );
    });
  });
});
