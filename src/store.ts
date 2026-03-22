import { randomUUID } from "node:crypto";
import {
  type PendingRequest,
  type ProductType,
  type ProductTypeNoId,
  type WorkerMessage,
} from "./types.ts";
import cluster from "node:cluster";

class Store {
  products: ProductType[];

  constructor() {
    this.products = [];
  }

  getAllProducts() {
    return [...this.products];
  }

  getProductById(id: string) {
    const product = this.products.find((product) => product.id === id);
    if (!product) return null;
    return { ...product };
  }

  addProduct(newProduct: ProductTypeNoId) {
    const newProductWithId = { ...newProduct, id: randomUUID() };
    this.products.push(newProductWithId);
    return newProductWithId;
  }

  updateProduct(id: string, updatedProductInfo: ProductTypeNoId) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );

    if (productIndex === -1) return null;

    const updatedProduct = {
      id,
      ...updatedProductInfo,
    };

    this.products[productIndex] = updatedProduct;
    return { ...updatedProduct };
  }

  deleteProduct(id: string) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );

    if (productIndex === -1) return null;

    this.products.splice(productIndex, 1);
    return true;
  }
}

class WorkerStoreProxy {
  pendingRequests: Map<string | number, PendingRequest>;
  constructor() {
    this.pendingRequests = new Map();
    this.setupMessageHandler();
  }

  setupMessageHandler(): void {
    process.on("message", (message: WorkerMessage) => {
      const pending = this.pendingRequests.get(message.messageId);
      if (pending) {
        clearTimeout(pending.timeout);
        this.pendingRequests.delete(message.messageId);
        if (message.result !== undefined) {
          pending.resolve(message.result);
        } else {
          pending.reject(new Error("No result"));
        }
      }
    });
  }

  sendToPrimary(type: string, data: Record<string, unknown> = {}) {
    return new Promise((resolve, reject) => {
      const messageId = Date.now() + Math.random();

      const timeout = setTimeout(() => {
        this.pendingRequests.delete(messageId);
        reject(new Error("Request timeout"));
      }, 5000);

      this.pendingRequests.set(messageId, { resolve, reject, timeout });
      if (process.send) {
        process.send({ type, ...data, messageId });
      } else {
        reject(new Error("Not available"));
      }
    });
  }

  async getAllProducts() {
    return await this.sendToPrimary("GET_ALL");
  }

  async getProductById(id: string) {
    return await this.sendToPrimary("GET_ONE", { id });
  }

  async addProduct(product: ProductTypeNoId) {
    return await this.sendToPrimary("ADD", { product });
  }

  async updateProduct(id: string, updatedProductInfo: ProductTypeNoId) {
    return await this.sendToPrimary("UPDATE", { id, updatedProductInfo });
  }

  async deleteProduct(id: string) {
    return await this.sendToPrimary("DELETE", { id });
  }
}

export const store =
  cluster.isPrimary || !process.env.IS_WORKER
    ? new Store()
    : new WorkerStoreProxy();
