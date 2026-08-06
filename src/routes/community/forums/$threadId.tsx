import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  createReply,
  getThread,
  markAcceptedReply,
  unvoteReply,
  unvoteThread,
  upvoteReply,
  upvoteThread,
  type ForumActionResult,
  type ReplyView,
  type ThreadDetail,
} from "~/lib/forums";
import { BottomNav } from "~/components/BottomNav";

export const Route = createFileRoute("/community/forums/$threadId")({
  component: ThreadDetailPage,
});

const CATEGORY_COLORS: Record<string, string> = {
  Toronto: "bg-brand-primary-700",
  Berlin: "bg-brand-coral-500",
  Dubai: "bg-brand-gold-500",
  Lisbon: "bg-brand-secondary-500",
  London: "bg-brand-primary-500",
  Sydney: "bg-brand-coral-700",
  General: "bg-neutral-400",
};

function categoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "bg-neutral-400";
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function timeAgo(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  } catch {
    return "";
  }
}

function UpvoteIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 ${filled ? "fill-current" : "fill-none stroke-current"}`}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function ThreadDetailPage() {
  const { threadId } = Route.useParams();
  const [data, setData] = useState<ThreadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<Record<string, boolean>>({});

  const load = async () => {
    setLoading(true);
    const result = (await getThread({ threadId })) as unknown as ThreadDetail | null;
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  const currentUser = data?.currentUser ?? null;
  const isAuthor = data?.isAuthor ?? false;
  const thread = data?.thread ?? null;
  const replies = useMemo(
    () => (data?.replies ?? []).slice().sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [data],
  );

  const requireLogin = (): boolean => {
    if (currentUser) return true;
    window.location.href = "/login";
    return false;
  };

  const toggleThreadVote = async () => {
    if (!thread) return;
    if (!requireLogin()) return;
    setBusy((b) => ({ ...b, tv: true }));
    try {
      const fn = thread.isUpvoted ? unvoteThread : upvoteThread;
      const fd = new FormData();
      fd.set("threadId", thread.id);
      const result = (await fn({ data: fd })) as unknown as ForumActionResult;
      if (result.success && result.thread && data) {
        setData({ ...data, thread: result.thread });
      }
    } finally {
      setBusy((b) => ({ ...b, tv: false }));
    }
  };

  const toggleReplyVote = async (reply: ReplyView) => {
    if (!requireLogin()) return;
    setBusy((b) => ({ ...b, [`rv_${reply.id}`]: true }));
    try {
      const fn = reply.isUpvoted ? unvoteReply : upvoteReply;
      const fd = new FormData();
      fd.set("replyId", reply.id);
      const result = (await fn({ data: fd })) as unknown as ForumActionResult;
      if (result.success && result.reply && data) {
        setData({
          ...data,
          replies: data.replies.map((r) =>
            r.id === reply.id ? (result.reply as ReplyView) : r,
          ),
        });
      }
    } finally {
      setBusy((b) => ({ ...b, [`rv_${reply.id}`]: false }));
    }
  };

  const handleAccept = async (reply: ReplyView) => {
    if (!requireLogin()) return;
    setBusy((b) => ({ ...b, [`ac_${reply.id}`]: true }));
    try {
      const fd = new FormData();
      fd.set("threadId", thread?.id ?? "");
      fd.set("replyId", reply.id);
      const result = (await markAcceptedReply({ data: fd })) as unknown as ForumActionResult;
      if (result.success && result.reply && data) {
        const updated = result.reply as ReplyView;
        setData({
          ...data,
          replies: data.replies.map((r) =>
            r.threadId === updated.threadId
              ? { ...r, isAcceptedAnswer: r.id === updated.id }
              : r,
          ),
        });
      } else if (result.error) {
        setError(result.error);
      }
    } finally {
      setBusy((b) => ({ ...b, [`ac_${reply.id}`]: false }));
    }
  };

  const handleReply = async () => {
    if (!thread) return;
    if (!requireLogin()) return;
    if (!replyText.trim()) {
      setError("Please write a reply first.");
      return;
    }
    setPosting(true);
    setError("");
    try {
      const fd = new FormData();
      fd.set("threadId", thread.id);
      fd.set("body", replyText);
      const result = (await createReply({ data: fd })) as unknown as ForumActionResult;
      if (result.success) {
        setReplyText("");
        await load();
      } else {
        setError(result.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8 sm:px-6">
        <div className="h-6 w-2/3 animate-pulse rounded bg-neutral-200" />
        <div className="h-24 animate-pulse rounded-2xl bg-neutral-100" />
        <div className="h-20 animate-pulse rounded-2xl bg-neutral-100" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6">
        <span className="text-3xl">🔍</span>
        <p className="mt-2 text-sm font-medium text-neutral-600">
          This thread doesn't exist or has been removed.
        </p>
        <Link
          to="/community/forums"
          className="mt-3 inline-block rounded-full bg-brand-primary-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-primary-500"
        >
          ← Back to forums
        </Link>
      </div>
    );
  }

  const acceptedReply = replies.find((r) => r.isAcceptedAnswer);

  return (
    <div className="pb-24">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-xs text-neutral-400">
          <Link to="/community" className="hover:text-brand-secondary-500">
            Community
          </Link>
          <span>/</span>
          <Link to="/community/forums" className="hover:text-brand-secondary-500">
            Forums
          </Link>
          <span>/</span>
          <span className="truncate text-neutral-500">{thread.category}</span>
        </div>

        {/* Thread */}
        <div className="card p-5">
          <div className="flex items-start gap-3">
            <div className="flex shrink-0 flex-col items-center gap-1 pt-1">
              <button
                onClick={toggleThreadVote}
                disabled={busy.tv}
                aria-label={thread.isUpvoted ? "Remove upvote" : "Upvote"}
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors disabled:opacity-50 ${
                  thread.isUpvoted
                    ? "bg-brand-primary-700 text-white"
                    : "text-neutral-400 hover:bg-brand-primary-50 hover:text-brand-primary-700"
                }`}
              >
                <UpvoteIcon filled={thread.isUpvoted} />
              </button>
              <span
                className={`text-sm font-bold ${
                  thread.isUpvoted ? "text-brand-primary-700" : "text-neutral-600"
                }`}
              >
                {thread.upvotes}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${categoryColor(thread.category)}`}
                >
                  {thread.category}
                </span>
                {thread.pinned && (
                  <span className="rounded-full bg-brand-gold-500/15 px-2 py-0.5 text-[10px] font-semibold text-brand-gold-700">
                    📌 Pinned
                  </span>
                )}
                {thread.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <h1 className="mt-2 text-xl font-bold leading-snug text-neutral-700">
                {thread.title}
              </h1>

              <p className="mt-1 text-[11px] text-neutral-400">
                Asked by{" "}
                <span className="font-semibold text-neutral-500">{thread.authorName}</span> ·{" "}
                {formatDate(thread.createdAt)}
              </p>

              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
                {thread.body}
              </p>
            </div>
          </div>
        </div>

        {/* Replies header */}
        <div className="mb-3 mt-6 flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-700">
            {replies.length} {replies.length === 1 ? "answer" : "answers"}
          </h2>
          {acceptedReply && (
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-semibold text-green-700">
              <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current">
                <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
              </svg>
              Answer accepted
            </span>
          )}
        </div>

        {/* Replies */}
        <div className="space-y-3">
          {replies.length === 0 && (
            <div className="card flex flex-col items-center gap-2 p-6 text-center">
              <span className="text-2xl">✍️</span>
              <p className="text-sm text-neutral-500">
                No answers yet — be the first to help this expat out!
              </p>
            </div>
          )}

          {replies.map((reply) => (
            <div
              key={reply.id}
              className={`card p-4 ${
                reply.isAcceptedAnswer ? "border-2 border-green-400" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex shrink-0 flex-col items-center gap-1 pt-1">
                  <button
                    onClick={() => toggleReplyVote(reply)}
                    disabled={busy[`rv_${reply.id}`]}
                    aria-label={reply.isUpvoted ? "Remove upvote" : "Upvote"}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-50 ${
                      reply.isUpvoted
                        ? "bg-brand-primary-700 text-white"
                        : "text-neutral-400 hover:bg-brand-primary-50 hover:text-brand-primary-700"
                    }`}
                  >
                    <UpvoteIcon filled={reply.isUpvoted} />
                  </button>
                  <span
                    className={`text-xs font-semibold ${
                      reply.isUpvoted ? "text-brand-primary-700" : "text-neutral-500"
                    }`}
                  >
                    {reply.upvotes}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-600">
                      {reply.authorName}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {timeAgo(reply.createdAt)}
                    </span>
                    {reply.isAcceptedAnswer && (
                      <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current">
                          <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                        </svg>
                        Accepted Answer
                      </span>
                    )}
                    {isAuthor && !reply.isAcceptedAnswer && (
                      <button
                        onClick={() => handleAccept(reply)}
                        disabled={busy[`ac_${reply.id}`]}
                        className="rounded-full border border-green-300 px-2 py-0.5 text-[10px] font-semibold text-green-700 transition-colors hover:bg-green-50 disabled:opacity-50"
                      >
                        {busy[`ac_${reply.id}`] ? "…" : "✓ Mark as answer"}
                      </button>
                    )}
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
                    {reply.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply form */}
        <div className="card mt-6 p-4">
          <h3 className="mb-2 text-sm font-bold text-neutral-700">Your answer</h3>
          {currentUser ? (
            <>
              <textarea
                className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700 outline-none transition-colors focus:border-brand-secondary-500 focus:bg-white"
                rows={4}
                placeholder="Share what worked for you, or ask a follow-up question…"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              {error && (
                <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                  {error}
                </p>
              )}
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleReply}
                  disabled={posting}
                  className="rounded-full bg-brand-primary-700 px-5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-primary-500 disabled:opacity-60"
                >
                  {posting ? "Posting…" : "Post answer"}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-xl bg-neutral-50 p-4 text-center">
              <p className="text-sm text-neutral-500">
                Sign in to join the conversation and earn points.
              </p>
              <Link
                to="/signup"
                className="rounded-full bg-brand-primary-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-primary-500"
              >
                Create an account
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom tab bar */}
      <BottomNav currentTab="connect" />
    </div>
  );
}
