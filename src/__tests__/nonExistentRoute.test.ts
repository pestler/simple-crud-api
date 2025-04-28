import request from 'supertest';
import { app } from '..';


describe('Non-existent routes', () => {
    it('should return 404 for non-existent endpoint', async () => {
        const response = await request(app).get('/non-existent-route');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Endpoint not found');
    });
});
