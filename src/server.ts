import Fastify from "fastify";
import { PORT } from "./constants.ts";
import { useRoutes } from "./routes.ts";

const fastify = Fastify({
  logger: true,
});

fastify.register(useRoutes);

fastify.setNotFoundHandler((_, reply) => {
  reply.status(404).send({
    message: "Endpoint not found",
  });
});

fastify.setErrorHandler(function (_, __, reply) {
  reply.status(500).send({ message: "Internal server error" });
});

try {
  await fastify.listen({ port: PORT });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
