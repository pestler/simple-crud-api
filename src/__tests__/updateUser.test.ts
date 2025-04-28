import { IncomingMessage, ServerResponse } from 'http';
import { validate as validateUUID } from 'uuid';
import * as ItemService from '../services/services';
import { putMethod } from '../controllers';

jest.mock('uuid', () => ({
    validate: jest.fn(),
}));

jest.mock('../services/services', () => ({
    update: jest.fn(),
}));

const mockValidateUUID = validateUUID as jest.Mock;
const mockUpdate = ItemService.update as jest.Mock;

describe('putMethod', () => {
    let req: Partial<IncomingMessage>;
    let res: Partial<ServerResponse>;

    beforeEach(() => {
        req = {
            on: jest.fn(),
            removeAllListeners: jest.fn(),
        };
        res = {
            writeHead: jest.fn(),
            end: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockRequestData = (data: string) => {
        (req.on as jest.Mock).mockImplementation((event, callback) => {
            if (event === 'data') {
                callback(data);
            }
            if (event === 'end') {
                callback();
            }
            return req;
        });
    };

    it('should return 400 if the user ID format is invalid', async () => {
        const invalidId = '12345';
        mockValidateUUID.mockReturnValueOnce(false);

        await putMethod(req as IncomingMessage, res as ServerResponse, invalidId);

        expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
        expect(res.end).toHaveBeenCalledWith(JSON.stringify({ message: 'Invalid user ID format' }));
    });

    it('should return 400 if user data is invalid or missing', async () => {
        const validId = '8f14e45f-e8ca-4db6-823d-283b77638120';
        const invalidBody = JSON.stringify({ username: 'Test', age: 'invalid_age', hobbies: 'not_an_array' });
        mockValidateUUID.mockReturnValueOnce(true);
        mockRequestData(invalidBody);

        await putMethod(req as IncomingMessage, res as ServerResponse, validId);

        expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
        expect(res.end).toHaveBeenCalledWith(JSON.stringify({ message: 'Invalid or missing user data' }));
    });

    it('should return 200 if the user is successfully updated', async () => {
        const validId = '8f14e45f-e8ca-4db6-823d-283b77638120';
        const validBody = JSON.stringify({ username: 'UpdatedUser', age: 30, hobbies: ['hobby1', 'hobby2'] });
        const updatedItem = { id: validId, username: 'UpdatedUser', age: 30, hobbies: ['hobby1', 'hobby2'] };
        mockValidateUUID.mockReturnValueOnce(true);
        mockRequestData(validBody);
        mockUpdate.mockResolvedValueOnce(updatedItem);

        await putMethod(req as IncomingMessage, res as ServerResponse, validId);

        expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
        expect(res.end).toHaveBeenCalledWith(JSON.stringify(updatedItem));
    });

    it('should return 404 if the user is not found', async () => {
        const validId = '8f14e45f-e8ca-4db6-823d-283b77638120';
        const validBody = JSON.stringify({ username: 'UpdatedUser', age: 30, hobbies: ['hobby1', 'hobby2'] });
        mockValidateUUID.mockReturnValueOnce(true);
        mockRequestData(validBody);
        mockUpdate.mockResolvedValueOnce(null);

        await putMethod(req as IncomingMessage, res as ServerResponse, validId);

        expect(res.writeHead).toHaveBeenCalledWith(404, { 'Content-Type': 'application/json' });
        expect(res.end).toHaveBeenCalledWith(JSON.stringify({ message: 'User not found' }));
    });

    it('should return 400 if the JSON format is invalid', async () => {
        const validId = '8f14e45f-e8ca-4db6-823d-283b77638120';
        const invalidJson = '{ "key": "value" ';
        mockValidateUUID.mockReturnValueOnce(true);
        mockRequestData(invalidJson);

        await putMethod(req as IncomingMessage, res as ServerResponse, validId);

        expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
        expect(res.end).toHaveBeenCalledWith(JSON.stringify({ message: 'Invalid JSON format' }));
    });
});
