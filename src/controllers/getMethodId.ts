import { ServerResponse } from 'http';
import { validate as validateUUID } from 'uuid';
import * as ItemService from '../services/services';

export const getMethodId = async (res: ServerResponse, id: string) => {
    try {
        if (!validateUUID(id)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid user ID format' }));
            return;
        }

        const item = await ItemService.find(id);
        if (item) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(item));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Item not found' }));
        }
    } catch (error) {
        console.error(`Error fetching item by ID: ${id}, Error: ${error}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Failed to fetch item by ID' }));
    }
};
