import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE } from '../database/drizzle.provider';
import * as schema from '../database/schema';
import { platformBrands } from '../database/schema';
import { RegisterBrandDto } from './dto/register-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async findAll() {
    return this.db.select().from(platformBrands);
  }

  async register(dto: RegisterBrandDto) {
    // upsert: brandCode 기준
    const existing = await this.db
      .select()
      .from(platformBrands)
      .where(eq(platformBrands.brandCode, dto.brandCode))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await this.db
        .update(platformBrands)
        .set({
          shopId: dto.shopId,
          brandMid: dto.brandMid,
          brandNameKo: dto.brandNameKo,
          brandNameEn: dto.brandNameEn,
          brandDesc: dto.brandDesc,
          useYn: dto.useYn ?? 'Y',
          updatedAt: new Date(),
        })
        .where(eq(platformBrands.brandCode, dto.brandCode))
        .returning();
      return updated;
    }

    const [created] = await this.db
      .insert(platformBrands)
      .values({
        brandCode: dto.brandCode,
        shopId: dto.shopId,
        brandMid: dto.brandMid,
        brandNameKo: dto.brandNameKo,
        brandNameEn: dto.brandNameEn,
        brandDesc: dto.brandDesc,
        useYn: dto.useYn ?? 'Y',
      })
      .returning();
    return created;
  }

  async registerBatch(brands: RegisterBrandDto[]) {
    const results = [];
    for (const dto of brands) {
      results.push(await this.register(dto));
    }
    return results;
  }

  async deleteAll() {
    const deleted = await this.db.delete(platformBrands).returning();
    return { deletedCount: deleted.length };
  }

  async deleteByBrandCode(brandCode: string) {
    const deleted = await this.db
      .delete(platformBrands)
      .where(eq(platformBrands.brandCode, brandCode))
      .returning();
    if (deleted.length === 0) {
      throw new NotFoundException(`브랜드코드 ${brandCode}를 찾을 수 없습니다`);
    }
    return deleted[0];
  }
}
