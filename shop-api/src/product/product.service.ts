import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE } from '../database/drizzle.provider';
import * as schema from '../database/schema';
import { products } from '../database/schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async create(dto: CreateProductDto) {
    const [product] = await this.db
      .insert(products)
      .values({
        name: dto.name,
        description: dto.description,
        price: String(dto.price),
        stock: dto.stock,
        imageUrl: dto.imageUrl,
      })
      .returning();
    return product;
  }

  async findAll() {
    return this.db.select().from(products);
  }

  async updateStock(id: number, dto: UpdateStockDto) {
    await this.findById(id);
    const [updated] = await this.db
      .update(products)
      .set({ stock: dto.stock, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async findById(id: number) {
    const [product] = await this.db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!product) {
      throw new NotFoundException(`상품 ID ${id}를 찾을 수 없습니다`);
    }
    return product;
  }
}
