const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Service = require('../models/Service');
const jwt = require('jsonwebtoken');

describe('Services API', () => {
  let providerToken;
  let customerToken;
  let providerId;

  beforeEach(async () => {
    // Create provider user
    const provider = await User.create({
      name: 'Service Provider',
      email: 'provider@example.com',
      password: 'password123',
      phone: '+1234567890',
      role: 'provider'
    });
    providerId = provider._id;

    // Create customer user
    await User.create({
      name: 'Service Customer',
      email: 'customer@example.com',
      password: 'password123',
      phone: '+1234567891',
      role: 'customer'
    });

    // Generate tokens
    providerToken = jwt.sign(
      { userId: providerId },
      process.env.JWT_SECRET || 'your-secret-key'
    );

    customerToken = jwt.sign(
      { userId: (await User.findOne({ email: 'customer@example.com' }))._id },
      process.env.JWT_SECRET || 'your-secret-key'
    );
  });

  describe('POST /api/services', () => {
    it('should create a new service as provider', async () => {
      const serviceData = {
        title: 'Test Plumbing Service',
        description: 'Professional plumbing services',
        category: 'plumbing',
        price: 50,
        priceType: 'hourly',
        location: {
          city: 'Test City',
          state: 'TS'
        }
      };

      const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${providerToken}`)
        .send(serviceData)
        .expect(201);

      expect(response.body.title).toBe(serviceData.title);
      expect(response.body.provider).toBe(providerId.toString());
    });

    it('should not create service without authentication', async () => {
      const response = await request(app)
        .post('/api/services')
        .send({ title: 'Test Service' })
        .expect(401);

      expect(response.body.message).toContain('No token');
    });
  });

  describe('GET /api/services', () => {
    beforeEach(async () => {
      await Service.create({
        title: 'Test Service 1',
        description: 'Description 1',
        category: 'plumbing',
        price: 50,
        provider: providerId,
        location: { city: 'City1', state: 'ST' }
      });

      await Service.create({
        title: 'Test Service 2',
        description: 'Description 2',
        category: 'electrical',
        price: 75,
        provider: providerId,
        location: { city: 'City2', state: 'ST' }
      });
    });

    it('should get all services', async () => {
      const response = await request(app)
        .get('/api/services')
        .expect(200);

      expect(response.body).toHaveLength(2);
    });

    it('should filter services by category', async () => {
      const response = await request(app)
        .get('/api/services?category=plumbing')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].category).toBe('plumbing');
    });

    it('should search services by title', async () => {
      const response = await request(app)
        .get('/api/services?search=Test Service 1')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Test Service 1');
    });
  });
});