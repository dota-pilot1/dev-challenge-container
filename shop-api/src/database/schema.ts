import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  timestamp,
  pgEnum,
  text,
} from 'drizzle-orm/pg-core';

// ===== Product =====
export const products = pgTable('product', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  stock: integer('stock').default(0).notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

// ===== Order =====
export const orderStatusEnum = pgEnum('order_status', [
  'PENDING',
  'PAID',
  'PREPARING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]);

export const orders = pgTable('shop_order', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull(),
  userId: integer('user_id').notNull(),
  nickname: varchar('nickname', { length: 100 }),
  quantity: integer('quantity').default(1).notNull(),
  idempotencyKey: varchar('idempotency_key', { length: 255 }),
  status: orderStatusEnum('status').default('PENDING').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

// ===== Platform Brand (외부 플랫폼 브랜드) =====
export const platformBrands = pgTable('platform_brand', {
  id: serial('id').primaryKey(),
  brandCode: varchar('brand_code', { length: 50 }).notNull().unique(),
  shopId: varchar('shop_id', { length: 50 }),
  brandMid: varchar('brand_mid', { length: 50 }),
  brandNameKo: varchar('brand_name_ko', { length: 200 }).notNull(),
  brandNameEn: varchar('brand_name_en', { length: 200 }),
  brandDesc: varchar('brand_desc', { length: 500 }),
  useYn: varchar('use_yn', { length: 1 }).default('Y').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type PlatformBrand = typeof platformBrands.$inferSelect;
export type NewPlatformBrand = typeof platformBrands.$inferInsert;
