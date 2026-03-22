import Fastify from "fastify";
import { useRoutes } from "./routes.ts";

export const startApp = () => {
  const fastify = Fastify({
    logger: true,
  });

  fastify.register(useRoutes);

  fastify.setNotFoundHandler((_, reply) => {
    reply.status(404).send({
      message: "Endpoint not found",
    });
  });

  return fastify;
};
