import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export const DRIZZLE = Symbol('DRIZZLE');

export const drizzleProvider = {
  provide: DRIZZLE,
  useFactory: () => {
    const connectionString = `postgres://${process.env['DB_USER'] ?? 'app_user'}:${process.env['DB_PASSWORD'] ?? 'app_password'}@${process.env['DB_HOST'] ?? 'localhost'}:${process.env['DB_PORT'] ?? '5435'}/${process.env['DB_NAME'] ?? 'payment_db'}`;
    const client = postgres(connectionString);
    return drizzle(client, { schema });
  },
};
