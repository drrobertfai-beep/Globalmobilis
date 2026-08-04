/**
 * Global Mobilis — Points Redemption
 *
 * Closes the gamification loop: users spend the points they earn from
 * community activity (see ./points) to unlock rewards — cosmetic badges,
 * points-based premium access, and perks.
 *
 * IMPORTANT build constraint: this module is reachable from client bundles
 * (through the rewards route and src/lib/premium.ts), so its module scope
 * must stay free of node builtin imports (node:fs / node:path) and
 * `@tanstack/react-start/server`. All filesystem access and session-cookie
 * reads use dynamic `await import()` inside handler-reachable code — the same
 * discipline as src/lib/points.ts.
 */
import { createServerFn } from "@tanstack/react-start";
import { SESSION_COOKIE, verifySessionToken } from "./auth";
import { getUserPoints, spendPoints } from "./points";
// =============================================================================
// Types
// =============================================================================
export interface Reward {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointCost: number;
  type:
    | "badge"
    | "premium_1mo"
    | "premium_1yr"
    | "early_access"
    | "profile_boost"
    | "pinned_post"
    | "reply_boost";
  tier: "bronze" | "silver" | "gold";
}
export interface UserRedemption {
  userId: string;
  redeemed: { rewardId: string; redeemedAt: string }[];
}
export type RedeemResult =
  | { success: true; points: number; reward: Reward }
  | { success: false; error: string; points: number | null };
