#!/usr/bin/env bun
/**
 * grant-premium.ts — Team admin tool: activate Premium for a confirmed paying
 * customer.
 *
 * -----------------------------------------------------------------------------
 * USAGE
 * -----------------------------------------------------------------------------
 *   bun run scripts/grant-premium.ts <email>
 *
 *   e.g.  bun run scripts/grant-premium.ts anna@example.com
 *
 * DATABASE_URL is read from the environment (.env is auto-loaded by bun when
 * running from the repo root). If DATABASE_URL is set, the Neon `users` table
 * is updated; otherwise the local `.run/users.json` fallback store is used.
 *
 * -----------------------------------------------------------------------------
 * WHEN TO RUN IT  (TEAM ONLY)
 * -----------------------------------------------------------------------------
 *   Run this ONLY AFTER the payment/subscription has been confirmed in the
 *   Stripe dashboard. The self-serve "Activate Premium" button was removed from
 *   /premium — Premium is never granted automatically at checkout. To match a
 *   completed Checkout session back to a user, look at the session's
 *   `client_reference_id` (stamped with the app userId by /premium) or the
 *   customer email, then activate that account with this script.
 *
 * -----------------------------------------------------------------------------
 * EXIT CODES
 * -----------------------------------------------------------------------------
 *   0  upgraded (or already premium)
 *   2  usage error — missing email argument
 *   3  user not found in store
 *   4  database error
 */
import { normalizeDbUrl } from "../src/lib/db-url";

interface StoredUser {
  id: string;
  name?: string;
  email: string;
  userId?: string;
  subscriptionTier?: string;
  [key: string]: unknown;
}

const email = (process.argv[2] ?? "").trim().toLowerCase();
if (!email) {
  console.error("Usage: bun run scripts/grant-premium.ts <email>");
  process.exit(2);
}

async function grantPremiumToUser(id: string, label: string): Promise<void> {
  if (process.env.DATABASE_URL) {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(normalizeDbUrl(process.env.DATABASE_URL));
    await sql`UPDATE users SET subscription_tier = 'premium' WHERE id = ${id}`;
  } else {
    const { readFileSync, writeFileSync, existsSync } = await import("node:fs");
    const { join } = await import("node:path");
    const file = join(process.cwd(), ".run", "users.json");
    if (!existsSync(file)) {
      console.error(
        `No user store found (no DATABASE_URL and no ${file}). Run with the site's .env loaded.`,
      );
      process.exit(4);
    }
    const users = JSON.parse(readFileSync(file, "utf-8")) as StoredUser[];
    const idx = users.findIndex((u) => (u.email ?? "").toLowerCase() === email);
    if (idx === -1) {
      console.error(`No user found with email ${email}`);
      process.exit(3);
    }
    users[idx].subscriptionTier = "premium";
    writeFileSync(file, JSON.stringify(users, null, 2));
  }
  console.log(`✅ ${label} upgraded to premium`);
}

async function main(): Promise<void> {
  if (process.env.DATABASE_URL) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(normalizeDbUrl(process.env.DATABASE_URL));
      const rows = (await sql`
        SELECT id, name, subscription_tier FROM users WHERE lower(email) = ${email} LIMIT 1
      `) as Array<{ id: string; name?: string | null; subscription_tier?: string | null }>;
      if (rows.length === 0) {
        console.error(`No user found with email ${email}`);
        process.exit(3);
      }
      const u = rows[0];
      const label = u.name || email;
      if (u.subscription_tier === "premium") {
        console.log(`ℹ️  ${label} is already premium — no change`);
        process.exit(0);
      }
      await grantPremiumToUser(u.id, label);
      process.exit(0);
    } catch (err) {
      console.error("Database error while activating premium:", err);
      process.exit(4);
    }
  }
  // Fallback JSON store (no DATABASE_URL) — handled inside grantPremiumToUser.
  await grantPremiumToUser("", email);
  process.exit(0);
}

main();