const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId: bookingId.toString(),
        userId: req.user.userId.toString()
      }
    });

    // Update booking with payment intent
    await Booking.findByIdAndUpdate(bookingId, {
      paymentIntentId: paymentIntent.id
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment error', error: error.message });
  }
});

// Confirm payment and update booking
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          paymentStatus: 'paid',
          status: 'confirmed'
        },
        { new: true }
      );

      res.json({ 
        success: true, 
        booking,
        message: 'Payment successful!'
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Payment failed' 
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Payment confirmation error', error: error.message });
  }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Update booking status
      await Booking.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { 
          paymentStatus: 'paid',
          status: 'confirmed'
        }
      );
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

module.exports = router;