// =============================================================================
// Rewards catalog (seeded — one-time redemptions)
// =============================================================================
export const REWARDS: Reward[] = [
  {
    id: "reply_boost",
    name: "Reply Boost",
    description: "Your reply gets highlighted for 48 hours.",
    icon: "💬",
    pointCost: 100,
    type: "reply_boost",
    tier: "bronze",
  },
  {
    id: "gold_profile_badge",
    name: "Gold Profile Badge",
    description: "Cosmetic gold badge on your profile.",
    icon: "🏅",
    pointCost: 150,
    type: "badge",
    tier: "gold",
  },
  {
    id: "pinned_post",
    name: "Pinned Forum Post",
    description: "Pin one of your threads for 7 days.",
    icon: "📌",
    pointCost: 200,
    type: "pinned_post",
    tier: "bronze",
  },
  {
    id: "early_access",
    name: "Early Access",
    description: "Get early access to mentor consultations when they launch.",
    icon: "🎯",
    pointCost: 300,
    type: "early_access",
    tier: "silver",
  },
  {
    id: "premium_1mo",
    name: "Premium Access (1 month)",
    description: "Unlocks all premium features for 30 days.",
    icon: "⭐",
    pointCost: 500,
    type: "premium_1mo",
    tier: "silver",
  },
  {
    id: "premium_1yr",
    name: "Premium Access (1 year)",
    description: "Unlocks all premium features for 365 days.",
    icon: "👑",
    pointCost: 4500,
    type: "premium_1yr",
    tier: "gold",
  },
];
// =============================================================================
// JSON file persistence (dynamic node imports — see header note)
// =============================================================================
async function readAllRedemptions(): Promise<Record<string, UserRedemption>> {
  try {
    const { join } = await import("node:path");
    const { existsSync, readFileSync } = await import("node:fs");
    const file = join(process.cwd(), "data", "redemptions.json");
    if (existsSync(file)) {
      return JSON.parse(readFileSync(file, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to read redemptions file:", err);
  }
  return {};
}
async function writeAllRedemptions(
  all: Record<string, UserRedemption>,
): Promise<void> {
  const { join } = await import("node:path");
  const { mkdirSync, writeFileSync } = await import("node:fs");
  const dir = join(process.cwd(), "data");
  const file = join(dir, "redemptions.json");
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, JSON.stringify(all, null, 2));
}
// =============================================================================
// Helpers
// =============================================================================
function getRewardById(rewardId: string): Reward | undefined {
  return REWARDS.find((r) => r.id === rewardId);
}
/** True when the user redeemed the given reward (any time). */
export async function hasRedeemed(
  userId: string,
  rewardId: string,
): Promise<boolean> {
  if (!userId) return false;
  const all = await readAllRedemptions();
  const entry = all[userId];
  return !!entry?.redeemed.some((r) => r.rewardId === rewardId);
}
/**
 * True when the user has ACTIVE points-based premium: they redeemed
 * premium_1mo within the last 30 days or premium_1yr within 365 days.
 * Used by src/lib/premium.ts to treat points holders as premium without a
 * Stripe subscription.
 */
export async function isPremiumFromPoints(userId: string): Promise<boolean> {
  if (!userId) return false;
  const all = await readAllRedemptions();
  const entry = all[userId];
  if (!entry) return false;
  const now = Date.now();
  for (const redemption of entry.redeemed) {
    const redeemedAt = new Date(redemption.redeemedAt).getTime();
    if (Number.isNaN(redeemedAt)) continue;
    if (redemption.rewardId === "premium_1mo" && now - redeemedAt <= 30 * 24 * 60 * 60 * 1000) {
      return true;
    }
    if (redemption.rewardId === "premium_1yr" && now - redeemedAt <= 365 * 24 * 60 * 60 * 1000) {
      return true;
    }
  }
  return false;
}
// =============================================================================
// Server functions (callable from client components)
// =============================================================================
/** List all available rewards. */
export const getRewards = createServerFn({ method: "GET" }).handler(
  async (): Promise<Reward[]> => {
    return REWARDS;
  },
);
/** Current signed-in user's redemption history (null when signed out). */
export const getMyRedemptions = createServerFn({ method: "GET" }).handler(
  async (): Promise<UserRedemption | null> => {
    try {
      const { getCookie } = await import("@tanstack/react-start/server");
      const token = getCookie(SESSION_COOKIE);
      if (!token) return null;
      const session = await verifySessionToken(token);
      const all = await readAllRedemptions();
      return all[session.userId] ?? { userId: session.userId, redeemed: [] };
    } catch {
      return null;
    }
  },
);
/**
 * Redeem a reward: validates the user is signed in, the reward exists, hasn't
 * already been redeemed, and the user has enough points — then deducts the
 * points and records the redemption.
 *
 * `payload` is the raw server-function argument. TanStack Start wraps a
 * non-FormData single argument as `{ data: <arg> }`, so accept both the
 * string directly and the wrapped shape (mirrors getStrField in forums.ts).
 */
export const redeemReward = createServerFn({ method: "POST" }).handler(
  async (payload: unknown): Promise<RedeemResult> => {
    try {
      const rewardId =
        typeof payload === "string"
          ? payload
          : typeof (payload as Record<string, unknown>)?.data === "string"
            ? ((payload as Record<string, unknown>).data as string)
            : "";
      const { getCookie } = await import("@tanstack/react-start/server");
      const token = getCookie(SESSION_COOKIE);
      if (!token) {
        return { success: false, error: "You must be signed in to redeem rewards.", points: null };
      }
      const session = await verifySessionToken(token);
      const reward = getRewardById(rewardId);
      if (!reward) {
        return { success: false, error: "Reward not found.", points: null };
      }
      if (await hasRedeemed(session.userId, rewardId)) {
        const points = (await getUserPoints(session.userId)).points;
        return { success: false, error: "You've already redeemed this reward.", points };
      }
      const before = await getUserPoints(session.userId);
      if (before.points < reward.pointCost) {
        return {
          success: false,
          error: `Not enough points — ${reward.name} costs ${reward.pointCost} pts.`,
          points: before.points,
        };
      }
      await spendPoints(session.userId, reward.pointCost);
      const all = await readAllRedemptions();
      const entry = all[session.userId] ?? { userId: session.userId, redeemed: [] };
      entry.redeemed.push({ rewardId, redeemedAt: new Date().toISOString() });
      all[session.userId] = entry;
      await writeAllRedemptions(all);
      const after = await getUserPoints(session.userId);
      return { success: true, points: after.points, reward };
    } catch (err) {
      console.error("redeemReward error:", err);
      return { success: false, error: "Something went wrong. Please try again.", points: null };
    }
  },
);
