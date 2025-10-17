// LocalServiceHub Backend - Minimal Working Version
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware ONLY - no route imports
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Services API
app.get('/api/services', (req, res) => {
  const services = [
    {
      _id: '1',
      title: 'Plumbing Service',
      description: 'Fix leaks and clogs',
      category: 'plumbing',
      price: 80,
      provider: { name: 'John Plumber' }
    },
    {
      _id: '2',
      title: 'Electrical Work',
      description: 'Wiring and repairs',
      category: 'electrical', 
      price: 100,
      provider: { name: 'Mike Electrician' }
    }
  ];
  res.json(services);
});

// Single service
app.get('/api/services/:id', (req, res) => {
  res.json({
    _id: req.params.id,
    title: 'Service ' + req.params.id,
    description: 'Professional service',
    price: 75
  });
});

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  res.json({ 
    message: 'User registered',
    user: { name: req.body.name, email: req.body.email }
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ 
    message: 'Login successful',
    user: { email: req.body.email },
    token: 'demo-token'
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log('✅ BACKEND RUNNING!');
  console.log(`📍 http://localhost:${PORT}`);
  console.log('📋 Endpoints:');
  console.log(`   GET  /health`);
  console.log(`   GET  /api/services`);
  console.log(`   GET  /api/services/:id`);
  console.log(`   POST /api/auth/register`);
  console.log(`   POST /api/auth/login`);
});
