import * as http from 'http';
import * as dotenv from "dotenv";
import cluster from 'cluster';
import { URL } from 'node:url';
import 'dotenv/config';
import { itemsRouter } from "./router/router";

const numCPUs = require('node:os').availableParallelism()-1;
const PORT: number = parseInt(process.env.PORT as string, 10) || 4000;
let step: number = 0;

const getRoundRobinPort = (port: number): number => {
    if (step === numCPUs) {
        step = 1;
    } else {
        step = step + 1;
    }
    return port + step;
};

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

if (cluster!.isPrimary) {        
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
    });


    const primaryServer = http.createServer((req:http.IncomingMessage , res: http.ServerResponse<http.IncomingMessage> & {
        req: http.IncomingMessage;
    }) => {
        const nextPort = getRoundRobinPort(PORT); 
        console.log(`req: ${req.method} ${req.url} on port ${PORT}, pid: ${process.pid} redirected to: ${nextPort}`);
        const url = new URL(req.url, `http://${req.headers.host}`);
        
        console.log(req.headers.host);
        const options = {
            ...url,
            headers: req.headers,
            method: req.method,
            port: nextPort,
            path: url.pathname
        };
        req.pipe(
            http.request(options, (response) => {
                console.log(`Response received from port: ${nextPort}`);
                res.writeHead(response.statusCode, response.headers);
                response.pipe(res);
            }),
        );
    });

    primaryServer.listen(PORT, () => {
        
        console.log(`Load balancer running on http://localhost:${PORT}`);
    });

    cluster.on('exit', () => {
        console.log('Worker died!');
        cluster.fork(); 
    });


} else if (cluster.isWorker) {
    let workerPort = undefined;
    if(cluster.worker){
    workerPort = PORT + cluster.worker.id;
    }    
    const workerServer = http.createServer(itemsRouter);

    workerServer.listen(workerPort, () => {
        console.log(`balancer listening on port: ${workerPort}`);
    });
}


