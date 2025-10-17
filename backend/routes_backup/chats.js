const express = require('express');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const auth = require('../middleware/auth');
const router = express.Router();

// Get or create chat
router.post('/', auth, async (req, res) => {
  try {
    const { participantId, bookingId } = req.body;
    const participants = [req.user.userId, participantId].sort();

    let chat = await Chat.findOne({
      participants: { $all: participants },
      ...(bookingId && { booking: bookingId })
    })
      .populate('participants', 'name profilePicture')
      .populate('lastMessage');

    if (!chat) {
      chat = new Chat({
        participants,
        ...(bookingId && { booking: bookingId })
      });
      await chat.save();
      await chat.populate('participants', 'name profilePicture');
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's chats
router.get('/my-chats', auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.userId
    })
      .populate('participants', 'name profilePicture')
      .populate('lastMessage')
      .populate('booking')
      .sort({ lastActivity: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get chat messages
router.get('/:chatId/messages', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Check if user is participant in chat
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      participants: req.user.userId
    });

    if (!chat) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Mark messages as read
    await Message.updateMany(
      {
        chat: req.params.chatId,
        sender: { $ne: req.user.userId },
        'readBy.user': { $ne: req.user.userId }
      },
      {
        $push: {
          readBy: {
            user: req.user.userId,
            readAt: new Date()
          }
        }
      }
    );

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete chat
router.delete('/:chatId', auth, async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.chatId,
      participants: req.user.userId
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Also delete all messages in the chat
    await Message.deleteMany({ chat: req.params.chatId });

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;