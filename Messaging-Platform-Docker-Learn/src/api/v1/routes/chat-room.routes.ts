import { Router } from 'express';
import chatRoomController from '../controllers/chat-room.controller';
const { validateUserToken } = require('../middlewares/authCheck');

const router = Router();

router.get('/:id([0-9]+)', [validateUserToken], chatRoomController.get);

router.post('/', [validateUserToken], chatRoomController.post);

router.patch('/', [validateUserToken], chatRoomController.updateChatRoom);
router.get('/getChatRoomDetailsByUserId', [validateUserToken], chatRoomController.getChatRoomDetailsByUserId);
router.get('/detailsById/:id([0-9]+)', [validateUserToken], chatRoomController.getChatRoomDetailsByChatRoomId);

export default router;
