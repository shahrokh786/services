const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(), 
    environment: process.env.NODE_ENV 
  });
});

// Simple test routes
app.get('/api/services', (req, res) => {
  res.json([
    {
      _id: '1',
      title: 'Emergency Plumbing Service',
      description: 'Professional plumbing services for emergencies',
      category: 'plumbing',
      price: 75,
      provider: { name: 'John Plumbing' }
    },
    {
      _id: '2', 
      title: 'Electrical Wiring',
      description: 'Complete electrical wiring solutions',
      category: 'electrical',
      price: 100,
      provider: { name: 'Mike Electrician' }
    }
  ]);
});

app.get('/api/services/:id', (req, res) => {
  res.json({
    _id: req.params.id,
    title: 'Sample Service',
    description: 'This is a sample service description',
    category: 'plumbing',
    price: 75,
    provider: {
      name: 'Test Provider',
      phone: '+1234567890'
    }
  });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localservicehub')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 API Services: http://localhost:${PORT}/api/services`);
});