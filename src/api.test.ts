import { test, expect } from "vitest";
import { fastify } from "./server";

// SCENARIO 1 - Normal behaviour - status codes 200, 201, 204 (validation, not found paths are not tested here)
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

// SCENARIO 2 - Validation errors - status code 400 is mainly tested here
test("GET /api/products/:productId should return 400 for invalid UUID", async () => {
  const response = await fastify.inject({
    method: "GET",
    url: "/api/products/invalid-id",
  });

  const data = JSON.parse(response.payload);

  expect(response.statusCode).toBe(400);
  expect(data.message).toBe("id is invalid");
});

test("POST /api/products should return 400 for product with empty body", async () => {
  const response = await fastify.inject({
    method: "POST",
    url: "/api/products",
    body: {},
  });

  const data = JSON.parse(response.payload);

  expect(response.statusCode).toBe(400);
  expect(data.message).toMatch(/required|name|price/);
});

test("POST /api/products should return 400 when required fields are missing", async () => {
  const productWithMissingFields = {
    name: "Only Name Indicated",
  };

  const response = await fastify.inject({
    method: "POST",
    url: "/api/products",
    body: productWithMissingFields,
  });

  const data = JSON.parse(response.payload);

  expect(response.statusCode).toBe(400);
  expect(data.message).toMatch(/price|required/);
});

test("POST /api/products should return 400 when price is not a number", async () => {
  const productWithStringifiedPrice = {
    name: "New Product",
    price: "not a number",
    description: "New Product Description",
    category: "clothing",
    inStock: true,
  };

  const response = await fastify.inject({
    method: "POST",
    url: "/api/products",
    body: productWithStringifiedPrice,
  });

  const data = JSON.parse(response.payload);

  expect(response.statusCode).toBe(400);
  expect(data.message).toMatch(/price|number/);
});

test("PUT /api/products/:productId should return 400 for product with invalid UUID", async () => {
  const updatedProduct = {
    name: "Updated Product",
    description: "Updated Product Description",
    price: 55,
    category: "music",
    inStock: false,
  };

  const response = await fastify.inject({
    method: "PUT",
    url: "/api/products/invalid-id",
    body: updatedProduct,
  });

  const data = JSON.parse(response.payload);

  expect(response.statusCode).toBe(400);
  expect(data.message).toBe("id is invalid");
});

test("PUT /api/products/:productId should return 400 when updating with negative price", async () => {
  const productWithPositivePrice = {
    name: "New Product",
    price: 100,
    description: "New Product Description",
    category: "clothing",
    inStock: true,
  };

  const postResponse = await fastify.inject({
    method: "POST",
    url: "/api/products",
    body: productWithPositivePrice,
  });

  const createdProduct = JSON.parse(postResponse.payload);
  const createdProductId = createdProduct.id;

  const productWithNegativePrice = {
    name: "New Product",
    price: -50,
    description: "New Product Description",
    category: "clothing",
    inStock: true,
  };

  const response = await fastify.inject({
    method: "PUT",
    url: `/api/products/${createdProductId}`,
    body: productWithNegativePrice,
  });

  const data = JSON.parse(response.payload);

  expect(response.statusCode).toBe(400);
  expect(data.message).toMatch(/price|positive/);
});

test("DELETE /api/products/:productId should return 400 for product with invalid UUID", async () => {
  const response = await fastify.inject({
    method: "DELETE",
    url: "/api/products/invalid-id",
  });

  const data = JSON.parse(response.payload);

  expect(response.statusCode).toBe(400);
  expect(data.message).toBe("id is invalid");
});

// SCENARIO 3 - Not found errors - status code 404 is mainly tested here
test("GET /api/products/:productId should return 404 when getting non-existent product with valid UUID", async () => {
  const validUUID = "123e4567-e89b-12d3-a456-426614174000";

  const response = await fastify.inject({
    method: "GET",
    url: `/api/products/${validUUID}`,
  });

  const data = JSON.parse(response.payload);

  expect(response.statusCode).toBe(404);
  expect(data.message).toBe("Product not found");
});

test("PUT /api/products/:productId should return 404 when updating non-existent product with valid UUID", async () => {
  const validUUID = "123e4567-e89b-12d3-a456-426614174000";

  const updatedProduct = {
    name: "Updated Product",
    description: "Updated Product Description",
    price: 55,
    category: "music",
    inStock: false,
  };

  const response = await fastify.inject({
    method: "PUT",
    url: `/api/products/${validUUID}`,
    body: updatedProduct,
  });

  const data = JSON.parse(response.payload);

  expect(response.statusCode).toBe(404);
  expect(data.message).toBe("Product not found");
});

test("DELETE /api/products/:productId should return 404 when deleting non-existent product with valid UUID", async () => {
  const validUUID = "123e4567-e89b-12d3-a456-426614174000";

  const response = await fastify.inject({
    method: "DELETE",
    url: `/api/products/${validUUID}`,
  });

  const data = JSON.parse(response.payload);

  expect(response.statusCode).toBe(404);
  expect(data.message).toBe("Product not found");
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
