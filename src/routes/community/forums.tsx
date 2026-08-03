import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  createThread,
  getForumsData,
  unvoteThread,
  upvoteThread,
  FORUM_CATEGORIES,
  type ForumActionResult,
  type ThreadView,
} from "~/lib/forums";
import { BottomNav } from "~/components/BottomNav";

export const Route = createFileRoute("/community/forums")({
  component: ForumsPage,
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
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
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

// =============================================================================
// New Thread Modal
// =============================================================================

function NewThreadModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (thread: ThreadView) => void;
}) {
  const [form, setForm] = useState({ title: "", body: "", category: "", tags: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      setError("Please add a title and a question.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      fd.set("title", form.title);
      fd.set("body", form.body);
      fd.set("category", form.category || "General");
      fd.set("tags", form.tags);
      const result = (await createThread(fd)) as unknown as ForumActionResult;
      if (result.success && result.thread) {
        onCreated(result.thread);
      } else {
        setError(result.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700 outline-none transition-colors focus:border-brand-secondary-500 focus:bg-white";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-700">Start a new thread</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Title</label>
            <input
              className={inputCls}
              placeholder="e.g. How hard is it to find a flat in Berlin?"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Question or topic</label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={4}
              placeholder="Share your question, experience or tip for the community…"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Category</label>
              <select
                className={inputCls}
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                <option value="">General</option>
                {FORUM_CATEGORIES.filter((c) => c !== "General").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">
                Tags (comma-separated)
              </label>
              <input
                className={inputCls}
                placeholder="visa, housing"
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              />
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={onClose}
              className="rounded-full border border-neutral-200 px-4 py-1.5 text-xs font-medium text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-700"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={submitting}
              className="rounded-full bg-brand-primary-700 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-primary-500 disabled:opacity-60"
            >
              {submitting ? "Posting…" : "Post thread"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Page
// =============================================================================

function ForumsPage() {
  const [data, setData] = useState<{
    threads: ThreadView[];
    currentUser: { id: string; name: string } | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState<"recent" | "upvoted">("recent");
  const [showNewThread, setShowNewThread] = useState(false);
  const [busy, setBusy] = useState<Record<string, boolean>>({});

  const load = async (category: string) => {
    setLoading(true);
    const result = (await getForumsData({
      category: category === "All" ? null : category,
    })) as unknown as {
      threads: ThreadView[];
      currentUser: { id: string; name: string } | null;
    };
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    load(activeCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  const currentUser = data?.currentUser ?? null;

  const visibleThreads = useMemo(() => {
    const threads = data?.threads ?? [];
    const sorted = [...threads].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (sort === "upvoted") return b.upvotes - a.upvotes;
      return b.createdAt.localeCompare(a.createdAt);
    });
    return sorted;
  }, [data, sort]);

  const requireLogin = (): boolean => {
    if (currentUser) return true;
    window.location.href = "/login";
    return false;
  };

  const handleUpvote = async (thread: ThreadView) => {
    if (!requireLogin()) return;
    setBusy((b) => ({ ...b, [`u_${thread.id}`]: true }));
    try {
      const fn = thread.isUpvoted ? unvoteThread : upvoteThread;
      const fd = new FormData();
      fd.set("threadId", thread.id);
      const result = (await fn(fd)) as unknown as ForumActionResult;
      if (result.success && result.thread) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                threads: prev.threads.map((t) =>
                  t.id === thread.id ? (result.thread as ThreadView) : t,
                ),
              }
            : prev,
        );
      }
    } finally {
      setBusy((b) => ({ ...b, [`u_${thread.id}`]: false }));
    }
  };

  const handleCreated = (thread: ThreadView) => {
    setData((prev) => (prev ? { ...prev, threads: [thread, ...prev.threads] } : prev));
    setShowNewThread(false);
    setActiveCategory("All");
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white px-4 pb-2 pt-6 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <Link
                to="/community"
                className="text-xs font-medium text-brand-secondary-500 hover:text-brand-secondary-700"
              >
                ← Community
              </Link>
              <h1 className="mt-1 text-2xl font-bold text-neutral-700">Forums</h1>
              <p className="text-xs text-neutral-400">
                Ask questions, share tips and get answers from expats worldwide
              </p>
            </div>
            <button
              onClick={() => {
                if (!requireLogin()) return;
                setShowNewThread(true);
              }}
              className="rounded-full bg-brand-primary-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-primary-500"
            >
              + New Thread
            </button>
          </div>

          {/* Category chips */}
          <div className="mb-3 flex gap-2 overflow-x-auto hide-scrollbar">
            {["All", ...FORUM_CATEGORIES].map((chip) => (
              <button
                key={chip}
                onClick={() => setActiveCategory(chip)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  activeCategory === chip
                    ? "bg-brand-primary-700 text-white"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Sort toggle */}
          <div className="mb-2 flex items-center gap-1">
            {[
              { key: "recent", label: "Recent" },
              { key: "upvoted", label: "Most Upvoted" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSort(opt.key as "recent" | "upvoted")}
                className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                  sort === opt.key
                    ? "bg-brand-secondary-100 text-brand-secondary-700"
                    : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mx-auto max-w-6xl space-y-3 px-4 py-6 sm:px-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="card h-24 animate-pulse bg-neutral-100" />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-6xl space-y-3 px-4 py-6 sm:px-6">
          {visibleThreads.length === 0 ? (
            <div className="card flex flex-col items-center gap-2 p-8 text-center">
              <span className="text-3xl">💬</span>
              <p className="text-sm font-medium text-neutral-600">
                No threads in this category yet — start the conversation!
              </p>
              <button
                onClick={() => {
                  if (!requireLogin()) return;
                  setShowNewThread(true);
                }}
                className="mt-1 rounded-full bg-brand-primary-700 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-primary-500"
              >
                + Start a thread
              </button>
            </div>
          ) : (
            visibleThreads.map((thread) => (
              <div key={thread.id} className="card flex items-start gap-3 p-4">
                {/* Upvote column */}
                <div className="flex shrink-0 flex-col items-center gap-0.5 pt-0.5">
                  <button
                    onClick={() => handleUpvote(thread)}
                    disabled={busy[`u_${thread.id}`]}
                    aria-label={thread.isUpvoted ? "Remove upvote" : "Upvote"}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-50 ${
                      thread.isUpvoted
                        ? "bg-brand-primary-700 text-white"
                        : "text-neutral-400 hover:bg-brand-primary-50 hover:text-brand-primary-700"
                    }`}
                  >
                    <UpvoteIcon filled={thread.isUpvoted} />
                  </button>
                  <span
                    className={`text-xs font-semibold ${
                      thread.isUpvoted ? "text-brand-primary-700" : "text-neutral-500"
                    }`}
                  >
                    {thread.upvotes}
                  </span>
                </div>

                {/* Thread content */}
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
                  <Link
                    to="/community/forums/$threadId"
                    params={{ threadId: thread.id }}
                    className="mt-1.5 block text-sm font-bold text-neutral-700 transition-colors hover:text-brand-primary-700"
                  >
                    {thread.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{thread.body}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-400">
                    <span className="font-medium text-neutral-500">{thread.authorName}</span>
                    <span>·</span>
                    <span>{timeAgo(thread.createdAt)}</span>
                    <span>·</span>
                    <span>
                      💬 {thread.replyCount} {thread.replyCount === 1 ? "reply" : "replies"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showNewThread && (
        <NewThreadModal
          onClose={() => setShowNewThread(false)}
          onCreated={handleCreated}
        />
      )}

      {/* Bottom tab bar */}
      <BottomNav currentTab="connect" />
    </div>
  );
}
