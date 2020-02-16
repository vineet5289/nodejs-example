import { NextFunction, Request, Response } from 'express';

export interface CustomRequest extends Request {
  user?: any;
  langCode?: string;
  accessToken?: string;
  idToken?: any;
  userToken?: any;
}

export interface CustomResponse extends Response {}

export type CustomRequestHandler = (
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
) => any;
