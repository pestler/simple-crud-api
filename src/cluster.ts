import * as http from 'http';
import * as dotenv from "dotenv";
import cluster from 'cluster';
import { itemsRouter } from "./router/router";

const numCPUs = require('os').cpus().length;  

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}


if (cluster.isMaster) {    
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {

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

app.listen(PORT, () => {
    console.log(`Worker ${process.pid} is running on port ${PORT}`);
});

app.on('error', (err) => {
    console.error('Server error:', err);
});


}



