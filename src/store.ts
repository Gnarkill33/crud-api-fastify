import { type ProductType } from "./types.ts";
import { randomUUID } from "node:crypto";

export class Store {
  private products: ProductType[] = [
    {
      id: "1",
      name: "string",
      description: "string",
      price: 24,
      category: "string",
      inStock: true,
    },
  ];

  getAllProducts() {
    return [...this.products];
  }

  getProductById(id: string) {
    const product = this.products.find((product) => product.id === id);
    if (!product) return null;
    return { ...product };
  }

  addProduct(newProduct: Omit<ProductType, "id">) {
    const newProductWithId = { ...newProduct, id: randomUUID() };
    this.products.push(newProductWithId);
    return newProductWithId;
  }

  updateProduct(id: string, updatedProductInfo: Omit<ProductType, "id">) {
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
}

export const store = new Store();
