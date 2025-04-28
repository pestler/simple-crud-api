import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import * as ItemService from "../service/service";
import { Item } from "../interface/interface.model";

export const itemsRouter = (req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url || '', true);
    const pathname = parsedUrl.pathname || '';
    const method = req.method || '';
    console.log(`Request Method: ${method}, Path: ${pathname}`);

    const idMatch = pathname.match(/^\/api\/users\/([0-9a-zA-Z-]+)$/);
    const id = idMatch ? idMatch[1] : null;

    try {
        if (pathname === '/api/users' && method === 'GET') {
            getMethod(res);
        } else if (id && method === 'GET') {
            getMethodId(res, id);
        } else if (pathname === '/api/users' && method === 'POST') {
            postMethod(req, res);
        } else if (id && method === 'DELETE') {
            delMethod(res, id);
        } else if (id && method === 'PUT') {
            putMethod(req, res, id);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Endpoint not found' }));
        }
    } catch (error) {
        console.error(`Unexpected error: ${error}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal server error' }));
    }
};

const getMethod = async (res: ServerResponse) => {
    try {
        const items: Item[] = await ItemService.findAll();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(items));
    } catch (error) {
        console.error(`Error fetching all users: ${error}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Failed to fetch users' }));
    }
};

const getMethodId = async (res: ServerResponse, id: string) => {
    try {
        const item: Item | undefined = await ItemService.find(id);
        if (item) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(item));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
        }
    } catch (error) {
        console.error(`Error fetching user by ID: ${id}, Error: ${error}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Failed to fetch user by ID' }));
    }
};

const postMethod = async (req: IncomingMessage, res: ServerResponse) => {
    let body = '';
    req
        .on('data', (chunk) => {
            body += chunk;
        })
        .on('end', async () => {
            try {
                const { id, username, age, hobbies } = JSON.parse(body);

                if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid or missing user data' }));
                    return;
                }

                const newItem: Item = { id, username, age, hobbies };
                await ItemService.create(newItem);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newItem));
            } catch (error) {
                console.error(`Error creating user: ${error}`);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON format' }));
            }
        });
};

const putMethod = async (req: IncomingMessage, res: ServerResponse, id: string) => {
    let body = '';
    req
        .on('data', (chunk) => {
            body += chunk;
        })
        .on('end', async () => {
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

const delMethod = async (res: ServerResponse, id: string) => {
    try {
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
