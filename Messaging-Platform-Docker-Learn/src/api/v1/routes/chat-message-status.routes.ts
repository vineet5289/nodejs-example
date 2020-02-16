import { Router } from 'express';
import chatMessageStatusController from '../controllers/chat-message-status.controller';
const { validateUserToken } = require('../middlewares/authCheck');

const router = Router();

router.put(
  '/',
  [validateUserToken],
  chatMessageStatusController.updateChatRoomMessageStatus
);

router.get(
  '/count',
  [validateUserToken],
  chatMessageStatusController.fetchUnReadMessageCount
);

export default router;
