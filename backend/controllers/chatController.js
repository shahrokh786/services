import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { getReceiverSocketId, io } from '../socket/socket.js'; // We will create this file next

// @desc    Send a message to a user
// @route   POST /api/messages/send/:id
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Find if a conversation already exists between these two users
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        // If no conversation exists, create a new one
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // Create the new message
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        // Add the new message to the conversation's messages array
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // This will run both saves in parallel for efficiency
        await Promise.all([conversation.save(), newMessage.save()]);

        // --- REAL-TIME MAGIC ---
        // Check if the receiver is currently online
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // If they are online, send the message to them directly via socket.io
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Get messages between the logged-in user and another user
// @route   GET /api/messages/:id
// @access  Private
const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages"); // This will fill the 'messages' array with the actual message documents

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export { sendMessage, getMessages };
