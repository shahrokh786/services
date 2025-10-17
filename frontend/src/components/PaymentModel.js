import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ booking, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Create payment intent
      const { data } = await axios.post('http://localhost:5000/api/payments/create-payment-intent', {
        bookingId: booking._id,
        amount: booking.amount || booking.service.price
      });

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: booking.customer?.name || 'Customer',
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment with our backend
        await axios.post('http://localhost:5000/api/payments/confirm-payment', {
          paymentIntentId: paymentIntent.id,
          bookingId: booking._id
        });

        onSuccess(booking);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-xl font-semibold mb-4">Complete Payment</h2>
      
      <div className="mb-4">
        <div className="border rounded-lg p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-lg font-semibold">
            Total: ${booking.amount || booking.service.price}
          </p>
          <p className="text-sm text-gray-600">Service: {booking.service.title}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {loading ? 'Processing...' : `Pay $${booking.amount || booking.service.price}`}
        </button>
      </div>
    </form>
  );
};

const PaymentModal = ({ booking, onSuccess, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            booking={booking} 
            onSuccess={onSuccess}
            onClose={onClose}
          />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentModal;