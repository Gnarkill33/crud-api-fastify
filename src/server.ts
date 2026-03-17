import Fastify from "fastify";
import { PORT } from "./constants.ts";
import { useRoutes } from "./routes.ts";

const fastify = Fastify({
  logger: true,
});

fastify.register(useRoutes);

try {
  await fastify.listen({ port: PORT });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
