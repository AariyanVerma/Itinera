try {
  await import('dotenv/config');
} catch {}
const { default: pg } = await import('pg');
const fs = await import('fs');
const path = await import('path');

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!DATABASE_URL) {
  console.error('Set DATABASE_URL or POSTGRES_URL in .env or environment.');
  process.exit(1);
}

const schemaPath = path.join(process.cwd(), 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

const statements = schema
  .replace(/--[^\n]*/g, '')
  .split(/;\s*[\r\n]+/)
  .map((s) => s.trim())
  .filter((s) => s.length > 0 && /^(CREATE\s+TABLE|CREATE\s+INDEX)/i.test(s));

const client = new pg.Client({ connectionString: DATABASE_URL });
await client.connect();
console.log('Creating tables and indexes...');
for (const statement of statements) {
  try {
    await client.query(statement + ';');
    const name = statement.match(/CREATE TABLE[^(\s]+\s*(?:IF NOT EXISTS\s+)?(\w+)/i)?.[1]
      || statement.match(/CREATE INDEX[^O]+ON\s+(\w+)/i)?.[1];
    console.log('  OK:', name || '');
  } catch (e) {
    if (e.code === '42P07') console.log('  (already exists)');
    else throw e;
  }
}
await client.end();
console.log('Schema done. Run: node scripts/seed.js');
