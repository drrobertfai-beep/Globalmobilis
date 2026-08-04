/**
 * Global Mobilis — Points & Badges
 *
 * Gamification for community engagement. Every user accrues points and
 * badges as they participate in the forums (threads, replies, upvotes,
 * accepted answers). Persistence is a JSON file under <project>/data/
 * (points.json).
 *
 * IMPORTANT build constraint: this module's scope must stay free of node
 * builtin imports (node:fs / node:path) and `@tanstack/react-start/server`.
 * It is reachable from client bundles through src/lib/forums.ts, so the
 * TanStack Start client transform only reliably drops node imports that are
 * referenced inside `createServerFn` handlers. All filesystem access and the
 * session-cookie read therefore use dynamic `await import()` inside
 * handler-reachable code.
 */
import { createServerFn } from "@tanstack/react-start";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

// =============================================================================
// Types
// =============================================================================

export interface UserPoints {
  userId: string;
  points: number;
  badges: string[];
  stats: {
    threadsCreated: number;
    repliesPosted: number;
    upvotesReceived: number;
    upvotesGiven: number;
  };
}

export type PointsReason =
  | "create_thread"
  | "post_reply"
  | "receive_upvote"
  | "answer_accepted";

export const POINTS_RULES: Record<PointsReason, number> = {
  create_thread: 5,
  post_reply: 2,
  receive_upvote: 1,
  answer_accepted: 10,
};

export interface BadgeDef {
  name: string;
  minPoints: number;
  minStat?: { key: keyof UserPoints["stats"]; value: number };
  description: string;
}

/** Badge thresholds (points + optional stat requirement). */
export const BADGES: BadgeDef[] = [
  { name: "Newcomer", minPoints: 10, description: "Earned your first 10 points" },
  {
    name: "Thread Starter",
    minPoints: 30,
    minStat: { key: "threadsCreated", value: 3 },
    description: "Started 3+ threads",
  },
  {
    name: "Contributor",
    minPoints: 50,
    minStat: { key: "repliesPosted", value: 5 },
    description: "50+ points and 5+ replies",
  },
  {
    name: "Helpful Voice",
    minPoints: 100,
    minStat: { key: "upvotesReceived", value: 10 },
    description: "100+ points and 10+ upvotes received",
  },
  { name: "Verified Local Guide", minPoints: 150, description: "Reached 150 points" },
  {
    name: "Top Contributor",
    minPoints: 250,
    minStat: { key: "repliesPosted", value: 50 },
    description: "250+ points and 50+ replies",
  },
];

// =============================================================================
// JSON file persistence (dynamic node imports — see header note)
// =============================================================================

async function readAllPoints(): Promise<Record<string, UserPoints>> {
  const { join } = await import("node:path");
  const { existsSync, readFileSync } = await import("node:fs");
  const file = join(process.cwd(), "data", "points.json");
  try {
    if (existsSync(file)) {
      const parsed = JSON.parse(readFileSync(file, "utf-8"));
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch (err) {
    console.error("points: failed to read points.json", err);
  }
  return {};
}

async function writeAllPoints(all: Record<string, UserPoints>): Promise<void> {
  const { join } = await import("node:path");
  const { mkdirSync, writeFileSync } = await import("node:fs");
  const dir = join(process.cwd(), "data");
  const file = join(dir, "points.json");
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, JSON.stringify(all, null, 2));
}

// =============================================================================
// Helpers
// =============================================================================

function emptyPoints(userId: string): UserPoints {
  return {
    userId,
    points: 0,
    badges: [],
    stats: { threadsCreated: 0, repliesPosted: 0, upvotesReceived: 0, upvotesGiven: 0 },
  };
}

function computeBadges(entry: UserPoints): string[] {
  const earned: string[] = [];
  for (const def of BADGES) {
    const statOk = def.minStat
      ? entry.stats[def.minStat.key] >= def.minStat.value
      : true;
    if (entry.points >= def.minPoints && statOk) earned.push(def.name);
  }
  return earned;
}

async function persist(entry: UserPoints): Promise<UserPoints> {
  const all = await readAllPoints();
  entry.badges = computeBadges(entry);
  all[entry.userId] = entry;
  await writeAllPoints(all);
  return { ...entry, badges: [...entry.badges] };
}

// =============================================================================
// Public API
// =============================================================================

/** Get a user's points record (creates an empty one lazily if absent). */
export async function getUserPoints(userId: string): Promise<UserPoints> {
  const all = await readAllPoints();
  const existing = all[userId];
  if (existing) return { ...existing, badges: [...existing.badges] };
  return emptyPoints(userId);
}

/** Award points for an activity and bump the matching stat. Returns the updated record. */
export async function awardPoints(
  userId: string,
  amount: number,
  reason: PointsReason,
): Promise<UserPoints> {
  if (!userId) return emptyPoints(userId);
  const entry = await getUserPoints(userId);
  entry.points += amount;
  switch (reason) {
    case "create_thread":
      entry.stats.threadsCreated += 1;
      break;
    case "post_reply":
      entry.stats.repliesPosted += 1;
      break;
    case "receive_upvote":
      entry.stats.upvotesReceived += 1;
      break;
    case "answer_accepted":
      break; // points only
  }
  return persist(entry);
}

/** Record that the user gave an upvote (stat only, no points). */
export async function recordUpvoteGiven(userId: string): Promise<UserPoints> {
  if (!userId) return emptyPoints(userId);
  const entry = await getUserPoints(userId);
  entry.stats.upvotesGiven += 1;
  return persist(entry);
}
/**
 * Spend points (e.g. redeeming a reward). Deducts `amount` from the user's
 * balance — never below 0 — and returns the updated record. Badges are
 * recomputed, so a user can drop below a badge threshold after spending.
 */
export async function spendPoints(
  userId: string,
  amount: number,
): Promise<UserPoints> {
  if (!userId) return emptyPoints(userId);
  const entry = await getUserPoints(userId);
  entry.points = Math.max(0, entry.points - Math.max(0, amount));
  return persist(entry);
}

// =============================================================================
// Server Functions
// =============================================================================

/** Read the current signed-in user's points + badges (null when signed out). */
export const getMyPoints = createServerFn({ method: "GET" }).handler(
  async (): Promise<UserPoints | null> => {
    try {
      const { getCookie } = await import("@tanstack/react-start/server");
      const token = getCookie(SESSION_COOKIE);
      if (!token) return null;
      const session = await verifySessionToken(token);
      return getUserPoints(session.userId);
    } catch {
      return null;
    }
  },
);
