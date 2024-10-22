import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import * as ItemService from "../service/service";
import { BaseItem, Item, Items } from "../interface/interface.model";

export const itemsRouter = (req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url || '', true);
    const pathname = parsedUrl.pathname || '';
    const method = req.method || '';
    console.log(method);
    const idMatch = pathname.match(/^\/api\/users\/([0-9a-zA-Z-]+)$/);
    const id = idMatch ? idMatch[1] : null;

    if (pathname === '/api/users' && method === 'GET') {
        getMethod(res)
    } else if (id && pathname === `/api/users/${id}` && method === 'GET') {
        getMethodId(res, Number(id));
    } else if (pathname === '/api/users' && method === 'POST') {
        postMethod(req, res);
    } else if (id && pathname === `/api/users/${id}` && method === 'DELETE') {
        delMethod(req, res, Number(id));
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Endpoint not found' }));
    }
}

const getMethod = async (res: ServerResponse) => {
    try {
        const items: Items = await ItemService.findAll();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(items));
    } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid JSON format' }));
    }
};

const getMethodId = async (res: ServerResponse, id: number) => {
    try {
        const item: Item = await ItemService.find(id);
        if (item) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(item));
        }
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
    } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid user ID format' }));
        return;
    }
};

const postMethod = async (req: IncomingMessage, res: ServerResponse) => {
    let body = '';

    req
        .on('data', (data) => {
            body += data;
        })
        .on('end', () => {
            try {
                const { username, age, hobbies } = JSON.parse(body);

                if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid or missing user data' }));
                    return;
                }

                const item = { username, age, hobbies }
                const newUser = ItemService.create(item);
                console.log(newUser);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newUser));
            } catch {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON format' }));
            }
        });

};

/* itemsRouter.put("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const itemUpdate: Item = req.body;

        const existingItem: Item = await ItemService.find(id);

        if (existingItem) {
            const updatedItem = await ItemService.update(id, itemUpdate);
            return res.status(200).json(updatedItem);
        }

        const newItem = await ItemService.create(itemUpdate);

        res.status(201).json(newItem);
    } catch (e) {
        res.status(500).send(e.message);
    }
}); */

const delMethod = async (req: IncomingMessage, res: ServerResponse, id: number) => {
    if (!id) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid user ID format' }));
        return;
    }

    const userId = ItemService.remove(id);

    if (await userId) {
        res.writeHead(204);
        res.end();
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
    }
}; 