const express = require('express');
const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// All routes require admin authentication
router.use(auth, adminAuth);

// Admin dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProviders = await User.countDocuments({ role: 'provider' });
    const totalServices = await Service.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    
    // Revenue calculation (assuming 20% platform fee)
    const completedBookings = await Booking.find({ 
      status: 'completed',
      paymentStatus: 'paid'
    });
    
    const totalRevenue = completedBookings.reduce((sum, booking) => sum + (booking.amount * 0.2), 0);
    
    // Recent activities
    const recentBookings = await Booking.find()
      .populate('customer', 'name')
      .populate('provider', 'name')
      .populate('service', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    // Monthly revenue data (last 6 months)
    const monthlyRevenue = await getMonthlyRevenue();
    
    // Popular categories
    const popularCategories = await Service.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      overview: {
        totalUsers,
        totalProviders,
        totalServices,
        totalBookings,
        pendingBookings,
        totalRevenue: Math.round(totalRevenue * 100) / 100
      },
      recentBookings,
      monthlyRevenue,
      popularCategories
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User management
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Service management
router.get('/services', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status) filter.isActive = status === 'active';
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const services = await Service.find(filter)
      .populate('provider', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Service.countDocuments(filter);

    res.json({
      services,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Booking management
router.get('/bookings', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'provider.name': { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(filter)
      .populate('customer', 'name email')
      .populate('provider', 'name email')
      .populate('service', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user status
router.put('/users/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update service status
router.put('/services/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).populate('provider', 'name email');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ 
      message: `Service ${isActive ? 'activated' : 'deactivated'} successfully`,
      service 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Also delete user's services and bookings
    await Service.deleteMany({ provider: req.params.id });
    await Booking.deleteMany({ 
      $or: [
        { customer: req.params.id },
        { provider: req.params.id }
      ]
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete service
router.delete('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function for monthly revenue
async function getMonthlyRevenue() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return await Booking.aggregate([
    {
      $match: {
        status: 'completed',
        paymentStatus: 'paid',
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        revenue: { $sum: { $multiply: ['$amount', 0.2] } }, // 20% platform fee
        bookings: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    },
    {
      $limit: 6
    }
  ]);
}

module.exports = router;