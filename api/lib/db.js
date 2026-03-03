import { neon } from '@neondatabase/serverless';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config as loadEnv } from 'dotenv';

if (typeof process !== 'undefined' && !process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    loadEnv({ path: join(__dirname, '..', '..', '.env') });
  } catch (_) {}
}

let sql;
function getSql() {
  if (!sql) {
    const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!DATABASE_URL) {
      console.error('Missing DATABASE_URL or POSTGRES_URL. Add to .env or Vercel env.');
      throw new Error('DATABASE_URL is required');
    }
    sql = neon(DATABASE_URL);
  }
  return sql;
}

export { getSql };
