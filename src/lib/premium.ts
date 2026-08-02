import { createServerFn } from "@tanstack/react-start";
import { SESSION_COOKIE, verifySessionToken } from "./auth";
import type { AuthSession } from "./auth";

// =============================================================================
// Premium / subscription helpers
//
// IMPORTANT build constraint: this file must keep its module scope free of
// node builtin imports (node:fs / node:path). This module is imported by client
// components (PremiumGate, PremiumBadge, premium page), and the TanStack Start
// client transform only reliably drops node imports that are referenced inside
// `createServerFn` handlers. Everything touching the filesystem therefore uses
// dynamic `await import()` inside handler-reachable code — the client bundle
// never executes it, and the build never tries to resolve node builtins for the
// browser.
//
// The subscription tier lives in the user store (Neon `users` table when
// DATABASE_URL is set, otherwise `.run/users.json`). The JWT session carries a
// snapshot of the tier, but the *authoritative* source is the user store — that
// way an upgrade applied by the Stripe webhook (or the one-time activation
// link) is reflected immediately, without the user having to log out/in.
// =============================================================================

export interface PremiumStatus {
  subscribed: boolean;
  tier: string;
  name: string;
  email: string;
  /** Human label for the current plan (monthly/yearly), when subscribed. */
  planLabel: string | null;
  loggedIn: boolean;
}

export interface StripeWebhookResult {
  received: boolean;
  handled: boolean;
  upgraded?: boolean;
  reason?: string;
}

const TIER_LABELS: Record<string, string> = {
  premium: "Premium",
  monthly: "Premium Monthly",
  yearly: "Premium Yearly",
};

/** True when the given tier is a paid tier (anything other than "free"). */
function isSubscribed(tier?: string | null): boolean {
  return !!tier && tier !== "free" && tier !== "free_trial";
}

// =============================================================================
// User store access (mirrors auth.ts but with dynamic node imports)
// =============================================================================
interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  subscriptionTier: string;
  createdAt?: string;
}

async function getUsersFilePath(): Promise<string> {
  const { join } = await import("node:path");
  return join(process.cwd(), ".run", "users.json");
}

async function getStoredUsers(): Promise<StoredUser[]> {
  try {
    const { existsSync, readFileSync } = await import("node:fs");
    const file = await getUsersFilePath();
    if (existsSync(file)) {
      return JSON.parse(readFileSync(file, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to read users file:", err);
  }
  return [];
}

async function saveStoredUsers(users: StoredUser[]): Promise<void> {
  const { writeFileSync } = await import("node:fs");
  const file = await getUsersFilePath();
  writeFileSync(file, JSON.stringify(users, null, 2));
}

/** Fetch the live subscription tier for a user from the store (DB first, file fallback). */
async function fetchUserTier(userId: string): Promise<string | null> {
  if (process.env.DATABASE_URL) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL);
      const rows = await sql`SELECT subscription_tier FROM users WHERE id = ${userId}`;
      if (rows.length > 0) {
        const v = (rows[0] as Record<string, unknown>).subscription_tier;
        return typeof v === "string" ? v : v == null ? null : String(v);
      }
      return null;
    } catch (err) {
      console.error("fetchUserTier DB error:", err);
      return null;
    }
  }
  const user = (await getStoredUsers()).find((u) => u.id === userId);
  return user?.subscriptionTier ?? null;
}

/** Upgrade a user to premium in the store. Returns false if the user doesn't exist. */
async function upgradeUserToPremium(userId: string): Promise<boolean> {
  if (process.env.DATABASE_URL) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL);
      const res = await sql`
        UPDATE users SET subscription_tier = 'premium'
        WHERE id = ${userId}
      `;
      return res != null && (res as unknown as { rowCount?: number }).rowCount === 1;
    } catch (err) {
      console.error("upgradeUserToPremium DB error:", err);
      return false;
    }
  }
  const users = await getStoredUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return false;
  users[idx].subscriptionTier = "premium";
  await saveStoredUsers(users);
  return true;
}

