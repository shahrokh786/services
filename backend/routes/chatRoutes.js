import express from 'express';
import { sendMessage, getMessages } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get messages for a conversation
// @route   GET /api/chats/:id
// @access  Private
// This route is protected, so only a logged-in user can get their messages.
// The ':id' will be the ID of the user they are chatting with.
router.get('/:id', protect, getMessages);

// @desc    Send a message
// @route   POST /api/chats/send/:id
// @access  Private
// This route is protected, so only a logged-in user can send a message.
// The ':id' will be the ID of the user they are sending the message to.
router.post('/send/:id', protect, sendMessage);

export default router;
