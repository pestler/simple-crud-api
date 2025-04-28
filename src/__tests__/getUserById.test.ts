import { ServerResponse } from 'http';
import { validate as validateUUID } from 'uuid';
import * as ItemService from '../services/services';
import { getMethodId } from '../controllers';

jest.mock('uuid', () => ({
    validate: jest.fn(),
}));

jest.mock('../services/services', () => ({
    find: jest.fn(),
}));

const mockValidateUUID = validateUUID as jest.Mock;
const mockFind = ItemService.find as jest.Mock;

describe('getMethodId', () => {
    let res: Partial<ServerResponse>;

    beforeEach(() => {
        res = {
            writeHead: jest.fn(),
            end: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if the user ID format is invalid', async () => {
        const invalidId = '12345';
        mockValidateUUID.mockReturnValueOnce(false);

        await getMethodId(res as ServerResponse, invalidId);

        expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
        expect(res.end).toHaveBeenCalledWith(JSON.stringify({ message: 'Invalid user ID format' }));
    });

    it('should return 200 with the user if it exists', async () => {
        const validId = '8f14e45f-e8ca-4db6-823d-283b77638120';
        const user = { id: validId, name: 'Test User' };
        mockValidateUUID.mockReturnValueOnce(true);
        mockFind.mockResolvedValueOnce(user);

        await getMethodId(res as ServerResponse, validId);

        expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
        expect(res.end).toHaveBeenCalledWith(JSON.stringify(user));
    });

    it('should return 404 if the user is not found', async () => {
        const validId = '8f14e45f-e8ca-4db6-823d-283b77638120';
        mockValidateUUID.mockReturnValueOnce(true);
        mockFind.mockResolvedValueOnce(null);

        await getMethodId(res as ServerResponse, validId);

        expect(res.writeHead).toHaveBeenCalledWith(404, { 'Content-Type': 'application/json' });
        expect(res.end).toHaveBeenCalledWith(JSON.stringify({ message: 'User not found' }));
    });

    it('should return 500 if an error occurs', async () => {
        const validId = '8f14e45f-e8ca-4db6-823d-283b77638120';
        mockValidateUUID.mockReturnValueOnce(true);
        mockFind.mockRejectedValueOnce(new Error('Something went wrong'));

        await getMethodId(res as ServerResponse, validId);

        expect(res.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'application/json' });
        expect(res.end).toHaveBeenCalledWith(JSON.stringify({ message: 'Failed to fetch user by ID' }));
    });
});
