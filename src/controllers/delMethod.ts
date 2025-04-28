import { ServerResponse } from 'http';
import { validate as validateUUID } from 'uuid';
import * as ItemService from '../services/services';

export const delMethod = async (res: ServerResponse, id: string) => {
    try {
        if (!validateUUID(id)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid user ID format' }));
            return;
        }

        const isDeleted = await ItemService.remove(id);

        if (isDeleted) {
            res.writeHead(204);
            res.end();
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
        }
    } catch (error) {
        console.error(`Error deleting user with ID: ${id}, Error: ${error}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Failed to delete user' }));
    }
};
