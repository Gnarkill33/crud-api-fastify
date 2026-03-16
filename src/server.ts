import Fastify from "fastify";
import { PORT } from "./constants.ts";
import { Store } from "./store.ts";

const store = new Store();

const fastify = Fastify({
  logger: true,
});

fastify.get("/api/products", async function handler(request, reply) {
  return store.getAllProducts();
});

try {
  await fastify.listen({ port: PORT });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
