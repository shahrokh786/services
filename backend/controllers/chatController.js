import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
// --- CRITICAL FIX: The import path is now corrected to point to our single, unified server file ---
import { getReceiverSocketId, io } from '../server.js'; 

// @desc    Send a message to a user
// @route   POST /api/chats/send/:id
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        // --- REAL-TIME MAGIC ---
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // The 'io' instance is now correctly imported from server.js
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Get messages between the logged-in user and another user
// @route   GET /api/chats/:id
// @access  Private
const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");

        if (!conversation) return res.status(200).json([]);

        res.status(200).json(conversation.messages);
    } catch (error) {
        console.error("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// --- NEW "INBOX" FUNCTIONALITY ---
// @desc    Get all conversations for the logged-in user
// @route   GET /api/chats
// @access  Private
const getConversations = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const conversations = await Conversation.find({
            participants: loggedInUserId,
        }).populate({
            path: "participants",
            select: "name profilePicture email", // We need email and other details for the inbox UI
        });

        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error in getConversations controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// We now export the new function along with the old ones.
export { sendMessage, getMessages, getConversations };

