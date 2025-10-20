import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bookings';

// --- Customer-Facing Functions ---

/**
 * Creates a new booking request.
 * @param {object} bookingData - The details of the booking (serviceId, date, time, etc.).
 * @returns {Promise} Axios promise for the API request.
 */
const createBooking = (bookingData) => {
    return axios.post(API_URL, bookingData);
};

/**
 * Fetches all bookings for the currently logged-in customer.
 * @returns {Promise} Axios promise for the API request.
 */
const getMyBookings = () => {
    return axios.get(`${API_URL}/mybookings`);
};


// --- Provider-Facing Functions ---

/**
 * Fetches all bookings for the currently logged-in provider.
 * @returns {Promise} Axios promise for the API request.
 */
const getProviderBookings = () => {
    return axios.get(`${API_URL}/provider`);
};

/**
 * Updates the status of a specific booking.
 * @param {string} bookingId - The ID of the booking to update.
 * @param {string} status - The new status (e.g., 'confirmed', 'completed').
 * @returns {Promise} Axios promise for the API request.
 */
const updateBookingStatus = (bookingId, status) => {
    return axios.put(`${API_URL}/${bookingId}`, { status });
};


const bookingService = {
    createBooking,
    getMyBookings,
    getProviderBookings,
    updateBookingStatus,
};

export default bookingService;
