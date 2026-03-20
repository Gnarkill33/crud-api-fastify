import { test, expect } from "vitest";
import { fastify } from "./server";

test("GET api/products request should return all products", async () => {
  const response = await fastify.inject({
    method: "GET",
    url: "/api/products",
  });

  const data = JSON.parse(response.payload);
  expect(data).toEqual([]);
});

test("POST /api/products should create a new product", async () => {
  const newProduct = {
    name: "New Product",
    description: "New Product Description",
    price: 24,
    category: "clothing",
    inStock: true,
  };

  const response = await fastify.inject({
    method: "POST",
    url: "/api/products",
    body: newProduct,
  });

  const data = JSON.parse(response.payload);

  expect(data).toMatchObject({
    name: newProduct.name,
    description: newProduct.description,
    price: newProduct.price,
    category: newProduct.category,
    inStock: newProduct.inStock,
  });
});

test("GET /api/products/:productId should return the product with the specified id", async () => {
  const newProduct = {
    name: "New Product",
    description: "New Product Description",
    price: 24,
    category: "clothing",
    inStock: true,
  };

  const postResponse = await fastify.inject({
    method: "POST",
    url: "/api/products",
    body: newProduct,
  });

  const createdProduct = JSON.parse(postResponse.payload);
  const createdProductId = createdProduct.id;

  const getResponse = await fastify.inject({
    method: "GET",
    url: `/api/products/${createdProductId}`,
  });

  const data = JSON.parse(getResponse.payload);

  expect(data).toMatchObject({
    id: createdProductId,
    name: newProduct.name,
    description: newProduct.description,
    price: newProduct.price,
    category: newProduct.category,
    inStock: newProduct.inStock,
  });
});

test("PUT /api/products/:productId should return an updated product with the specified id", async () => {
  const newProduct = {
    name: "New Product",
    description: "New Product Description",
    price: 24,
    category: "clothing",
    inStock: true,
  };

  const postResponse = await fastify.inject({
    method: "POST",
    url: "/api/products",
    body: newProduct,
  });

  const createdProduct = JSON.parse(postResponse.payload);
  const createdProductId = createdProduct.id;

  const updatedProduct = {
    name: "Updated Product",
    description: "Updated Product Description",
    price: 55,
    category: "music",
    inStock: false,
  };

  const putResponse = await fastify.inject({
    method: "PUT",
    url: `/api/products/${createdProductId}`,
    body: updatedProduct,
  });

  const data = JSON.parse(putResponse.payload);

  expect(data).toMatchObject({
    id: createdProductId,
    name: updatedProduct.name,
    description: updatedProduct.description,
    price: updatedProduct.price,
    category: updatedProduct.category,
    inStock: updatedProduct.inStock,
  });
});

test("DELETE /api/products/:productId should delete the product with the specified id", async () => {
  const newProduct = {
    name: "New Product",
    description: "New Product Description",
    price: 24,
    category: "clothing",
    inStock: true,
  };

  const postResponse = await fastify.inject({
    method: "POST",
    url: "/api/products",
    body: newProduct,
  });

  const createdProduct = JSON.parse(postResponse.payload);
  const createdProductId = createdProduct.id;

  const deleteResponse = await fastify.inject({
    method: "DELETE",
    url: `/api/products/${createdProductId}`,
  });

  expect(deleteResponse.statusCode).toBe(204);
  expect(deleteResponse.payload).toBe("");
});

test("GET /api/products/:productId should return 404 when getting the product already deleted", async () => {
  const newProduct = {
    name: "New Product",
    description: "New Product Description",
    price: 24,
    category: "clothing",
    inStock: true,
  };

  const postResponse = await fastify.inject({
    method: "POST",
    url: "/api/products",
    body: newProduct,
  });

  const createdProduct = JSON.parse(postResponse.payload);
  const createdProductId = createdProduct.id;

  await fastify.inject({
    method: "DELETE",
    url: `/api/products/${createdProductId}`,
  });

  const getResponse = await fastify.inject({
    method: "GET",
    url: `/api/products/${createdProductId}`,
  });

  expect(getResponse.statusCode).toBe(404);
});
