import { neon } from "@neondatabase/serverless";
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}
const sql = neon(url);
async function main() {
  await sql`CREATE TABLE IF NOT EXISTS password_reset_tokens (
    token TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
  )`;
  await sql`CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens (email)`;
  const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`;
  console.log("tables:", tables.map((r) => r.tablename).join(", "));
}
main().catch((e) => {
  console.error("ERR", e.message);
  process.exit(1);
});
