import axios from 'axios';

// The base URL for all authentication-related API calls
const API_URL = 'http://localhost:5000/api/auth';

// --- SERVICE FUNCTIONS ---
// Each function corresponds to a specific backend endpoint.

/**
 * Sends a registration request to the backend.
 * @param {object} registerData - The user's registration details (name, email, password, etc.).
 * @returns {Promise} An axios promise for the request.
 */
const register = (registerData) => {
    return axios.post(`${API_URL}/register`, registerData);
};

/**
 * Sends a login request to the backend.
 * @param {object} loginData - The user's login credentials (email, password).
 * @returns {Promise} An axios promise for the request.
 */
const login = (loginData) => {
    return axios.post(`${API_URL}/login`, loginData);
};

/**
 * Sends a logout request to the backend.
 * @returns {Promise} An axios promise for the request.
 */
const logout = () => {
    return axios.post(`${API_URL}/logout`);
};

/**
 * Fetches the profile of the currently logged-in user.
 * This relies on the JWT cookie being sent automatically by the browser.
 * @returns {Promise} An axios promise for the request.
 */
const getProfile = () => {
    return axios.get(`${API_URL}/profile`);
};

// Bundle all the functions into a single object for easy importing
const authService = {
    register,
    login,
    logout,
    getProfile,
};

export default authService;

