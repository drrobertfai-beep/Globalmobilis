import { Pool } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join } from 'path';

const DB_DIR = '/home/team/shared/site/db';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  console.log('⚡ Global Mobilis — Database Init\n');

  // Read and execute schema
  const schema = readFileSync(join(DB_DIR, 'schema.sql'), 'utf-8');
  console.log('→ Applying schema...');
  await pool.query(schema);
  console.log('  ✓ schema done');

  // Read and execute seed
  const seed = readFileSync(join(DB_DIR, 'seed.sql'), 'utf-8');
  console.log('→ Seeding data...');
  await pool.query(seed);
  
  const result = await pool.query('SELECT count(*)::int as c FROM destinations');
  console.log(`  ✓ ${result.rows[0].c} destinations seeded`);
  console.log('\n✓ Database initialized!');
  
  await pool.end();
}
run().catch(e => { console.error('✗', e.message); process.exit(1); });