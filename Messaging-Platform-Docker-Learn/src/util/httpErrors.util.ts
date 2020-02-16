import { ApiErrorCode } from '../common/api-error-code.constant';
import { PaginationObject } from '../interfaces/dataObject.interface';

export class APIError extends Error {
  public static errInvalidQueryParameter(
    message: string,
    data?: any,
    internalProperties?: any
  ) {
    return new APIError(
      'InvalidQueryParameter',
      message,
      400,
      data,
      internalProperties
    );
  }
  public static errMissingBody(data?: any, internalProperties?: any) {
    return new APIError(
      'MissingBody',
      'Missing Data in Request Body.',
      400,
      data,
      internalProperties
    );
  }
  public static errInvalidParameterValue(
    message: string,
    data?: any,
    errorCode?: ApiErrorCode,
    internalProperties?: any
  ) {
    return new APIError(
      'InvalidParameterValue',
      message,
      400,
      data,
      errorCode,
      internalProperties
    );
  }
  public static errInvalidHeaderParameter(
    message: string,
    data?: any,
    internalProperties?: any
  ) {
    return new APIError(
      'InvalidHeaderParameter',
      message,
      400,
      data,
      internalProperties
    );
  }
  public static errUnauthorized(data?: any, internalProperties?: any) {
    return new APIError(
      'Unauthorized',
      'Client Authorization Failed.',
      401,
      data,
      internalProperties
    );
  }

  public static errInvalidAccessToken(data?: any, internalProperties?: any) {
    return new APIError(
      'InvalidAccessToken',
      'Invalid authentication token',
      401,
      data,
      internalProperties
    );
  }
  public static errInvalidIdToken(data?: any, internalProperties?: any) {
    return new APIError(
      'InvalidIdToken',
      'Invalid Id Token',
      401,
      data,
      internalProperties
    );
  }
  public static errPermissionDenied(data?: any, internalProperties?: any) {
    return new APIError(
      'Forbidden',
      "You don't have permission to perform this action.",
      403,
      data,
      internalProperties
    );
  }
  public static errAlreadyExists(data?: any, internalProperties?: any) {
    return new APIError(
      'AlreadyExists',
      'Requested resource already exists',
      409,
      data,
      internalProperties
    );
  }
  public static errNotFound(
    data?: any,
    errorCode?: ApiErrorCode,
    internalProperties?: any
  ) {
    return new APIError(
      'Resource not found',
      'Requested resource does not exist',
      404,
      data,
      errorCode,
      internalProperties
    );
  }
  public static errResourceCreationFailed(
    message: string,
    data?: any,
    internalProperties?: any
  ) {
    return new APIError(
      'ResourceCreationFailed',
      message,
      409,
      data,
      internalProperties
    );
  }
  public static errResourceUpdateFailed(
    message: string,
    data?: any,
    internalProperties?: any
  ) {
    return new APIError(
      'ResourceUpdateFailed',
      message,
      409,
      data,
      internalProperties
    );
  }
  public static errResourceDeletionFailed(
    message: string,
    data?: any,
    internalProperties?: any
  ) {
    return new APIError(
      'ResourceDeletionFailed',
      message,
      409,
      data,
      internalProperties
    );
  }
  public static errServerError(
    data?: any,
    errorCode?: ApiErrorCode,
    internalProperties?: any
  ) {
    return new APIError(
      'Internal Server Error',
      'Request could not be carried out.',
      500,
      data,
      errorCode,
      internalProperties
    );
  }
  public static errRequestBodyParameter(
    message: string,
    data?: any,
    internalProperties?: any
  ) {
    return new APIError(
      'InvalidRequestBodyParameter',
      message,
      400,
      data,
      internalProperties
    );
  }
  public readonly statusCode!: number;
  public readonly name!: string;

  constructor(
    name: string,
    message: string,
    statusCode: number,
    public data?: any,
    public errorCode?: ApiErrorCode,
    public internalProperties?: any
  ) {
    super();
    this.name = name;
    this.statusCode = statusCode;
    this.message = message;
  }

  public publicVersion() {
    return new PublicError(this);
  }
}
export class PublicError {
  public name: string;
  public message: string;
  public statusCode: number;
  public data?: any;
  public errorCode?: ApiErrorCode;
  constructor(err: APIError) {
    this.name = err.name;
    this.message = err.message;
    this.statusCode = err.statusCode;
    this.data = err.data;
    this.errorCode = err.errorCode;
  }
}
export class PublicInfo {
  public static infoDeleted(data?: any) {
    return new PublicInfo('Resource Deleted', 204, data);
  }
  public static infoCreated(data?: any) {
    return new PublicInfo('Resource Created', 201, data);
  }
  public static infoUpdated(data?: any) {
    return new PublicInfo('Resource Updated', 201, data);
  }
  public static infoSelected(data: any) {
    return new PublicInfo('Success', 200, data);
  }

  public static infoPaginated(
    objectName: string,
    queryResults: any,
    totalResults: number,
    pageNo: number,
    pageSize: number
  ) {
    const object = queryResults;
    const total: number = totalResults;
    const pageCount: number = queryResults.length || 0;
    const totalPages: number = Math.ceil(total / pageSize) || 0;

    const data: PaginationObject = {
      page: pageNo + 1,
      pageSize: pageCount,
      totalItems: total,
      totalPages,
      [objectName]: object,
    };

    return new PublicInfo('Success', 200, data);
  }
  constructor(
    public message: string,
    public statusCode: number,
    public data?: any
  ) {}
}
