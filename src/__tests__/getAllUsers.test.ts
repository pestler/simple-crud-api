import request from 'supertest';
import { Server } from 'http';
import { app } from '..';

let server: Server;

beforeAll((done) => {
    server = app.listen(4000, () => done());
});

afterAll((done) => {
    server.close(done);
});

describe('GET /api/users', () => {
    it('should return an empty array when no users exist', async () => {
        const response = await request(server).get('/api/users');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});
