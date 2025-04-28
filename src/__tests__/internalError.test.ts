import request from 'supertest';
import { Server } from 'http';
import { app } from '../index';

let server: Server;

beforeAll((done) => {
    server = app.listen(4000, () => done());
});

afterAll((done) => {
    server.close(done);
});

describe('HTTP Server Tests', () => {
    it('should return 404 for unknown route', async () => {
        const response = await request(server).get('/unknown');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Endpoint not found' });
    });

    it('should handle internal server error gracefully', async () => {
        const response = await request(server).get('/api/users/internal-error');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal Server Error' });
    });

    it('should return 400 for request errors', async () => {
        const response = await request(server).get('/api/users/invalid-uuid');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Invalid user ID format' });
    });

    it('should return 200 for valid requests', async () => {
        const response = await request(server).get('/api/users');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.any(Array));
    });
});
