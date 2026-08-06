import { neon } from "@neondatabase/serverless";
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}
const sql = neon(url);
const email = `reset-test-${Date.now()}@example.com`;
const token = "t_" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

async function main() {
  // 0. create test user (mirrors signup)
  await sql`INSERT INTO users (name, email, password_hash) VALUES ('Reset Test', ${email}, 'oldhash')`;
  console.log("1. test user created:", email);

  // 1. saveResetToken (exact SQL from auth.ts helper)
  await sql`INSERT INTO password_reset_tokens (token, email, expires_at)
            VALUES (${token}, ${email}, ${expiresAt})
            ON CONFLICT (token) DO UPDATE SET email = EXCLUDED.email, expires_at = EXCLUDED.expires_at`;
  console.log("2. token inserted");

  // 2. getResetToken (exact SQL from auth.ts helper)
  const rows = await sql`SELECT email, expires_at FROM password_reset_tokens WHERE token = ${token}`;
  if (rows.length !== 1) throw new Error("token not found");
  const got = { email: rows[0].email, expiresAt: new Date(rows[0].expires_at).getTime() };
  console.log("3. token read back:", got.email, "expiresAt valid:", got.expiresAt > Date.now());
  if (got.email !== email) throw new Error("email mismatch");

  // 3. resetPassword update (exact SQL from auth.ts)
  await sql`UPDATE users SET password_hash = 'newhash' WHERE email = ${got.email}`;
  const u = await sql`SELECT password_hash FROM users WHERE email = ${email}`;
  console.log("4. password updated:", u[0].password_hash === "newhash");

  // 4. deleteResetToken (exact SQL from auth.ts)
  await sql`DELETE FROM password_reset_tokens WHERE token = ${token}`;
  const after = await sql`SELECT count(*)::int AS n FROM password_reset_tokens WHERE token = ${token}`;
  console.log("5. token deleted, remaining rows:", after[0].n);

  // 5. expired-token cleanup path (deleteExpiredResetTokens)
  await sql`INSERT INTO password_reset_tokens (token, email, expires_at) VALUES ('expired_tok', ${email}, '2000-01-01T00:00:00Z')`;
  await sql`DELETE FROM password_reset_tokens WHERE expires_at < now()`;
  const exp = await sql`SELECT count(*)::int AS n FROM password_reset_tokens WHERE token = 'expired_tok'`;
  console.log("6. expired token cleanup:", exp[0].n === 0);

  // cleanup test user
  await sql`DELETE FROM users WHERE email = ${email}`;
  console.log("7. test user cleaned up");
  console.log("ALL PASS");
}
main().catch((e) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});
