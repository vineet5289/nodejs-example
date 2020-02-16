import axiosinstance from '../util/axios.util';
import setHeadersUtil from '../util/header.util';
import ConnectAPIServiceHandler from './connect-api.service.handler';

/**
 * Service class to make http calls to connect-API.
 */
export default class ConnectAPIService {
  /**
   * Service class to validate user token
   * @param userToken
   * @param callback
   */
  public static async isAuthenticated(
    userToken: string,
    callback: (err: Error | undefined, arg0: any) => void
  ) {
    return await axiosinstance
      .get('/auth/isAuthenticated', {
        headers: {
          Authorization: 'Bearer ' + userToken,
        },
      })
      .then((result: any) => {
        callback(undefined, result.data.data);
      })
      .catch((error: any) => {
        callback(
          ConnectAPIServiceHandler.handleError(
            `/auth/isAuthenticated Get`,
            error
          ),
          undefined
        );
      });
  }

  /**
   * Service call to get chat room detail by user id
   * @param userId
   * @param callback
   */
  public static async getChatRoomByUserID(
    userId: number,
    callback: (arg0: any) => void
  ) {
    return await axiosinstance
      .get(`/chat-room/detailByUserID/` + userId, {})
      .then((result: any) => {
        callback(result.data);
      })
      .catch((error: any) => {
        ConnectAPIServiceHandler.handleError(
          `/chat-room/detailByUserID/${userId} Get`,
          error
        );
      });
  }

  /**
   * Chat room post url
   * @param req Request data
   * @param res Response data
   */
  public static async postChatRoom(req: any, res: any) {
    const headers = setHeadersUtil.getUpdatedHeaders(req, res);
    return await axiosinstance
      .post(`/chat-room`, req.body, { headers })
      .then((result: any) => {
        return result.data.data;
      })
      .catch((error: any) => {
        ConnectAPIServiceHandler.handleError('/chat-room post', error);
      });
  }

  public static async getChatRoomAndParticipantDetails(
    req: any,
    res: any,
    params: URLSearchParams
  ) {
    const headers = setHeadersUtil.getUpdatedHeaders(req, res);
    return await axiosinstance
      .get(`/chat-room/detailByChatRoomIds`, { headers, params })
      .then((result: any) => {
        return result.data.data;
      })
      .catch((err: any) => {
        ConnectAPIServiceHandler.handleError(
          'Chat room details fetch api failed.',
          err
        );
      });
  }

  public static async patchChatRoom(url: string, data: any) {
    return await axiosinstance.patch(url, data, {}).catch((error: any) => {
      ConnectAPIServiceHandler.handleError('/chat-room patch', error);
    });
  }
}
