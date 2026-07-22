import { Pool } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join } from 'path';

const DB_DIR = '/home/team/shared/site/db';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  console.log('🌍 Adding Africa, Caribbean & South America destinations...\n');
  const sql = readFileSync(join(DB_DIR, 'seed-new-destinations.sql'), 'utf-8');
  await pool.query(sql);
  
  const result = await pool.query('SELECT continent, count(*)::int as c FROM destinations GROUP BY continent ORDER BY continent');
  console.log('📊 Destination counts by continent:');
  result.rows.forEach(r => console.log(`  ${r.continent}: ${r.c}`));
  
  const total = await pool.query('SELECT count(*)::int as total FROM destinations');
  console.log(`\n✅ Total destinations: ${total.rows[0].total}`);
  
  await pool.end();
}
run().catch(e => { console.error('✗', e.message); process.exit(1); });