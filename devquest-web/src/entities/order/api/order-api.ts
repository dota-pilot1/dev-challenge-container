import { paymentApi } from '@/shared/api/client'
import type { Order } from '../model'

export const ordersApi = {
  findAll: () => paymentApi.get<Order[]>('/orders'),
  findByUserId: (userId: number) => paymentApi.get<Order[]>(`/orders/user/${userId}`),
  findById: (id: number) => paymentApi.get<Order>(`/orders/${id}`),
}
