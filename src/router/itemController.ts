import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4, validate as validateUUID } from 'uuid';
import * as ItemService from '../service/service';
import { Item } from '../interface/interface.model';

export const getMethod = async (res: ServerResponse) => {
    try {
        const items: Item[] = await ItemService.findAll();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(items));
    } catch (error) {
        console.error(`Error fetching all items: ${error}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Failed to fetch items' }));
    }
};

export const getMethodId = async (res: ServerResponse, id: string) => {
    try {
        if (!validateUUID(id)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid user ID format' }));
            return;
        }

        const item: Item | undefined = await ItemService.find(id);
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

export const putMethod = async (req: IncomingMessage, res: ServerResponse, id: string) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    }).on('end', async () => {
        try {
            if (!validateUUID(id)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid user ID format' }));
                return;
            }

            const { username, age, hobbies } = JSON.parse(body);

            if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid or missing item data' }));
                return;
            }

            const itemUpdate = { id, username, age, hobbies };
            const updatedItem = await ItemService.update(id, itemUpdate);

            if (updatedItem) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(updatedItem));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Item not found' }));
            }
        } catch (error) {
            console.error(`Error updating item with ID: ${id}, Error: ${error}`);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON format' }));
        }
    });
};

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
            res.end(JSON.stringify({ message: 'Item not found' }));
        }
    } catch (error) {
        console.error(`Error deleting item with ID: ${id}, Error: ${error}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Failed to delete item' }));
    }
};
