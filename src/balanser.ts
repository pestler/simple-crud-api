import * as http from 'http';
import * as dotenv from 'dotenv';
import cluster from 'cluster';
import { URL } from 'node:url';
import 'dotenv/config';
import { itemsRouter } from './router/router';

const numCPUs = require('node:os').availableParallelism() - 1;
const PORT: number = parseInt(process.env.PORT as string, 10) || 4000;
let step: number = 0;

const getRoundRobinPort = (port: number): number => {
  step = step >= numCPUs ? 1 : step + 1;
  return port + step;
};

dotenv.config();

if (!process.env.PORT) {
  console.error('PORT is not defined in environment variables. Exiting...');
  process.exit(1);
}

if (cluster.isPrimary) {
  console.log(`Primary process started with pid: ${process.pid}`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.warn(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

  const primaryServer = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    const nextPort = getRoundRobinPort(PORT);
    const url = new URL(req.url!, `http://${req.headers.host}`);
    console.log(`Request: ${req.method} ${req.url} (PID: ${process.pid}) redirected to port: ${nextPort}`);

    const options = {
      hostname: 'localhost',
      port: nextPort,
      path: url.pathname,
      method: req.method,
      headers: req.headers,
    };

    req.pipe(
      http.request(options, (response) => {
        res.writeHead(response.statusCode!, response.headers);
        response.pipe(res);
      }).on('error', (err) => {
        console.error('Error in redirecting request:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      })
    );
  });

  primaryServer.listen(PORT, () => {
    console.log(`Load balancer running at http://localhost:${PORT}`);
  });
} else if (cluster.isWorker) {
  const workerPort = PORT + cluster.worker!.id;
  const workerServer = http.createServer((req, res) => {
    try {
      itemsRouter(req, res);
    } catch (err) {
      console.error('Error handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  workerServer.listen(workerPort, () => {
    console.log(`Worker listening on port: ${workerPort}, pid: ${process.pid}`);
  });
}
