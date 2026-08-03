import { createServerFn } from "@tanstack/react-start";
import { addToWaitlist, getWaitlistCount as dbGetWaitlistCount } from "~/db";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const WAITLIST_FILE = join(process.cwd(), ".run", "waitlist.json");

interface WaitlistEntry {
  email: string;
  name: string;
  signedUpAt: string;
}

/**
 * Server function to submit an email to the waitlist.
 * Uses Neon database when DATABASE_URL is available, falls back to file storage.
 */
/** Coerce a FormData value to string (or undefined). */
function str(v: FormDataEntryValue | null): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}
/**
 * Extract string fields from a server-fn payload, tolerant of every shape the
 * framework can deliver: a raw FormData, `{ data: FormData, context, method }`,
 * `{ data: { ...fields } }`, or a bare `{ ...fields }` object. (POST args are
 * sent as FormData because this server build can't parse the seroval JSON
 * envelope the client's createServerFn serialization produces.)
 */
function getStrField(data: unknown, key: string): string | undefined {
  if (data instanceof FormData) return str(data.get(key));
  const obj = (data ?? {}) as Record<string, unknown>;
  const inner = obj.data;
  if (inner instanceof FormData) return str(inner.get(key));
  const src = (inner && typeof inner === "object" ? inner : obj) as Record<string, unknown>;
  return typeof src[key] === "string" ? (src[key] as string) : undefined;
}

export const submitToWaitlist = createServerFn({ method: "POST" }).handler(
  async (data: unknown) => {
    const email = getStrField(data, "email") ?? "";
    const name = getStrField(data, "name");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: "Valid email is required" };
    }

    try {
      // Try database first
      if (process.env.DATABASE_URL) {
        const result = await addToWaitlist(email, name);
        if (!result) {
          return { success: false, error: "This email is already on the waitlist!" };
        }
        return { success: true, error: null };
      }

      // Fallback: file-based storage
      let entries: WaitlistEntry[] = [];
      if (existsSync(WAITLIST_FILE)) {
        const content = await readFile(WAITLIST_FILE, "utf-8");
        try {
          entries = JSON.parse(content);
        } catch {
          entries = [];
        }
      }

      if (entries.some((e) => e.email === email.toLowerCase())) {
        return { success: false, error: "This email is already on the waitlist!" };
      }

      entries.push({
        email: email.toLowerCase(),
        name: name?.trim() || "",
        signedUpAt: new Date().toISOString(),
      });

      await writeFile(WAITLIST_FILE, JSON.stringify(entries, null, 2), "utf-8");
      return { success: true, error: null };
    } catch (err) {
      console.error("Waitlist submission error:", err);
      return { success: false, error: "Something went wrong. Please try again." };
    }
  },
);

/**
 * Server function to get waitlist count (for social proof).
 */
export const getWaitlistCount = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      // Try database first
      if (process.env.DATABASE_URL) {
        const count = await dbGetWaitlistCount();
        return { count };
      }

      // Fallback: file-based storage
      if (!existsSync(WAITLIST_FILE)) {
        return { count: 0 };
      }
      const content = await readFile(WAITLIST_FILE, "utf-8");
      const entries = JSON.parse(content) as WaitlistEntry[];
      return { count: entries.length };
    } catch {
      return { count: 0 };
    }
  },
);