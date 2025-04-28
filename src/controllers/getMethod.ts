import { ServerResponse } from 'http';
import * as ItemService from '../services/services';

export const getMethod = async (res: ServerResponse) => {
    try {
        const items = await ItemService.findAll();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(items));
    } catch (error) {
        console.error(`Error fetching all items: ${error}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Failed to fetch items' }));
    }
};
