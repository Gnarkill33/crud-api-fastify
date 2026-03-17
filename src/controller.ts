import { store } from "./store.ts";
import type { FastifyRequest, FastifyReply } from "fastify";
import { validate as uuidValidate } from "uuid";
import type { ProductType } from "./types.ts";

export const controller = {
  getAllProducts: (_: FastifyRequest, reply: FastifyReply) => {
    reply.send(store.getAllProducts());
  },

  getProductById: (request: FastifyRequest, reply: FastifyReply) => {
    const { productId } = request.params as { productId: string };

    if (!uuidValidate(productId)) {
      return reply.status(400).send({ message: "id is invalid" });
    }
    const product = store.getProductById(productId);

    if (!product) {
      reply.status(404).send({ message: "Product not found" });
    }

    return reply.send(product);
  },

  addProduct: (request: FastifyRequest, reply: FastifyReply) => {
    const newProduct = request.body as Omit<ProductType, "id">;

    const productWitId = store.addProduct(newProduct);

    return reply.send(productWitId);
  },
};
