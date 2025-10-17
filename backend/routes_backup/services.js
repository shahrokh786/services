// LocalServiceHub Backend - Clean Working Version
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ======================
// MIDDLEWARE ONLY
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
      description: '24/7 plumbing services for leaks, clogs, and emergency repairs',
      category: 'plumbing',
      price: 85,
      provider: { 
        name: 'Expert Plumbers LLC', 
        rating: 4.8,
        reviews: 127
      },
      location: { 
        city: 'New York', 
        state: 'NY' 
      },
      image: '/images/plumbing.jpg',
      availability: 'Available Today'
    },
    {
      _id: '2',
      title: 'Electrical Wiring Installation',
      description: 'Professional electrical wiring and repair services for homes and offices',
      category: 'electrical',
      price: 120,
      provider: { 
        name: 'Safe Electric Co.', 
        rating: 4.9,
        reviews: 89
      },
      location: { 
        city: 'New York', 
        state: 'NY' 
      },
      image: '/images/electrical.jpg',
      availability: 'Available Today'
    },
    {
      _id: '3',
      title: 'Professional Home Cleaning',
      description: 'Deep cleaning services for apartments, houses, and offices',
      category: 'cleaning',
      price: 65,
      provider: { 
        name: 'Sparkle Cleaners', 
        rating: 4.7,
        reviews: 203
      },
      location: { 
        city: 'New York', 
        state: 'NY' 
      },
      image: '/images/cleaning.jpg',
      availability: 'Available Tomorrow'
    },
    {
      _id: '4',
      title: 'Carpentry & Furniture Repair',
      description: 'Custom carpentry work and furniture repair services',
      category: 'carpentry',
      price: 95,
      provider: { 
        name: 'Master Carpenters', 
        rating: 4.6,
        reviews: 74
      },
      location: { 
        city: 'New York', 
        state: 'NY' 
      },
      image: '/images/carpentry.jpg',
      availability: 'Available This Week'
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
    title: `Professional ${serviceId} Service`,
    description: 'High-quality professional service with 100% satisfaction guarantee. Our experienced professionals deliver exceptional results.',
    category: 'plumbing',
    price: 75,
    provider: {
      name: 'Trusted Service Provider',
      phone: '+1 (555) 123-4567',
      email: 'contact@provider.com',
      rating: 4.8,
      experience: '5+ years',
      reviews: 156,
      memberSince: 2020
    },
    location: {
      city: 'New York',
      state: 'NY',
      neighborhood: 'Manhattan'
    },
    availability: 'Available within 24 hours',
    tags: ['professional', 'licensed', 'insured', 'emergency', 'guaranteed'],
    features: [
      'Same day service',
      'Free estimates',
      'Warranty included',
      'Emergency available'
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

  res.json({
    success: true,
    message: 'Account created successfully! Welcome to LocalServiceHub.',
    user: {
      id: 'user_' + Date.now(),
      name: name,
      email: email,
      phone: phone || '',
      role: role,
      joined: new Date().toISOString()
    },
    token: 'demo-jwt-token-' + Date.now()
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log(`🔐 Login attempt: ${email}`);
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  res.json({
    success: true,
    message: 'Login successful! Welcome back.',
    user: {
      id: 'user_123456',
      name: 'Demo User',
      email: email,
      role: 'customer',
      phone: '+1 (555) 123-4567'
    },
    token: 'demo-jwt-token-' + Date.now(),
    expiresIn: '7d'
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
    console.log('');
    console.log('💡 Tip: Test these in your browser or Postman!');
    console.log('=================================================');
  });
};

// Start the server
startServer();