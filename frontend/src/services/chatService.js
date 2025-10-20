import axios from 'axios';

// The base URL for all chat-related API calls
const API_URL = 'http://localhost:5000/api/chats';

/**
 * Sends a new message to a specific user.
 * @param {string} receiverId - The ID of the user to send the message to.
 * @param {string} message - The content of the message.
 * @returns {Promise} An axios promise for the request.
 */
const sendMessage = (receiverId, message) => {
    return axios.post(`${API_URL}/send/${receiverId}`, { message });
};

/**
 * Fetches the message history with a specific user.
 * @param {string} otherUserId - The ID of the user whose chat history you want to get.
 * @returns {Promise} An axios promise for the request.
 */
const getMessages = (otherUserId) => {
    return axios.get(`${API_URL}/${otherUserId}`);
};

// Bundle all the functions into a single service object for export
const chatService = {
    sendMessage,
    getMessages,
};

export default chatService;
