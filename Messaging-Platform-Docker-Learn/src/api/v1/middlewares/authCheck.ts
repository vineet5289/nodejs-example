import { APIError } from '../../../util/httpErrors.util';
import logger from '../../../util/logger.util';
import UserController from '../controllers/user.controller';

exports.validateUserToken = async (req: any, res: Response, next: any) => {
  if (!req.headers || !req.headers.authorization) {
    return next(
      APIError.errInvalidHeaderParameter('Missing Authorization header')
    );
  }

  const parts: string[] = req.headers.authorization.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    const token: string = parts[1];

    UserController.getUserByUserToken(token, (err: Error | undefined, user) => {
      if (err) {
        logger.error(
          `user authentication failed with error message ${err.message}`
        );
        return next(APIError.errUnauthorized('User authentication failed.'));
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    return next(APIError.errInvalidAccessToken('Missing Authorization token'));
  }
};
