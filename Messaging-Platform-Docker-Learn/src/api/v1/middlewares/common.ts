import cors from 'cors';
import { json, NextFunction, Router, urlencoded } from 'express';
import { CustomRequest, CustomResponse } from '../../../util/express.util';
import logger from '../../../util/logger.util';

export const logging = (router: Router) => {
  router.use((req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    logger.info(`Request: HTTP ${req.method} ${req.originalUrl}`);
    next();
  });
};

export const handleCors = (router: Router) => {
  router.use(
    cors({
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'x-id-token',
        'x-user-token',
        'x-connect-language',
      ],
      credentials: false,
      exposedHeaders: [
        'application/json',
        'x-connect-language',
        'x-user-token',
        'x-id-token',
      ],
      maxAge: 600,
      methods: ['GET', 'PATCH', 'POST', 'DELETE', 'OPTIONS', 'PUT'],
      origin: true,
    })
  );
};

export const handleBodyRequestParsing = (router: Router) => {
  router.use(urlencoded({ extended: false, limit: '50mb' }));
  router.use(json({ limit: '50mb' }));
};
