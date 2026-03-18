export interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

export type ProductTypeNoId = Omit<ProductType, "id">;