/** Resolve the current session from the request cookie (server-side only). */
async function getCurrentSession(): Promise<AuthSession | null> {
  // Dynamic import: "@tanstack/react-start/server" is denied in the client
  // bundle by the import-protection plugin, so it must be loaded lazily inside
  // handler-reachable code only.
  const { getCookie } = await import("@tanstack/react-start/server");
  const token = getCookie(SESSION_COOKIE);
  if (!token) return null;
  return verifySessionToken(token);
}

/** Build a PremiumStatus for a session using the live tier from the store. */
async function buildStatus(session: AuthSession | null): Promise<PremiumStatus> {
  if (!session) {
    return {
      subscribed: false,
      tier: "free",
      name: "",
      email: "",
      planLabel: null,
      loggedIn: false,
    };
  }
  const tier = (await fetchUserTier(session.userId)) ?? session.subscriptionTier ?? "free";
  return {
    subscribed: isSubscribed(tier),
    tier,
    name: session.name,
    email: session.email,
    planLabel: isSubscribed(tier) ? TIER_LABELS[tier] ?? "Premium" : null,
    loggedIn: true,
  };
}

/**
 * requirePremium() — server-side guard helper. Returns the subscription status
 * plus the session; callers decide how to react when `subscribed` is false.
 */
async function requirePremium(): Promise<{
  subscribed: boolean;
  status: PremiumStatus;
  user: AuthSession | null;
}> {
  const session = await getCurrentSession();
  const status = await buildStatus(session);
  return { subscribed: status.subscribed, status, user: session };
}

// =============================================================================
// Server functions (callable from client components)
// =============================================================================

/** Current premium status for the logged-in user (live tier from the store). */
export const getPremiumStatus = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await getCurrentSession();
    return buildStatus(session);
  },
);

/**
 * One-time activation link: upgrades the *currently logged-in user* to premium.
 * Used after a successful payment (e.g. `?checkout=success` return from Stripe
 * Checkout) when the webhook hasn't fired yet, or as the demo/dev path while
 * STRIPE_SECRET_KEY is not configured. In production this is superseded by the
 * Stripe webhook, which upgrades by userId from the session metadata.
 */
export const activatePremium = createServerFn({ method: "POST" }).handler(
  async () => {
    const session = await getCurrentSession();
    if (!session) {
      const status = await buildStatus(null);
      return { success: false, status, error: "You must be signed in to activate premium." };
    }
    const upgraded = await upgradeUserToPremium(session.userId);
    const status = await buildStatus(session);
    return {
      success: upgraded,
      status,
      error: upgraded ? undefined : "Could not upgrade — user not found.",
    };
  },
);

/**
 * Process a Stripe webhook event (checkout.session.completed → upgrade user).
 * Plain async function so both the createServerFn wrapper and the raw
 * /api/stripe-webhook HTTP route can call it directly (a createServerFn called
 * in-process wraps arguments differently, so raw handlers should use this).
 * Re-invocable — upgrading an already-premium user is a no-op success.
 */
export async function handleStripeWebhookEvent(
  payload: unknown,
): Promise<StripeWebhookResult> {
  const event = (payload ?? {}) as {
    type?: string;
    data?: { object?: { metadata?: Record<string, string> } };
  };
  if (!event || event.type !== "checkout.session.completed") {
    return {
      received: true,
      handled: false,
      reason: `Unhandled event type: ${event?.type ?? "unknown"}`,
    };
  }
  const userId = event.data?.object?.metadata?.userId;
  if (!userId) {
    return {
      received: true,
      handled: false,
      reason: "checkout.session.completed without metadata.userId",
    };
  }
  const upgraded = await upgradeUserToPremium(userId);
  return {
    received: true,
    handled: true,
    upgraded,
    reason: upgraded
      ? "User upgraded to premium"
      : "Payment received but user not found in store",
  };
}

/**
 * Stripe webhook handler (checkout.session.completed → upgrade user to premium).
 * Expects the standard Stripe event shape; the userId is read from
 * `data.object.metadata.userId`, which `createCheckoutSession` stamps on the
 * session. Re-invocable — upgrading an already-premium user is a no-op success.
 */
export const handleStripeWebhook = createServerFn({ method: "POST" }).handler(
  async (payload: unknown): Promise<StripeWebhookResult> => {
    return handleStripeWebhookEvent(payload);
  },
);

export { requirePremium, isSubscribed };
