import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE } from '../database/drizzle.provider';
import * as schema from '../database/schema';
import { orders, products } from '../database/schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async create(dto: CreateOrderDto) {
    const quantity = dto.quantity ?? 1;

    // 상품 존재 + 재고 확인
    const [product] = await this.db
      .select()
      .from(products)
      .where(eq(products.id, dto.productId))
      .limit(1);

    if (!product) {
      throw new NotFoundException(
        `상품 ID ${dto.productId}를 찾을 수 없습니다`,
      );
    }

    if (product.stock < quantity) {
      throw new BadRequestException(
        `재고가 부족합니다 (현재: ${product.stock})`,
      );
    }

    // 재고 차감 (동시성 제어 없음 - 2단계에서 해결)
    await this.db
      .update(products)
      .set({ stock: product.stock - quantity, updatedAt: new Date() })
      .where(eq(products.id, dto.productId));

    // 주문 생성
    const [order] = await this.db
      .insert(orders)
      .values({
        productId: dto.productId,
        userId: dto.userId,
        quantity,
        status: 'PAID',
      })
      .returning();

    return order;
  }

  async findAll() {
    return this.db.select().from(orders);
  }

  async findById(id: number) {
    const [order] = await this.db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (!order) {
      throw new NotFoundException(`주문 ID ${id}를 찾을 수 없습니다`);
    }
    return order;
  }

  async findByUserId(userId: number) {
    return this.db.select().from(orders).where(eq(orders.userId, userId));
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto) {
    const order = await this.findById(id);

    if (order.status === 'CANCELLED') {
      throw new BadRequestException('취소된 주문은 상태를 변경할 수 없습니다');
    }

    // 취소 시 재고 복구
    if (dto.status === 'CANCELLED') {
      const [product] = await this.db
        .select()
        .from(products)
        .where(eq(products.id, order.productId))
        .limit(1);

      if (product) {
        await this.db
          .update(products)
          .set({ stock: product.stock + order.quantity, updatedAt: new Date() })
          .where(eq(products.id, order.productId));
      }
    }

    const [updated] = await this.db
      .update(orders)
      .set({ status: dto.status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();

    return updated;
  }
}
