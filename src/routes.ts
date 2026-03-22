import type { FastifyInstance, FastifyPluginCallback } from "fastify";
import {
  deleteProductOpts,
  getAllProductsOpts,
  getProductByIdOpts,
  postProductOpts,
  updateProductOpts,
} from "./schemas.ts";

export const useRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _,
  done,
) => {
  fastify.get("/api/products", getAllProductsOpts);

  fastify.get("/api/products/:productId", getProductByIdOpts);

  fastify.post("/api/products", postProductOpts);

  fastify.put("/api/products/:productId", updateProductOpts);

  fastify.delete("/api/products/:productId", deleteProductOpts);

  done();
};
