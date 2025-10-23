// File: backend/controllers/chatController.js

import Conversation from '../models/Conversation.js'; // Using Conversation model from restored version
import Message from '../models/Message.js';       // Using Message model from restored version
// --- ARCHITECTURAL FIX: Import from the dedicated Socket Hub ---
import { getReceiverSocketId, io, userSocketMap } from '../socket/socket.js';

// @desc    Send a message to a user
// @route   POST /api/chats/send/:id
// @access  Private
const sendMessage = async (req, res) => {
    try {
        // --- ADDED Precise Logging ---
        console.log(`[sendMessage ENTRY] Raw req.params:`, req.params, `Raw req.user._id: ${req.user?._id}`);
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        console.log(`[sendMessage] Extracted IDs. Sender: ${senderId}, Receiver(from params.id): ${receiverId}`);

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            console.log(`[sendMessage] No existing chat found. Creating new conversation.`);
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
             console.log(`[sendMessage] New conversation created with ID: ${conversation._id}`);
        } else {
            console.log(`[sendMessage] Found existing conversation with ID: ${conversation._id}`);
        }

        const newMessage = new Message({ senderId, receiverId, message });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);
        console.log(`[sendMessage] Message saved to DB with ID: ${newMessage._id}`);

        console.log(`[sendMessage] Attempting to find receiver's socket ID for receiverId: ${receiverId}`);
        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            console.log(`[sendMessage] Found receiverSocketId: ${receiverSocketId}. Emitting 'newMessage' event.`);
            io.to(receiverSocketId).emit("newMessage", newMessage);
            console.log(`[sendMessage] 'newMessage' event emitted successfully to ${receiverSocketId}.`);
        } else {
            console.log(`[sendMessage] FAILED TO FIND receiverSocketId for receiverId: ${receiverId}. Message saved, but not sent in real-time.`);
            console.log("[sendMessage] Current userSocketMap state:", userSocketMap); // Now correctly logs the map
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("[sendMessage] Controller Error: ", error.message);
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
        }).populate("messages"); // Populates the messages array with actual message documents

        if (!conversation) return res.status(200).json([]);

        res.status(200).json(conversation.messages);
    } catch (error) {
        console.error("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Get all conversations for the logged-in user
// @route   GET /api/chats
// @access  Private
const getConversations = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        // Find conversations where the loggedInUserId is in the participants array
        const conversations = await Conversation.find({
            participants: loggedInUserId,
        }).populate({ // Populate participant details for the inbox UI
            path: "participants",
            select: "name profilePicture email", // Select fields needed for display
        });

        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error in getConversations controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export { sendMessage, getMessages, getConversations };