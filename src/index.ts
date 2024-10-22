import * as http from 'http';
import * as dotenv from "dotenv";

import { itemsRouter } from "./router/router";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";

dotenv.config();

if (!process.env.PORT) {
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

    itemsRouter(req, res);
});



/* app.use("/api/items", itemsRouter);
app.use(errorHandler);
app.use(notFoundHandler);
 */

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.on('error', (err) => {
    console.error('Server error:', err);
});

