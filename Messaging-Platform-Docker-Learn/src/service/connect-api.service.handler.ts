import { APIError } from '../util/httpErrors.util';
import logger from '../util/logger.util';

/**
 * Service class error handler
 */
export default class ConnectAPIServiceHandler {
  /**
   * Handle generic errors from service class
   * @param api API url
   * @param error error object
   */
  public static handleError(api: any, error: any) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.message &&
      error.response.status
    ) {
      return new APIError(
        error.response.data.message,
        'Request could not be carried out.',
        error.response.status
      );
    } else {
      return new APIError(
        'Internal Server Error',
        'Request could not be carried out.',
        500
      );
    }
  }
}
