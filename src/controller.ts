import { store } from "./store.ts";
import type { FastifyRequest, FastifyReply } from "fastify";
import { validate as uuidValidate } from "uuid";
import type { ProductRequest } from "./types.ts";

export const controller = {
  getAllProducts: (_: FastifyRequest, reply: FastifyReply) => {
    return reply.send(store.getAllProducts());
  },

  getProductById: (request: ProductRequest, reply: FastifyReply) => {
    const { productId } = request.params;

    if (!uuidValidate(productId)) {
      return reply.status(400).send({ message: "id is invalid" });
    }

    const product = store.getProductById(productId);

    if (!product) {
      return reply.status(404).send({ message: "Product not found" });
    }

    return reply.send(product);
  },

  addProduct: (request: ProductRequest, reply: FastifyReply) => {
    const newProduct = request.body;

    const productWithId = store.addProduct(newProduct);

    return reply.status(201).send(productWithId);
  },

  updateProduct: (request: ProductRequest, reply: FastifyReply) => {
    const updatedProductInfo = request.body;
    const { productId } = request.params;

    if (!uuidValidate(productId)) {
      return reply.status(400).send({ message: "id is invalid" });
    }

    const updatedProduct = store.updateProduct(productId, updatedProductInfo);

    if (!updatedProduct) {
      return reply.status(404).send({ message: "Product not found" });
    }

    return reply.send(updatedProduct);
  },

  deleteProduct: (request: ProductRequest, reply: FastifyReply) => {
    const { productId } = request.params;

    if (!uuidValidate(productId)) {
      return reply.status(400).send({ message: "id is invalid" });
    }

    const isDeleted = store.deleteProduct(productId);

    if (!isDeleted) {
      return reply.status(404).send({ message: "Product not found" });
    }

    return reply.status(204).send();
  },
};
