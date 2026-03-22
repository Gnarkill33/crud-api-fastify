import { controller } from "./controller.ts";

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

export const getAllProductsOpts = {
  schema: {
    response: {
      200: {
        type: "array",
        items: Product,
      },
    },
  },
  handler: controller.getAllProducts,
};

export const getProductByIdOpts = {
  schema: {
    response: {
      200: Product,
    },
  },
  handler: controller.getProductById,
};

export const postProductOpts = {
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

export const updateProductOpts = {
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
      200: Product,
    },
  },
  handler: controller.updateProduct,
};

export const deleteProductOpts = {
  schema: {
    response: {
      204: {
        type: "null",
        description: "No content",
      },
    },
  },
  handler: controller.deleteProduct,
};
