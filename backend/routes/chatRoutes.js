import express from 'express';
// 1. Import the new 'getConversations' function from our controller
import { sendMessage, getMessages, getConversations } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- NEW "INBOX" ROUTE ---
// @desc    Get all conversations for the logged-in user
// @route   GET /api/chats
// @access  Private
// This route is protected and will fetch a list of all chat threads for the user.
router.get('/', protect, getConversations);


// --- EXISTING ROUTES ---

// @desc    Get all messages within a specific conversation
// @route   GET /api/chats/:id
// @access  Private
// NOTE: It is critical that this more specific route comes AFTER the general '/' route.
router.get('/:id', protect, getMessages);

// @desc    Send a message to a user
// @route   POST /api/chats/send/:id
// @access  Private
router.post('/send/:id', protect, sendMessage);

export default router;

