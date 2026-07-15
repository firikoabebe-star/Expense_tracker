import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: ['./utils/schema.ts', './auth-schema.ts'],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
