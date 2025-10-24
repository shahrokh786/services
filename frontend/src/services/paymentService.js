// File: frontend/src/services/paymentService.js

// Import the central apiClient that includes credentials
import apiClient from '../api/axiosConfig'; // Ensure this path is correct

/**
 * Calls the backend to create a Stripe Checkout Session.
 * @param {string} serviceId - The ID of the service being paid for.
 * @param {number} [quantity=1] - Optional quantity (e.g., hours). Defaults to 1.
 * @returns {Promise} Axios promise resolving with { sessionId: string }
 */
const createCheckoutSession = (serviceId, quantity = 1) => {
    console.log(`[paymentService] Requesting checkout session for serviceId: ${serviceId}, quantity: ${quantity}`);
    return apiClient.post('/payments/create-checkout-session', { serviceId, quantity });
};

const paymentService = {
    createCheckoutSession,
};

export default paymentService;