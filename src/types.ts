import type { FastifyRequest } from "fastify";

export interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

export type ProductTypeNoId = Omit<ProductType, "id">;

export type ProductRequest = FastifyRequest<{
  Body: ProductTypeNoId;
  Params: { productId: string };
}>;
