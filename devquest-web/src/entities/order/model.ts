export interface Order {
  id: number;
  productId: number;
  userId: number;
  nickname: string | null;
  quantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
