import { Server, ServerResponse } from 'http';
import { validate as validateUUID } from 'uuid';
import * as ItemService from '../services/services';
import { delMethod } from '../controllers';
import { app } from '../index';

jest.mock('../services/services', () => ({
    remove: jest.fn(),
}));

const mockRemove = ItemService.remove as jest.Mock;
let server: Server;

beforeAll((done) => {
    server = app.listen(4000, () => done());
});

afterAll((done) => {
    server.close(done);
});

describe('delMethod', () => {
    let res: Partial<ServerResponse>;

    beforeEach(() => {
        res = {
            writeHead: jest.fn(),
            end: jest.fn(),
        };
    });

    it('should return 400 if the user ID format is invalid', async () => {
        const invalidId = '12345';
        await delMethod(res as ServerResponse, invalidId);

        expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
        expect(res.end).toHaveBeenCalledWith(JSON.stringify({ message: 'Invalid user ID format' }));
    });

    it('should return 204 if the user is successfully deleted', async () => {
        const validId = '8f14e45f-e8ca-4db6-823d-283b77638120';
        mockRemove.mockResolvedValueOnce(true);

        await delMethod(res as ServerResponse, validId);

        expect(res.writeHead).toHaveBeenCalledWith(204);
        expect(res.end).toHaveBeenCalled();
    });

    it('should return 404 if the user is not found', async () => {
        const validId = '8f14e45f-e8ca-4db6-823d-283b77638120';
        mockRemove.mockResolvedValueOnce(false);

        await delMethod(res as ServerResponse, validId);

        expect(res.writeHead).toHaveBeenCalledWith(404, { 'Content-Type': 'application/json' });
        expect(res.end).toHaveBeenCalledWith(JSON.stringify({ message: 'User not found' }));
    });

    it('should return 500 if an error occurs', async () => {
        const validId = '8f14e45f-e8ca-4db6-823d-283b77638120';
        mockRemove.mockRejectedValueOnce(new Error('Something went wrong'));

        await delMethod(res as ServerResponse, validId);

        expect(res.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'application/json' });
        expect(res.end).toHaveBeenCalledWith(JSON.stringify({ message: 'Failed to delete user' }));
    });
});
