import express from 'express';
const router = express.Router();
import {
    createBooking,
    getMyBookings,
    getProviderBookings,
    updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, provider } from '../middleware/authMiddleware.js';

// --- Customer Route ---
// A logged-in user can create a booking.
router.post('/', protect, createBooking);

// A logged-in user can get their own bookings.
router.get('/mybookings', protect, getMyBookings);


// --- Provider Routes ---
// A logged-in provider can get the bookings made for their services.
router.get('/provider', protect, provider, getProviderBookings);

// A logged-in provider can update the status of a booking.
router.put('/:id', protect, provider, updateBookingStatus);


export default router;
