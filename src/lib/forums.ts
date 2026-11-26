/**
 * Global Mobilis — Community Forums
 *
 * Q&A-style forums: threads, replies, upvoting and accepted answers, with a
 * points/badges gamification layer (src/lib/points.ts). Persistence is JSON
 * files under <project>/data/ (threads.json, replies.json). The current user
 * is identified from the session cookie (JWT issued by src/lib/auth.ts).
 *
 * IMPORTANT build constraint: this module's scope must stay free of node
 * builtin imports (node:fs / node:path), `@tanstack/react-start/server` and
 * value imports from ./points — it is imported by several client route
 * bundles, and the TanStack Start client transform only reliably drops node
 * imports that are referenced inside `createServerFn` handlers. Everything
 * touching the filesystem, the session cookie, and the points system
 * therefore uses dynamic `await import()` inside handler-reachable code.
 */
import { createServerFn } from "@tanstack/react-start";
import { SESSION_COOKIE, verifySessionToken } from "./auth";
import type { AuthSession } from "./auth";
import type { UserPoints } from "./points";

// =============================================================================
// Types
// =============================================================================

export interface ForumThread {
  id: string;
  title: string;
  body: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  upvotes: number;
  upvoterIds: string[];
  replyCount: number;
  pinned: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface ThreadReply {
  id: string;
  threadId: string;
  body: string;
  authorId: string;
  authorName: string;
  upvotes: number;
  upvoterIds: string[];
  isAcceptedAnswer: boolean;
  createdAt: string; // ISO
}

/** Public, list-friendly view of a thread (includes current user's vote state). */
export interface ThreadView {
  id: string;
  title: string;
  body: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  upvotes: number;
  isUpvoted: boolean;
  replyCount: number;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReplyView {
  id: string;
  threadId: string;
  body: string;
  authorId: string;
  authorName: string;
  upvotes: number;
  isUpvoted: boolean;
  isAcceptedAnswer: boolean;
  createdAt: string;
}

export interface ThreadDetail {
  thread: ThreadView;
  replies: ReplyView[];
  currentUser: { id: string; name: string } | null;
  isAuthor: boolean;
}

export interface ForumActionResult {
  success: boolean;
  error?: string;
  thread?: ThreadView;
  reply?: ReplyView;
  detail?: ThreadDetail;
  points?: UserPoints;
}

export const FORUM_CATEGORIES = [
  "Toronto",
  "Berlin",
  "Dubai",
  "Lisbon",
  "London",
  "Sydney",
  "General",
];

/** Points awarded per activity (mirrors POINTS_RULES in src/lib/points.ts). */
const POINTS = {
  createThread: 5,
  postReply: 2,
  receiveUpvote: 1,
  answerAccepted: 10,
} as const;

// =============================================================================
// JSON file persistence (dynamic node imports — see header note)
// =============================================================================

async function readThreads(): Promise<ForumThread[]> {
  const { join } = await import("node:path");
  const { existsSync, readFileSync } = await import("node:fs");
  const dir = join(process.cwd(), "data");
  const file = join(dir, "threads.json");
  try {
    if (existsSync(file)) {
      const parsed = JSON.parse(readFileSync(file, "utf-8"));
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("forums: failed to read threads.json", err);
  }
  return [];
}

async function writeThreads(threads: ForumThread[]): Promise<void> {
  const { join } = await import("node:path");
  const { mkdirSync, writeFileSync } = await import("node:fs");
  const dir = join(process.cwd(), "data");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "threads.json"), JSON.stringify(threads, null, 2));
}

async function readReplies(): Promise<ThreadReply[]> {
  const { join } = await import("node:path");
  const { existsSync, readFileSync } = await import("node:fs");
  const dir = join(process.cwd(), "data");
  const file = join(dir, "replies.json");
  try {
    if (existsSync(file)) {
      const parsed = JSON.parse(readFileSync(file, "utf-8"));
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("forums: failed to read replies.json", err);
  }
  return [];
}

async function writeReplies(replies: ThreadReply[]): Promise<void> {
  const { join } = await import("node:path");
  const { mkdirSync, writeFileSync } = await import("node:fs");
  const dir = join(process.cwd(), "data");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "replies.json"), JSON.stringify(replies, null, 2));
}

