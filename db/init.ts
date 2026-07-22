#!/usr/bin/env bun
/**
 * Global Mobilis — Database Initialization Script
 * Run: bun run db/init.ts
 * Requires DATABASE_URL environment variable to be set.
 *
 * This script reads the SQL schema and seed files and executes them
 * against the Neon database using the @neondatabase/serverless client.
 */
import { neon } from "@neondatabase/serverless";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set.");
  console.error("Connect a Neon database via the database card above, then re-run.");
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const DB_DIR = join(import.meta.dirname);

async function runSQLFile(filename: string, label: string) {
  const filePath = join(DB_DIR, filename);
  console.log(`→ ${label} (${filename})...`);
  const content = await readFile(filePath, "utf-8");

  // Split by semicolons and execute each statement
  const statements = content
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  for (const stmt of statements) {
    try {
      await sql.query(stmt);
    } catch (err: any) {
      // Ignore "already exists" errors for extensions and indexes
      if (
        err.message?.includes("already exists") ||
        err.message?.includes("duplicate key")
      ) {
        console.warn(`  ⚠ ${err.message}`);
      } else {
        throw err;
      }
    }
  }
  console.log(`  ✓ ${label} applied`);
}

async function main() {
  console.log("⚡ Global Mobilis — Database Initialization\n");

  await runSQLFile("schema.sql", "Schema");
  await runSQLFile("seed.sql", "Seed data");

  // Verify
  const result = await sql`SELECT count(*) as count FROM destinations`;
  const destCount = result[0]?.count ?? 0;
  console.log(`\n✓ Database initialized successfully!`);
  console.log(`   Destinations seeded: ${destCount} cities`);
  console.log(`   Tables: users, waitlist, destinations, communities,`);
  console.log(`   community_members, messages, events, event_attendees,`);
  console.log(`   destination_reviews, mentorship_connections`);
}

main().catch((err) => {
  console.error("\n✗ Database initialization failed:", err.message);
  process.exit(1);
});