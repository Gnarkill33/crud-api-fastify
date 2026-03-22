import type { FastifyRequest } from "fastify";
import { Worker } from "node:cluster";

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

export interface PendingRequest {
  resolve: (value: ProductType | ProductType[] | boolean | null) => void;
  reject: (reason?: Error) => void;
  timeout: NodeJS.Timeout;
}
export interface WorkerMessage {
  type: string;
  messageId: number;
  id?: string;
  product?: ProductTypeNoId;
  updates?: Partial<ProductTypeNoId>;
  result?: ProductType | ProductType[] | boolean | null;
}

export interface WorkerInfo {
  worker: Worker;
  port: number;
}
