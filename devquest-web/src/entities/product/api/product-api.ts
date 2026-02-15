import { paymentApi } from "@/shared/api/client";
import type { Product } from "../model";

export const productsApi = {
  findAll: () => paymentApi.get<Product[]>("/products"),
  findById: (id: number) => paymentApi.get<Product>(`/products/${id}`),
  updateStock: (id: number, stock: number) =>
    paymentApi.patch<Product>(`/products/${id}/stock`, { stock }),
};
