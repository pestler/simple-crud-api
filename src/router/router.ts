import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import * as ItemService from "../service/service";
import { Item } from "../interface/interface.model";

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
        getMethodId(res, id);
    } else if (pathname === '/api/users' && method === 'POST') {
        postMethod(req, res);
    } else if (id && pathname === `/api/users/${id}` && method === 'DELETE') {
        delMethod( res, id);
    } else if (id && pathname === `/api/users/${id}` && method === 'PUT') {
        putMethod( req, res, pathname);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Endpoint not found' }));
    }
}

const getMethod = async (res: ServerResponse) => {
    try {
        const items: Item[] = await ItemService.findAll();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(items));
    } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid JSON format' }));
    }
};

const getMethodId = async (res: ServerResponse, id: string) => {
    try {
        const item: Item | undefined = await ItemService.find(id);
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
                const { id, username, age, hobbies } = JSON.parse(body);

                if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid or missing user data' }));
                    return;
                }

                const item = { id, username, age, hobbies }
                ItemService.create(item);                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(item));
            } catch {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON format' }));
            }
        });
};

const putMethod = async (req: IncomingMessage, res: ServerResponse, pathname:string) => {    
    let body = '';
    req
        .on('data', (data) => {
            body += data;
        })
        .on('end', () => {
            try {
                const { id, username, age, hobbies } = JSON.parse(body);

                if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid or missing user data' }));
                    return;
                }

                const itemUpdate = { id, username, age, hobbies }
                const idPut=pathname.split('/')[3]                
                console.log(idPut);
                ItemService.update(idPut, itemUpdate);                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(itemUpdate));
            } catch {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON format' }));
            }
        });
};

const delMethod = async ( res: ServerResponse, id: string) => {
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