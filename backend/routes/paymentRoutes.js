// File: backend/routes/paymentRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // Import the security guard
import { createCheckoutSession } from '../controllers/paymentController.js'; // Import our new controller

const router = express.Router();

// @desc    Create a new checkout session
// @route   POST /api/payments/create-checkout-session
// @access  Private (Requires user to be logged in)
router.post('/create-checkout-session', protect, createCheckoutSession);


// --- Routes to be added later as per Master Prompt ---
// router.get('/history', protect, getPaymentHistory); // For customer's payment history
// router.get('/earnings', protect, provider, getEarnings); // For provider's earnings
// router.post('/webhook', express.raw({type: 'application/json'}), handleStripeWebhook); // For Stripe to confirm payment

export default router;