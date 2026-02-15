import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { products } from './schema';

async function seed() {
  const connectionString = `postgres://${process.env['DB_USER'] ?? 'app_user'}:${process.env['DB_PASSWORD'] ?? 'app_password'}@${process.env['DB_HOST'] ?? 'localhost'}:${process.env['DB_PORT'] ?? '5435'}/${process.env['DB_NAME'] ?? 'payment_db'}`;
  const client = postgres(connectionString);
  const db = drizzle(client);

  const seedProducts = [
    { name: '스타벅스 아메리카노', description: '따뜻한 아메리카노 톨 사이즈', price: '4500', stock: 100 },
    { name: '배달의민족 1만원권', description: '배달의민족 모바일 상품권', price: '10000', stock: 50 },
    { name: '키보드 키캡세트', description: 'PBT 더블샷 키캡 풀세트', price: '25000', stock: 30 },
    { name: '모니터 거치대', description: '듀얼 모니터 거치대', price: '35000', stock: 20 },
    { name: '유데미 강의 쿠폰', description: '유데미 아무 강의 1개 무료', price: '15000', stock: 80 },
  ];

  console.log('Seeding products...');
  await db.insert(products).values(seedProducts).onConflictDoNothing();
  console.log('Done! Inserted', seedProducts.length, 'products');

  await client.end();
}

seed().catch(console.error);
