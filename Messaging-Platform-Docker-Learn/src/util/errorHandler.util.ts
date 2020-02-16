import { NextFunction, Request, Response } from 'express';
import { ApiErrorCode } from '../common/api-error-code.constant';
import { APIError } from './httpErrors.util';
import logger from './logger.util';

export const notFoundError = (next: NextFunction) => {
  return next(APIError.errNotFound());
};

export const clientError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message);
  if (err instanceof APIError) {
    switch (req.app.get('env')) {
      case 'development':
        return res.status(err.statusCode).json(err);
      case 'production':
        return res.status(err.statusCode).json(err.publicVersion());
    }
  } else {
    next(err);
  }
};

export const serverError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message);
  switch (req.app.get('env')) {
    case 'development':
      return res
        .status(500)
        .json(
          APIError.errServerError(err.message, ApiErrorCode.UNKNOWN_ERROR, err)
        );
    case 'production':
      return res.status(500).json(APIError.errServerError());
  }
};
