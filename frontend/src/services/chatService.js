// File: frontend/src/services/chatService.js

// Import the configured apiClient
import apiClient from '../api/axiosConfig';

/**
 * Sends a new message to a specific user.
 * @param {string} receiverId - The ID of the user to send the message to.
 * @param {string} message - The content of the message.
 * @returns {Promise} An axios promise for the request.
 */
const sendMessage = (receiverId, message) => {
    const apiUrl = `/chats/send/${receiverId}`;
    console.log(`[chatService.sendMessage] Calling API: POST ${apiUrl}`); // Keep debug log
    return apiClient.post(apiUrl, { message });
};

/**
 * Fetches the message history with a specific user.
 * @param {string} otherUserId - The ID of the user whose chat history you want to get.
 * @returns {Promise} An axios promise for the request.
 */
const getMessages = (otherUserId) => {
    const apiUrl = `/chats/${otherUserId}`;
    console.log(`[chatService.getMessages] Calling API: GET ${apiUrl}`); // Keep debug log
    return apiClient.get(apiUrl);
};

// --- THIS FUNCTION WAS MISSING OR NOT EXPORTED ---
/**
 * Fetches all conversations (inbox) for the logged-in user.
 * @returns {Promise} An axios promise for the request.
 */
const getConversations = () => {
    const apiUrl = `/chats`;
    console.log(`[chatService.getConversations] Calling API: GET ${apiUrl}`); // Keep debug log
    return apiClient.get(apiUrl);
};


// --- ENSURE ALL FUNCTIONS ARE EXPORTED ---
const chatService = {
    sendMessage,
    getMessages,
    getConversations, // Make sure it's included here
};

export default chatService;