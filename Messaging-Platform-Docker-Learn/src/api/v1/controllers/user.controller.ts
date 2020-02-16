import ConnectAPIService from '../../../service/connect-api.service';

export default class UserController {
  public static getChatRoomByUserID = async (
    userId: number,
    callback: (arg0: any) => void
  ) => {
    ConnectAPIService.getChatRoomByUserID(userId, callback);
  };

  public static getUserByUserToken = async (
    userToken: string,
    callback: (err: Error | undefined, arg0: any) => void
  ) => {
    if (userToken) {
      ConnectAPIService.isAuthenticated(userToken, callback);
    }
  };
}
