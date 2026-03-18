import { controller } from "./controller.ts";
import type { FastifyInstance, FastifyPluginCallback } from "fastify";

const Product = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    price: { type: "number" },
    category: { type: "string" },
    inStock: { type: "boolean" },
  },
};

const getAllProductsOpts = {
  schema: {
    response: {
      200: {
        type: "array",
        products: Product,
      },
    },
  },
  handler: controller.getAllProducts,
};

const getProductByIdOpts = {
  schema: {
    response: {
      200: Product,
    },
  },
  handler: controller.getProductById,
};

const postProductOpts = {
  schema: {
    body: {
      type: "object",
      required: ["name", "description", "price", "category", "inStock"],
      properties: {
        price: {
          type: "number",
          minimum: 0,
        },
      },
    },
    response: {
      201: Product,
    },
  },
  handler: controller.addProduct,
};

export const useRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _,
  done,
) => {
  fastify.get("/api/products", getAllProductsOpts);

  fastify.get("/api/products/:productId", getProductByIdOpts);

  fastify.post("/api/products", postProductOpts);

  done();
};
