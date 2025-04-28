import { IncomingMessage, ServerResponse } from 'http';
import { validate as validateUUID } from 'uuid';
import * as ItemService from '../services/services';

export const putMethod = async (req: IncomingMessage, res: ServerResponse, id: string) => {
    if (!validateUUID(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid user ID format' }));
        return;
    }

    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    }).on('end', async () => {
        try {
            const { username, age, hobbies } = JSON.parse(body);

            if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid or missing user data' }));
                return;
            }

            const itemUpdate = { id, username, age, hobbies };
            const updatedItem = await ItemService.update(id, itemUpdate);

            if (updatedItem) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(updatedItem));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not found' }));
            }
        } catch (error) {
            console.error(`Error updating user with ID: ${id}, Error: ${error}`);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON format' }));
        }
    });
};

