// File: backend/controllers/paymentController.js

import Stripe from 'stripe';
import Service from '../models/Service.js'; // Assuming model path is ../models/Service.js
// Import Transaction model (we'll create this model in the next step)
// import Transaction from '../models/Transaction.js'; 

// Initialize Stripe with your Secret Key from .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create a Stripe Checkout Session for a service
// @route   POST /api/payments/create-checkout-session
// @access  Private (Logged-in Customer)
const createCheckoutSession = async (req, res) => {
    const { serviceId, quantity = 1 } = req.body;
    const customerId = req.user._id; // This is the logged-in customer

    // --- Validation ---
    if (!serviceId) {
        return res.status(400).json({ message: 'Service ID is required' });
    }

    try {
        // --- 1. Fetch the Service ---
        // We MUST populate the 'user' field to get the provider's details
        const service = await Service.findById(serviceId).populate('user', 'name email');
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        if (!service.price || service.price <= 0) {
             return res.status(400).json({ message: 'Service does not have a valid price' });
        }
        // Use service.user (based on your frontend code) to find the provider
        if (!service.user?._id) {
             return res.status(500).json({ message: 'Service provider information is missing' });
        }
        const providerId = service.user._id;

        // Prevent provider from paying for their own service
        if (customerId.toString() === providerId.toString()) {
            return res.status(400).json({ message: 'Cannot purchase your own service' });
        }
        
        // --- 2. Define Line Item for Stripe ---
        // Price must be in cents (e.g., 20.00 EUR -> 2000 cents)
        const unitAmount = Math.round(service.price * 100); 
        const lineItems = [{
            price_data: {
                currency: 'eur', // Set for Portugal/Europe. Change if needed.
                product_data: {
                    name: service.title || 'Service Payment', // Use 'title' from your Service model
                    // description: service.description, // Optional
                },
                unit_amount: unitAmount,
            },
            quantity: quantity,
        }];

        // --- 3. Define Success and Cancel URLs ---
        const successUrl = `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${process.env.FRONTEND_URL}/service/${serviceId}`; // Go back to service page on cancel

        // --- 4. Create Stripe Checkout Session ---
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'multibanco'], // Added Multibanco for Portugal
            line_items: lineItems,
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            customer_email: req.user.email, // Pre-fill customer's email
            // --- Metadata: This is CRITICAL for linking the payment ---
            metadata: {
                serviceId: service._id.toString(),
                customerId: customerId.toString(),
                providerId: providerId.toString(),
                quantity: quantity.toString(),
            },
        });

        // --- 5. Return Session ID ---
        res.json({ sessionId: session.id });

    } catch (error) {
        console.error("Error creating Stripe checkout session:", error);
        res.status(500).json({ message: 'Failed to initiate payment', error: error.message });
    }
};

// We will add getPaymentHistory and getEarnings later
export { createCheckoutSession };