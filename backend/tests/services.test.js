import request from 'supertest';
import app from '../server.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import jwt from 'jsonwebtoken';

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
    const customer = await User.create({
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
      { userId: customer._id },
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

      // NOTE: The authMiddleware in this project might expect something specific.
      // I will check authMiddleware if this fails.

      const response = await request(app)
        .post('/api/services')
        // .set('Authorization', `Bearer ${providerToken}`) // Most apps use this
        .set('Cookie', [`jwt=${providerToken}`]) // This app uses cookies for auth
        .send(serviceData)
        .expect(201);

      expect(response.body.title).toBe(serviceData.title);
      expect(response.body.user).toBe(providerId.toString());
    });

    it('should not create service without authentication', async () => {
      const response = await request(app)
        .post('/api/services')
        .send({ title: 'Test Service' })
        .expect(401);

      expect(response.body.message).toContain('Not authorized');
    });
  });

  describe('GET /api/services', () => {
    beforeEach(async () => {
      await Service.create({
        title: 'Test Service 1',
        description: 'Description 1',
        category: 'plumbing',
        price: 50,
        user: providerId,
        location: { city: 'City1', state: 'ST' }
      });

      await Service.create({
        title: 'Test Service 2',
        description: 'Description 2',
        category: 'electrical',
        price: 75,
        user: providerId,
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
        .get('/api/services?keyword=Test Service 1') // Changed from 'search' to 'keyword' to match controller
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Test Service 1');
    });
  });
});
