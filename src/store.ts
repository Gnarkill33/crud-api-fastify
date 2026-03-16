import { type Product } from "./types.ts";

export class Store {
  private products: Product[] = [];

  getAllProducts() {
    return [...this.products];
  }
}
