import cluster from "node:cluster";
import http from "node:http";
import { availableParallelism } from "node:os";
import { PORT } from "./constants.ts";
import { startApp } from "./app.ts";
import type { WorkerInfo } from "./types.ts";

const numWorkers = availableParallelism() - 1;
let currentWorker = 0;

if (cluster.isPrimary) {
  const workers: WorkerInfo[] = [];

  const { store } = await import("./store.ts");

  for (let i = 0; i < numWorkers; i++) {
    const workerPort = PORT + i + 1;
    const worker = cluster.fork({
      WORKER_PORT: workerPort,
      WORKER_ID: i + 1,
      IS_WORKER: "true",
    });

    workers.push({ worker, port: workerPort });

    worker.on("message", async (message) => {
      let result;

      try {
        switch (message.type) {
          case "GET_ALL":
            result = store.getAllProducts();
            break;
          case "GET_ONE":
            result = store.getProductById(message.id);
            break;
          case "ADD":
            result = store.addProduct(message.product);
            break;
          case "UPDATE":
            result = store.updateProduct(message.id, message.updates);
            break;
          case "DELETE":
            result = store.deleteProduct(message.id);
            break;
        }
      } catch (error) {
        result = { error };
      }

      worker.send({ messageId: message.messageId, result });
    });

    console.log(`Worker ${i + 1} running on port ${workerPort}`);
  }

  const loadBalancer = http.createServer((req, res) => {
    const target = workers[currentWorker % workers.length];
    currentWorker++;

    const options = {
      hostname: "localhost",
      port: target.port,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxy = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxy.on("error", () => {
      res.writeHead(500);
      res.end("Load balancer error");
    });

    req.pipe(proxy, { end: true });
  });

  loadBalancer.listen(PORT, () => {
    console.log(`Balancer listening on http://localhost:${PORT}`);
    workers.forEach((worker, index) => {
      console.log(`Worker ${index + 1}: http://localhost:${worker.port}`);
    });
  });

  cluster.on("exit", (worker, code) => {
    console.log(`Worker ${worker.process.pid} died (code: ${code})`);

    const index = workers.findIndex((w) => w.worker.id === worker.id);
    if (index !== -1) {
      const newWorker = cluster.fork({
        WORKER_PORT: workers[index].port,
        WORKER_ID: index + 1,
        IS_WORKER: "true",
      });
      workers[index] = { worker: newWorker, port: workers[index].port };
      console.log(`Restarted on port ${workers[index].port}`);
    }
  });
} else {
  const fastify = startApp();
  const workerPort = process.env.WORKER_PORT
    ? parseInt(process.env.WORKER_PORT, 10)
    : PORT + 1;

  fastify.listen({ port: workerPort, host: "0.0.0.0" }, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(
      `Worker ${process.pid} listening on http://localhost:${workerPort}`,
    );
  });
}
