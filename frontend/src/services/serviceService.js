import axios from 'axios';

const API_URL = 'http://localhost:5000/api/services';

// --- PUBLIC FUNCTIONS ---
const getAllServices = (params) => {
    return axios.get(API_URL, { params });
};

const getServiceById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

// --- NEW CUSTOMER/USER FUNCTION (Requires Authentication) ---

/**
 * Creates a new review for a specific service.
 * @param {string} serviceId - The ID of the service to review.
 * @param {object} reviewData - The review content, e.g., { rating, comment }.
 * @returns {Promise} An axios promise for the request.
 */
const createReview = (serviceId, reviewData) => {
    // This sends a POST request to the new endpoint we created on the backend.
    return axios.post(`${API_URL}/${serviceId}/reviews`, reviewData);
};


// --- PROVIDER-ONLY FUNCTIONS (Requires Authentication) ---

const createService = (serviceData) => {
    return axios.post(API_URL, serviceData);
};

const getMyServices = () => {
    return axios.get(`${API_URL}/my/services`);
};

const updateService = (id, serviceData) => {
    return axios.put(`${API_URL}/${id}`, serviceData);
};

const deleteService = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

// Bundle all the functions into a single service object
const serviceService = {
    getAllServices,
    getServiceById,
    createService,
    getMyServices,
    updateService,
    deleteService,
    createReview, // <-- 1. ADD THE NEW FUNCTION TO THE EXPORTED OBJECT
};

export default serviceService;

