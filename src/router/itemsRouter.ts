import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { getMethod, getMethodId, postMethod, putMethod, delMethod } from '../controllers';
import { validate as validateUUID } from 'uuid';

export const itemsRouter = (req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url || '', true);
    const pathname = parsedUrl.pathname || '';
    const method = req.method || '';
    console.log(`Request Method: ${method}, Path: ${pathname}`);

    if (pathname === '/api/users/internal-error' && method === 'GET') {
        console.error('Simulated internal server error');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
        return;
    }

    const idMatch = pathname.match(/^\/api\/users\/([0-9a-zA-Z-]+)$/);
    const id = idMatch ? idMatch[1] : null;

    if (id && !validateUUID(id)) {
        console.error('Invalid UUID');
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid user ID format' }));
        return;
    }

    try {
        if (pathname === '/api/users' && method === 'GET') {
            getMethod(res);
        } else if (id && method === 'GET') {
            getMethodId(res, id);
        } else if (pathname === '/api/users' && method === 'POST') {
            postMethod(req, res);
        } else if (id && method === 'PUT') {
            putMethod(req, res, id);
        } else if (id && method === 'DELETE') {
            delMethod(res, id);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Endpoint not found' }));
        }
    } catch (error) {
        console.error(`Unexpected error: ${error}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};
