export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
