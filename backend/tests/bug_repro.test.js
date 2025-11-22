import request from 'supertest';
import app from '../server.js';
import Service from '../models/Service.js';

describe('Service Controller - Search Bug', () => {
    it('should return 200 when invalid regex characters are used in keyword', async () => {
        // Now we expect 200 because the input is escaped
        const response = await request(app)
            .get('/api/services?keyword=(')
            .expect(200);

        // Should return an empty array (unless we have a service with '(' in title)
        expect(Array.isArray(response.body)).toBe(true);
    });
});
