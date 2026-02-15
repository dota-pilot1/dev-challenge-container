import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env['DB_HOST'] ?? 'localhost',
    port: Number(process.env['DB_PORT'] ?? 5435),
    user: process.env['DB_USER'] ?? 'app_user',
    password: process.env['DB_PASSWORD'] ?? 'app_password',
    database: process.env['DB_NAME'] ?? 'payment_db',
    ssl: false,
  },
});
