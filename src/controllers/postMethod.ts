import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import * as ItemService from '../services/services';
import { Item } from '../interface/interface.model';

export const postMethod = async (req: IncomingMessage, res: ServerResponse) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    }).on('end', async () => {
        try {
            const { username, age, hobbies } = JSON.parse(body);

            if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid or missing item data' }));
                return;
            }

            const newItem: Item = { id: uuidv4(), username, age, hobbies };
            await ItemService.create(newItem);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newItem));
        } catch (error) {
            console.error(`Error creating item: ${error}`);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON format' }));
        }
    });
};
