const express = require('express');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');
const auth = require('../middleware/auth');
const router = express.Router();

// Create review
router.post('/', auth, async (req, res) => {
  try {
    const { bookingId, rating, comment, type } = req.body;

    // Check if booking exists and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.status !== 'completed') {
      return res.status(400).json({ message: 'Cannot review this booking' });
    }

    // Check if user is authorized to review
    if (type === 'customer-to-provider' && booking.customer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (type === 'provider-to-customer' && booking.provider.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check for existing review
    const existingReview = await Review.findOne({ 
      booking: bookingId, 
      reviewer: req.user.userId,
      type 
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'Already reviewed this booking' });
    }

    const review = new Review({
      booking: bookingId,
      reviewer: req.user.userId,
      reviewee: type === 'customer-to-provider' ? booking.provider : booking.customer,
      rating,
      comment,
      type
    });

    await review.save();

    // Update user ratings
    await updateUserRating(review.reviewee);

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get reviews for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name profilePicture')
      .populate('booking')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user rating
const updateUserRating = async (userId) => {
  const reviews = await Review.find({ reviewee: userId, type: 'customer-to-provider' });
  
  if (reviews.length > 0) {
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    
    await User.findByIdAndUpdate(userId, {
      rating: Math.round(averageRating * 10) / 10
    });
  }
};

module.exports = router;