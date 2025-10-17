// LocalServiceHub Backend - Complete Working Version
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());

// ======================
// HEALTH CHECK
// ======================
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK ✅', 
    message: 'LocalServiceHub Backend is running perfectly!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ======================
// SERVICES API
// ======================
app.get('/api/services', (req, res) => {
  console.log('📦 Fetching services...');
  const services = [
    {
      _id: '1',
      title: 'Emergency Plumbing Repair',
      description: '24/7 plumbing services for leaks, clogs, and emergency repairs. We fix all types of plumbing issues quickly and efficiently.',
      category: 'plumbing',
      price: 85,
      provider: { 
        name: 'Expert Plumbers LLC', 
        rating: 4.8,
        reviews: 127,
        experience: '10+ years'
      },
      location: { 
        city: 'New York', 
        state: 'NY' 
      },
      availability: 'Available Today',
      duration: '1-2 hours',
      tags: ['emergency', 'licensed', 'insured']
    },
    {
      _id: '2',
      title: 'Electrical Wiring Installation',
      description: 'Professional electrical wiring and repair services for homes and offices. Safe and certified electrical work.',
      category: 'electrical',
      price: 120,
      provider: { 
        name: 'Safe Electric Co.', 
        rating: 4.9,
        reviews: 89,
        experience: '8+ years'
      },
      location: { 
        city: 'New York', 
        state: 'NY' 
      },
      availability: 'Available Today',
      duration: '2-3 hours',
      tags: ['certified', 'safety-checked']
    },
    {
      _id: '3',
      title: 'Professional Home Cleaning',
      description: 'Deep cleaning services for apartments, houses, and offices. We make your space sparkle and shine.',
      category: 'cleaning',
      price: 65,
      provider: { 
        name: 'Sparkle Cleaners', 
        rating: 4.7,
        reviews: 203,
        experience: '5+ years'
      },
      location: { 
        city: 'New York', 
        state: 'NY' 
      },
      availability: 'Available Tomorrow',
      duration: '3-4 hours',
      tags: ['deep-clean', 'eco-friendly']
    },
    {
      _id: '4',
      title: 'Carpentry & Furniture Repair',
      description: 'Custom carpentry work and furniture repair services. From custom shelves to antique restoration.',
      category: 'carpentry',
      price: 95,
      provider: { 
        name: 'Master Carpenters', 
        rating: 4.6,
        reviews: 74,
        experience: '12+ years'
      },
      location: { 
        city: 'New York', 
        state: 'NY' 
      },
      availability: 'Available This Week',
      duration: '4-6 hours',
      tags: ['custom-work', 'restoration']
    },
    {
      _id: '5',
      title: 'House Painting Services',
      description: 'Interior and exterior painting services. Transform your space with professional painting.',
      category: 'painting',
      price: 200,
      provider: { 
        name: 'Color Masters', 
        rating: 4.5,
        reviews: 156,
        experience: '7+ years'
      },
      location: { 
        city: 'New York', 
        state: 'NY' 
      },
      availability: 'Next Week',
      duration: '1-2 days',
      tags: ['interior', 'exterior']
    },
    {
      _id: '6',
      title: 'AC Repair & Maintenance',
      description: 'Air conditioning repair and maintenance services. Stay cool with our expert AC technicians.',
      category: 'hvac',
      price: 150,
      provider: { 
        name: 'Cool Solutions', 
        rating: 4.8,
        reviews: 98,
        experience: '9+ years'
      },
      location: { 
        city: 'New York', 
        state: 'NY' 
      },
      availability: 'Available Today',
      duration: '2-3 hours',
      tags: ['emergency', 'maintenance']
    }
  ];
  res.json(services);
});

// Get single service by ID
app.get('/api/services/:id', (req, res) => {
  const serviceId = req.params.id;
  console.log(`🔍 Fetching service ${serviceId}...`);
  
  const service = {
    _id: serviceId,
    title: `Professional Service ${serviceId}`,
    description: 'High-quality professional service with 100% satisfaction guarantee. Our experienced professionals deliver exceptional results for all your needs.',
    category: 'plumbing',
    price: 75,
    provider: {
      name: 'Trusted Service Provider',
      phone: '+1 (555) 123-4567',
      email: 'contact@provider.com',
      rating: 4.8,
      experience: '5+ years',
      reviews: 156,
      memberSince: 2020,
      verified: true
    },
    location: {
      city: 'New York',
      state: 'NY',
      neighborhood: 'Manhattan',
      serviceArea: 'All NYC boroughs'
    },
    availability: 'Available within 24 hours',
    responseTime: 'Within 1 hour',
    tags: ['professional', 'licensed', 'insured', 'emergency', 'guaranteed'],
    features: [
      'Same day service',
      'Free estimates',
      'Warranty included',
      'Emergency available',
      'Quality guaranteed'
    ],
    images: [
      '/images/service1.jpg',
      '/images/service2.jpg'
    ]
  };
  res.json(service);
});

