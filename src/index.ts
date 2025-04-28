import * as http from 'http';
import * as dotenv from 'dotenv';
import { itemsRouter } from './router/itemsRouter';

dotenv.config();

if (!process.env.PORT) {
    console.error('PORT is not defined in environment variables. Exiting...');
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10) || 4000;

const app = http.createServer((req, res) => {
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
        console.error('Router error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.on('error', (err) => {
    console.error('Server error:', err);
});