// =============================================================================
// Helpers
// =============================================================================

let idCounter = 0;
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${++idCounter}`;
}

/** Resolve the current user from the session cookie, or null. */
async function getCurrentUser(): Promise<AuthSession | null> {
  try {
    const { getCookie } = await import("@tanstack/react-start/server");
    const token = getCookie(SESSION_COOKIE);
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

function toThreadView(thread: ForumThread, userId: string | null): ThreadView {
  return {
    id: thread.id,
    title: thread.title,
    body: thread.body,
    category: thread.category,
    tags: [...thread.tags],
    authorId: thread.authorId,
    authorName: thread.authorName,
    upvotes: thread.upvotes,
    isUpvoted: !!userId && thread.upvoterIds.includes(userId),
    replyCount: thread.replyCount,
    pinned: thread.pinned,
    createdAt: thread.createdAt,
    updatedAt: thread.updatedAt,
  };
}

function toReplyView(reply: ThreadReply, userId: string | null): ReplyView {
  return {
    id: reply.id,
    threadId: reply.threadId,
    body: reply.body,
    authorId: reply.authorId,
    authorName: reply.authorName,
    upvotes: reply.upvotes,
    isUpvoted: !!userId && reply.upvoterIds.includes(userId),
    isAcceptedAnswer: reply.isAcceptedAnswer,
    createdAt: reply.createdAt,
  };
}

function requireUser(session: AuthSession | null): ForumActionResult | null {
  if (!session) {
    return { success: false, error: "You must be signed in to do that." };
  }
  return null;
}

// =============================================================================
// Payload helpers
// =============================================================================

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

// =============================================================================
// Server Functions
// =============================================================================

/** List threads, optionally filtered by category, newest first (pinned on top). */
export const listThreads = createServerFn({ method: "GET" }).handler(
  async (data: unknown): Promise<ThreadView[]> => {
    const user = await getCurrentUser();
    const raw = (data ?? {}) as { category?: string | null } | string | null;
    const category = typeof raw === "string" ? raw : raw?.category ?? null;

    const threads = (await readThreads()).filter(
      (t) => !category || t.category === category,
    );
    const sorted = [...threads].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
    return sorted.map((t) => toThreadView(t, user?.userId ?? null));
  },
);

/** Get one thread with its replies and the current user's context. */
export const getThread = createServerFn({ method: "GET" }).handler(
  async (data: unknown): Promise<ThreadDetail | null> => {
    const user = await getCurrentUser();
    const { threadId } = (data ?? {}) as { threadId?: string };
    if (!threadId) return null;

    const thread = (await readThreads()).find((t) => t.id === threadId);
    if (!thread) return null;

    const replies = (await readReplies())
      .filter((r) => r.threadId === threadId)
      .sort((a, b) => {
        // Accepted answers first, then oldest first (chronological Q&A).
        if (a.isAcceptedAnswer !== b.isAcceptedAnswer) return a.isAcceptedAnswer ? -1 : 1;
        return a.createdAt.localeCompare(b.createdAt);
      });

    return {
      thread: toThreadView(thread, user?.userId ?? null),
      replies: replies.map((r) => toReplyView(r, user?.userId ?? null)),
      currentUser: user ? { id: user.userId, name: user.name } : null,
      isAuthor: !!user && thread.authorId === user.userId,
    };
  },
);

/** Convenience: everything the forums listing page needs in one round-trip. */
export const getForumsData = createServerFn({ method: "GET" }).handler(
  async (
    data: unknown,
  ): Promise<{
    threads: ThreadView[];
    currentUser: { id: string; name: string } | null;
  }> => {
    const user = await getCurrentUser();
    const raw = (data ?? {}) as { category?: string | null } | string | null;
    const category = typeof raw === "string" ? raw : raw?.category ?? null;
    const threads = (await readThreads()).filter(
      (t) => !category || t.category === category,
    );
    const sorted = [...threads].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
    return {
      threads: sorted.map((t) => toThreadView(t, user?.userId ?? null)),
      currentUser: user ? { id: user.userId, name: user.name } : null,
    };
  },
);

/** Create a new thread (signed-in users). Awards +5 points to the author. */
export const createThread = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<ForumActionResult> => {
    const user = await getCurrentUser();
    const blocked = requireUser(user);
    if (blocked) return blocked;

    const title = getStrField(data, "title") ?? "";
    const body = getStrField(data, "body") ?? "";
    const category = getStrField(data, "category");
    const tags = getStrField(data, "tags");

    if (!title || !title.trim()) {
      return { success: false, error: "Please add a title." };
    }
    if (!body || !body.trim()) {
      return { success: false, error: "Please write a question or topic." };
    }
    const cat = category?.trim() || "General";
    if (!FORUM_CATEGORIES.includes(cat)) {
      return { success: false, error: "Please choose a valid category." };
    }

    const tagsArr = Array.isArray(tags)
      ? tags
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, 6)
      : typeof tags === "string"
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .slice(0, 6)
        : [];

    const now = new Date().toISOString();
    const thread: ForumThread = {
      id: generateId("t"),
      title: title.trim(),
      body: body.trim(),
      category: cat,
      tags: tagsArr,
      authorId: user!.userId,
      authorName: user!.name,
      upvotes: 0,
      upvoterIds: [],
      replyCount: 0,
      pinned: false,
      createdAt: now,
      updatedAt: now,
    };

    const threads = await readThreads();
    threads.push(thread);
    await writeThreads(threads);

    const { awardPoints } = await import("./points");
    const points = await awardPoints(user!.userId, POINTS.createThread, "create_thread");
    return {
      success: true,
      thread: toThreadView(thread, user!.userId),
      points,
    };
  },
);

/** Post a reply to a thread (signed-in users). Awards +2 points to the author. */
export const createReply = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<ForumActionResult> => {
    const user = await getCurrentUser();
    const blocked = requireUser(user);
    if (blocked) return blocked;

    const threadId = getStrField(data, "threadId");
    const body = getStrField(data, "body");
    if (!threadId) return { success: false, error: "Thread is required." };
    if (!body || !body.trim()) {
      return { success: false, error: "Please write a reply." };
    }

    const threads = await readThreads();
    const thread = threads.find((t) => t.id === threadId);
    if (!thread) return { success: false, error: "Thread not found." };

    const reply: ThreadReply = {
      id: generateId("r"),
      threadId,
      body: body.trim(),
      authorId: user!.userId,
      authorName: user!.name,
      upvotes: 0,
      upvoterIds: [],
      isAcceptedAnswer: false,
      createdAt: new Date().toISOString(),
    };

    const replies = await readReplies();
    replies.push(reply);
    await writeReplies(replies);

    thread.replyCount += 1;
    thread.updatedAt = reply.createdAt;
    await writeThreads(threads);

    const { awardPoints } = await import("./points");
    const points = await awardPoints(user!.userId, POINTS.postReply, "post_reply");
    return { success: true, reply: toReplyView(reply, user!.userId), points };
  },
);

/** Upvote a thread (+1 point to the author, +1 'given' stat to the voter). */
export const upvoteThread = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<ForumActionResult> => {
    const user = await getCurrentUser();
    const blocked = requireUser(user);
    if (blocked) return blocked;

    const threadId = getStrField(data, "threadId");
    const threads = await readThreads();
    const thread = threads.find((t) => t.id === threadId);
    if (!thread) return { success: false, error: "Thread not found." };

    if (!thread.upvoterIds.includes(user!.userId)) {
      thread.upvoterIds.push(user!.userId);
      thread.upvotes += 1;
      await writeThreads(threads);
      if (thread.authorId !== user!.userId) {
        const { awardPoints } = await import("./points");
        await awardPoints(thread.authorId, POINTS.receiveUpvote, "receive_upvote");
      }
      const { recordUpvoteGiven } = await import("./points");
      await recordUpvoteGiven(user!.userId);
    }

    return { success: true, thread: toThreadView(thread, user!.userId) };
  },
);

/** Remove the current user's upvote from a thread. */
export const unvoteThread = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<ForumActionResult> => {
    const user = await getCurrentUser();
    const blocked = requireUser(user);
    if (blocked) return blocked;

    const threadId = getStrField(data, "threadId");
    const threads = await readThreads();
    const thread = threads.find((t) => t.id === threadId);
    if (!thread) return { success: false, error: "Thread not found." };

    if (thread.upvoterIds.includes(user!.userId)) {
      thread.upvoterIds = thread.upvoterIds.filter((id) => id !== user!.userId);
      thread.upvotes = Math.max(0, thread.upvotes - 1);
      await writeThreads(threads);
    }

    return { success: true, thread: toThreadView(thread, user!.userId) };
  },
);

/** Upvote a reply (+1 point to the author, +1 'given' stat to the voter). */
export const upvoteReply = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<ForumActionResult> => {
    const user = await getCurrentUser();
    const blocked = requireUser(user);
    if (blocked) return blocked;

    const replyId = getStrField(data, "replyId");
    const replies = await readReplies();
    const reply = replies.find((r) => r.id === replyId);
    if (!reply) return { success: false, error: "Reply not found." };

    if (!reply.upvoterIds.includes(user!.userId)) {
      reply.upvoterIds.push(user!.userId);
      reply.upvotes += 1;
      await writeReplies(replies);
      if (reply.authorId !== user!.userId) {
        const { awardPoints } = await import("./points");
        await awardPoints(reply.authorId, POINTS.receiveUpvote, "receive_upvote");
      }
      const { recordUpvoteGiven } = await import("./points");
      await recordUpvoteGiven(user!.userId);
    }

    return { success: true, reply: toReplyView(reply, user!.userId) };
  },
);

/** Remove the current user's upvote from a reply. */
export const unvoteReply = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<ForumActionResult> => {
    const user = await getCurrentUser();
    const blocked = requireUser(user);
    if (blocked) return blocked;

    const replyId = getStrField(data, "replyId");
    const replies = await readReplies();
    const reply = replies.find((r) => r.id === replyId);
    if (!reply) return { success: false, error: "Reply not found." };

    if (reply.upvoterIds.includes(user!.userId)) {
      reply.upvoterIds = reply.upvoterIds.filter((id) => id !== user!.userId);
      reply.upvotes = Math.max(0, reply.upvotes - 1);
      await writeReplies(replies);
    }

    return { success: true, reply: toReplyView(reply, user!.userId) };
  },
);

/** Mark a reply as the accepted answer (thread author only). Awards +10 points. */
export const markAcceptedReply = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<ForumActionResult> => {
    const user = await getCurrentUser();
    const blocked = requireUser(user);
    if (blocked) return blocked;

    const threadId = getStrField(data, "threadId");
    const replyId = getStrField(data, "replyId");
    if (!threadId || !replyId) {
      return { success: false, error: "Thread and reply are required." };
    }

    const threads = await readThreads();
    const thread = threads.find((t) => t.id === threadId);
    if (!thread) return { success: false, error: "Thread not found." };
    if (thread.authorId !== user!.userId) {
      return {
        success: false,
        error: "Only the thread author can mark an accepted answer.",
      };
    }

    const replies = await readReplies();
    const reply = replies.find((r) => r.id === replyId && r.threadId === threadId);
    if (!reply) return { success: false, error: "Reply not found." };

    if (!reply.isAcceptedAnswer) {
      // Un-mark any previous accepted answer in the thread.
      for (const r of replies) {
        if (r.threadId === threadId) r.isAcceptedAnswer = false;
      }
      reply.isAcceptedAnswer = true;
      await writeReplies(replies);
      if (reply.authorId !== user!.userId) {
        const { awardPoints } = await import("./points");
        await awardPoints(reply.authorId, POINTS.answerAccepted, "answer_accepted");
      }
    }

    return { success: true, reply: toReplyView(reply, user!.userId) };
  },
);