// ======================
// AUTHENTICATION API
// ======================
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone, role = 'customer' } = req.body;
  console.log(`👤 New registration: ${email}`);
  
  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required'
    });
  }

  // Check if email already exists (in real app, check database)
  if (email.includes('test')) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered'
    });
  }

  res.json({
    success: true,
    message: 'Account created successfully! Welcome to LocalServiceHub.',
    user: {
      id: 'user_' + Date.now(),
      name: name,
      email: email,
      phone: phone || '',
      role: role,
      joined: new Date().toISOString(),
      profileComplete: false
    },
    token: 'jwt-token-' + Math.random().toString(36).substr(2, 9),
    expiresIn: '7d'
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log(`🔐 Login attempt: ${email}`);
  
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Mock authentication (in real app, check database)
  if (password.length < 3) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  res.json({
    success: true,
    message: 'Login successful! Welcome back.',
    user: {
      id: 'user_123456',
      name: email.split('@')[0] || 'Demo User',
      email: email,
      role: 'customer',
      phone: '+1 (555) 123-4567',
      joined: '2024-01-15'
    },
    token: 'jwt-token-' + Math.random().toString(36).substr(2, 9),
    expiresIn: '7d'
  });
});

// Get user profile
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  res.json({
    success: true,
    user: {
      id: 'user_123456',
      name: 'Demo User',
      email: 'user@example.com',
      role: 'customer',
      phone: '+1 (555) 123-4567',
      joined: '2024-01-15'
    }
  });
});

// ======================
// BOOKINGS API
// ======================
app.post('/api/bookings', (req, res) => {
  const { serviceId, date, time, address, customerId } = req.body;
  console.log(`📅 New booking for service: ${serviceId}`);
  
  if (!serviceId || !date || !customerId) {
    return res.status(400).json({
      success: false,
      message: 'Service ID, date, and customer ID are required'
    });
  }

  const booking = {
    id: 'booking_' + Date.now(),
    serviceId: serviceId,
    customerId: customerId,
    date: date,
    time: time || '10:00 AM',
    address: address || '123 Main St, New York, NY',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    total: 75,
    provider: {
      name: 'Expert Service Provider',
      phone: '+1 (555) 987-6543'
    }
  };

  res.json({
    success: true,
    message: 'Booking confirmed successfully!',
    booking: booking
  });
});

// Get user bookings
app.get('/api/bookings/user/:userId', (req, res) => {
  const bookings = [
    {
      id: 'booking_123',
      serviceId: '1',
      serviceTitle: 'Plumbing Repair',
      date: '2024-01-20',
      time: '10:00 AM',
      status: 'completed',
      total: 85
    },
    {
      id: 'booking_124',
      serviceId: '3',
      serviceTitle: 'Home Cleaning',
      date: '2024-01-25',
      time: '2:00 PM',
      status: 'upcoming',
      total: 65
    }
  ];
  
  res.json({
    success: true,
    bookings: bookings
  });
});

// ======================
// DATABASE CONNECTION
// ======================
const connectDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/localservicehub';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.log('⚠️ MongoDB not connected (server still works):', error.message);
    console.log('💡 Using demo data instead');
  }
};

// ======================
// START SERVER
// ======================
const startServer = async () => {
  await connectDatabase();
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log('');
    console.log('🎉 🎉 🎉 LOCAL SERVICE HUB BACKEND STARTED! 🎉 🎉 🎉');
    console.log('=================================================');
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('');
    console.log('📚 AVAILABLE ENDPOINTS:');
    console.log(`   ✅  GET  http://localhost:${PORT}/health`);
    console.log(`   🔧  GET  http://localhost:${PORT}/api/services`);
    console.log(`   🔍  GET  http://localhost:${PORT}/api/services/1`);
    console.log(`   👤  POST http://localhost:${PORT}/api/auth/register`);
    console.log(`   🔐  POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   👤  GET  http://localhost:${PORT}/api/auth/me`);
    console.log(`   📅  POST http://localhost:${PORT}/api/bookings`);
    console.log(`   📋  GET  http://localhost:${PORT}/api/bookings/user/123`);
    console.log('');
    console.log('💡 Tip: Test these in your browser or Postman!');
    console.log('=================================================');
  });
};

// Start the server
startServer();