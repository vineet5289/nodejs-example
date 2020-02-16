import { Router } from 'express';
import middleware from './middlewares';

import { applyMiddleware } from '../../util/index.util';
import errorHandlers from './middlewares/errorHandlers';
import chatMessageStatusRouter from './routes/chat-message-status.routes';
import chatRoomRouter from './routes/chat-room.routes';
// import userRouter from './routes/user.routes';

const router = Router();

// Configure common middlewares like logger, cors etc.
applyMiddleware(middleware, router);

// api router will mount other routers
// router.use('/user', userRouter);
router.use('/chat-room', chatRoomRouter);
router.use('/chat-message-status', chatMessageStatusRouter);

// Configure error handler middlewares
applyMiddleware(errorHandlers, router);

export default router;
