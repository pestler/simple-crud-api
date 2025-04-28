import * as http from 'http';
import * as dotenv from 'dotenv';
import { itemsRouter } from './router/itemsRouter';

dotenv.config();

if (!process.env.PORT) {
    console.error('Environment variable "PORT" is missing. Please define it in your .env file. Exiting...');
    process.exit(1);
}

const PORT = Number(process.env.PORT) || 4000;

if (isNaN(PORT)) {
    console.error('PORT is not a valid number. Exiting...');
    process.exit(1);
}

export const app = http.createServer((req, res) => {
    req.on('error', (err) => {
        console.error('Request error:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Bad Request' }));
    });

    res.on('error', (err) => {
        console.error('Response error:', err);
    });

    try {
        itemsRouter(req, res);
    } catch (error) {
        console.error('Unexpected error occurred in itemsRouter:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
        console.log('Press Ctrl+C to stop the server.');
    });
}
