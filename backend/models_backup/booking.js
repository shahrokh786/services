const express = require('express');
const Booking = require('../models/booking');
const router = express.Router();

// Create booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customer', 'name email')
      .populate('provider', 'name email')
      .populate('service', 'title price');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;