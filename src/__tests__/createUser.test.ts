import { Server } from 'http';
import request from 'supertest';
import { app } from '../index';

let server: Server;

beforeAll((done) => {
    server = app.listen(4000, () => done());
});

afterAll((done) => {
    server.close(done);
});

describe('POST /api/users', () => {
    it('should create a new user and return 201', async () => {
        const newUser = {
            username: 'User Test',
            age: 40,
            hobbies: ['reading', 'sports', 'games']
        };

        const response = await request(server)
            .post('/api/users')
            .send(newUser);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(newUser);
    });

    it('should return 400 if required fields are missing', async () => {
        const response = await request(server).post('/api/users').send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid or missing user data');
    });
});
