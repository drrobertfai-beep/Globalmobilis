import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BottomNav } from "~/components/BottomNav";
import {
  CATEGORY_LABELS,
  DESTINATION_FLAGS,
  PHASE_META,
  TIMELINE_DESTINATIONS,
  deleteTimeline,
  generateTimeline,
  getTimelineData,
  updateTask,
  type TimelineCategory,
  type TimelineData,
  type TimelineDetail,
  type TimelinePhase,
  type TimelineTaskView,
} from "~/lib/timeline";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Relocation Timeline — Global Mobilis" },
      {
        name: "description",
        content:
          "Plan your move abroad step by step — visas, housing, jobs, and more — with Global Mobilis relocation timelines.",
      },
    ],
  }),
  component: TimelinePage,
});

const CATEGORY_COLORS: Record<TimelineCategory, string> = {
  visa: "bg-brand-primary-50 text-brand-primary-700",
  housing: "bg-brand-gold-100 text-brand-gold-700",
  banking: "bg-brand-secondary-100 text-brand-secondary-700",
  healthcare: "bg-brand-coral-100 text-brand-coral-700",
  legal: "bg-neutral-100 text-neutral-600",
  transport: "bg-blue-50 text-blue-700",
  utilities: "bg-purple-50 text-purple-700",
  education: "bg-amber-50 text-amber-700",
  community: "bg-green-50 text-green-700",
};

const MS_PER_DAY = 86_400_000;

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const target = new Date(`${dateStr}T00:00:00Z`);
  return Math.round((target.getTime() - today.getTime()) / MS_PER_DAY);
}

function phaseRange(moveDate: string, fromDays: number, toDays: number): string {
  return `${formatDate(addDays(moveDate, fromDays))} – ${formatDate(addDays(moveDate, toDays))}`;
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

// =============================================================================
// Setup flow (logged in, no timeline yet)
// =============================================================================

function SetupFlow({ onCreated }: { onCreated: (tl: TimelineDetail) => void }) {
  const [destination, setDestination] = useState("Toronto");
  const [moveDate, setMoveDate] = useState(() => addDays(new Date().toISOString().slice(0, 10), 60));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      fd.set("destination", destination);
      fd.set("moveDate", moveDate);
      const result = (await generateTimeline(fd)) as any;
      if (result.success && result.timeline) {
        onCreated(result.timeline as TimelineDetail);
      } else {
        setError(result.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:px-6">
      <div className="rounded-2xl p-6 text-white" style={{ background: "var(--gm-gradient-brand)" }}>
        <h1 className="mb-2 text-2xl font-bold">Plan your move, step by step</h1>
        <p className="text-sm text-white/85">
          Pick a destination and your move date — we'll build a personalized relocation checklist
          that tells you exactly what to do, and when.
        </p>
      </div>

      {/* Phase preview */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PHASE_META.map((p) => (
          <div key={p.id} className="card flex items-center gap-2 p-3">
            <span className="text-xl">{p.icon}</span>
            <div>
              <div className="text-xs font-bold text-neutral-700">{p.label}</div>
              <div className="text-[10px] text-neutral-500">
                {Math.abs(p.fromDays) >= 90
                  ? "90+ days out"
                  : `${Math.abs(p.fromDays)}–${Math.abs(p.toDays)} days`}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleGenerate} className="card space-y-4 p-5">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
            Where are you moving to?
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 outline-none transition-colors focus:border-brand-primary-500"
          >
            {TIMELINE_DESTINATIONS.map((d) => (
              <option key={d} value={d}>
                {DESTINATION_FLAGS[d] ?? "🌍"} {d}
                {d === "Generic" ? " (custom destination)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
            When are you moving?
          </label>
          <input
            type="date"
            required
            value={moveDate}
            min={addDays(new Date().toISOString().slice(0, 10), -30)}
            onChange={(e) => setMoveDate(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 outline-none transition-colors focus:border-brand-primary-500"
          />
          <p className="mt-1.5 text-xs text-neutral-500">
            Tasks are scheduled around this date — before-you-go prep, arrival week, and settling in.
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-brand-coral-100 px-3 py-2 text-sm text-brand-coral-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-brand-primary-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-500 disabled:opacity-60"
        >
          {submitting ? "Building your timeline…" : "Generate My Timeline →"}
        </button>
      </form>
    </div>
  );
}

// =============================================================================
// Task card
// =============================================================================

function TaskCard({
  task,
  moveDate,
  onToggle,
  onSaveNotes,
  busy,
}: {
  task: TimelineTaskView;
  moveDate: string;
  onToggle: (t: TimelineTaskView) => void;
  onSaveNotes: (t: TimelineTaskView, notes: string) => Promise<boolean>;
  busy: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [notesDraft, setNotesDraft] = useState(task.notes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [savedNote, setSavedNote] = useState(false);

  const targetDate = addDays(moveDate, task.daysBeforeMove);
  const diff = daysUntil(targetDate);

  let timing: { text: string; cls: string };
  if (task.completed) {
    timing = {
      text: task.completedAt
        ? `Done ${formatDate(task.completedAt.slice(0, 10))}`
        : "Done",
      cls: "text-green-600",
    };
  } else if (diff < 0) {
    timing = { text: `${-diff}d overdue`, cls: "text-brand-coral-700" };
  } else if (diff === 0) {
    timing = { text: "Due today", cls: "text-orange-600" };
  } else {
    timing = { text: `in ${diff} days`, cls: "text-neutral-500" };
  }

  const handleNotesSave = async () => {
    setSavingNotes(true);
    const ok = await onSaveNotes(task, notesDraft);
    setSavingNotes(false);
    if (ok) {
      setSavedNote(true);
      setTimeout(() => setSavedNote(false), 1600);
    }
  };

  return (
    <div
      className={`rounded-xl border bg-white transition-all ${
        task.completed ? "border-green-200" : "border-neutral-200"
      }`}
    >
      <div className="flex items-start gap-3 p-3.5">
        {/* Custom checkbox */}
        <button
          type="button"
          onClick={() => onToggle(task)}
          disabled={busy}
          aria-label={task.completed ? "Mark as not done" : "Mark as done"}
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all disabled:opacity-60 ${
            task.completed
              ? "border-brand-primary-700 bg-brand-primary-700 text-white"
              : "border-neutral-300 bg-white text-transparent hover:border-brand-primary-500"
          }`}
        >
          <CheckIcon className="h-3.5 w-3.5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`text-sm font-semibold ${
                task.completed ? "text-neutral-400 line-through" : "text-neutral-700"
              }`}
            >
              {task.title}
            </h4>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Collapse details" : "Expand details"}
              className={`shrink-0 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <p className={`mt-0.5 text-xs ${task.completed ? "text-neutral-400 line-through" : "text-neutral-500"}`}>
            {task.description.length > 110
              ? `${task.description.slice(0, 110)}…`
              : task.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_COLORS[task.category]}`}>
              {CATEGORY_LABELS[task.category]}
            </span>
            <span className={`text-[10px] font-medium ${timing.cls}`}>
              {task.completed ? "✓" : "🗓"} {timing.text} · {formatDate(targetDate)}
            </span>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-neutral-100 px-4 py-3">
          <p className="text-sm leading-relaxed text-neutral-600">{task.description}</p>

          {task.tips && (
            <div className="mt-3 flex gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <span>💡</span>
              <p>{task.tips}</p>
            </div>
          )}

          <div className="mt-2 text-xs text-neutral-500">
            Typically takes ~{task.durationDays} day{task.durationDays !== 1 ? "s" : ""}.
          </div>

          {task.externalLinks.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {task.externalLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-brand-primary-50 px-3 py-1 text-xs font-medium text-brand-primary-700 hover:bg-brand-primary-100"
                >
                  🔗 {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Notes */}
          <div className="mt-3">
            <label className="mb-1 block text-xs font-semibold text-neutral-500">Add a note</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="e.g. booked appointment for March 3"
                className="min-w-0 flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700 outline-none focus:border-brand-primary-500"
              />
              <button
                type="button"
                onClick={handleNotesSave}
                disabled={savingNotes}
                className="shrink-0 rounded-lg bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-200 disabled:opacity-60"
              >
                {savingNotes ? "…" : savedNote ? "✓ Saved" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Active timeline view
// =============================================================================

function TimelineView({
  timeline,
  onChanged,
}: {
  timeline: TimelineDetail;
  onChanged: (tl: TimelineDetail) => void;
}) {
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [deleting, setDeleting] = useState(false);

  const moveDate = timeline.moveDate;
  const moveDiff = daysUntil(moveDate);
  const moveLabel =
    moveDiff > 0
      ? `in ${moveDiff} days`
      : moveDiff === 0
        ? "today"
        : `${-moveDiff} days ago`;

  const byPhase = useMemo(() => {
    const map = new Map<TimelinePhase, TimelineTaskView[]>();
    for (const phase of PHASE_META) map.set(phase.id, []);
    for (const t of timeline.tasks) {
      const arr = map.get(t.phase) ?? [];
      arr.push(t);
      map.set(t.phase, arr);
    }
    return map;
  }, [timeline]);

  const handleToggle = async (task: TimelineTaskView) => {
    setBusy((b) => ({ ...b, [task.id]: true }));
    try {
      const fd = new FormData();
      fd.set("taskId", task.id);
      fd.set("completed", String(!task.completed));
      const result = (await updateTask(fd)) as any;
      if (result.success && result.timeline) {
        onChanged(result.timeline as TimelineDetail);
      }
    } finally {
      setBusy((b) => ({ ...b, [task.id]: false }));
    }
  };

  const handleSaveNotes = async (task: TimelineTaskView, notes: string): Promise<boolean> => {
    try {
      const fd = new FormData();
      fd.set("taskId", task.id);
      fd.set("notes", notes);
      const result = (await updateTask(fd)) as any;
      if (result.success && result.timeline) {
        onChanged(result.timeline as TimelineDetail);
        return true;
      }
    } catch {
      // fall through
    }
    return false;
  };

  const handleDelete = async () => {
    if (!window.confirm("Reset your timeline? This removes all progress and notes.")) return;
    setDeleting(true);
    try {
      const result = (await deleteTimeline()) as any;
      if (result.success) onChanged(null as unknown as TimelineDetail);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6">
      {/* Header + progress */}
      <div className="rounded-2xl p-6 text-white" style={{ background: "var(--gm-gradient-brand)" }}>
        <div className="mb-1 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            {timeline.destinationFlag} {timeline.destination}
          </h1>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            {moveLabel}
          </span>
        </div>
        <p className="text-sm text-white/80">Moving {formatDate(moveDate)}</p>

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs font-medium text-white/85">
            <span>
              {timeline.progress.completed} of {timeline.progress.total} tasks done
            </span>
            <span>{timeline.progress.percentage}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-gold-500 to-brand-coral-500 transition-all duration-500"
              style={{ width: `${timeline.progress.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-6">
        {PHASE_META.map((phase) => {
          const tasks = byPhase.get(phase.id) ?? [];
          if (tasks.length === 0) return null;
          const done = tasks.filter((t) => t.completed).length;
          return (
            <section key={phase.id}>
              <div className="mb-3 flex items-center gap-2.5">
                <span className={`h-3 w-3 shrink-0 rounded-full ${phase.dot}`} />
                <h2 className={`text-sm font-bold uppercase tracking-wide ${phase.text}`}>
                  {phase.icon} {phase.label}
                </h2>
                <span className="ml-auto text-xs text-neutral-400">
                  {phaseRange(moveDate, phase.fromDays, phase.toDays)}
                </span>
                <span className="text-xs font-semibold text-neutral-500">
                  {done}/{tasks.length}
                </span>
              </div>

              {/* Timeline connector */}
              <div className="relative ml-1.5 space-y-2.5 border-l-2 border-neutral-200 pl-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    moveDate={moveDate}
                    onToggle={handleToggle}
                    onSaveNotes={handleSaveNotes}
                    busy={!!busy[task.id]}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex justify-center pb-4">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-full border border-neutral-200 px-5 py-2 text-xs font-medium text-neutral-500 transition-colors hover:border-brand-coral-500 hover:text-brand-coral-700 disabled:opacity-60"
        >
          {deleting ? "Resetting…" : "Reset timeline"}
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// Page
// =============================================================================

function TimelinePage() {
  const [data, setData] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const result = (await getTimelineData()) as unknown as TimelineData;
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const currentUser = data?.currentUser ?? null;
  const timeline = data?.timeline ?? null;

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white px-4 pb-4 pt-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-700">Relocation Timeline</h1>
            <p className="text-sm text-neutral-500">Your personalized move checklist</p>
          </div>
          {timeline && (
            <Link
              to="/dashboard"
              className="rounded-full bg-neutral-100 px-4 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-200"
            >
              ← Dashboard
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
          <div className="h-32 animate-pulse rounded-2xl bg-neutral-100" />
          <div className="h-24 animate-pulse rounded-2xl bg-neutral-100" />
          <div className="h-24 animate-pulse rounded-2xl bg-neutral-100" />
        </div>
      ) : !currentUser ? (
        /* Signed out */
        <div className="mx-auto max-w-2xl space-y-6 px-4 py-10 text-center">
          <span className="text-5xl">📋</span>
          <h2 className="text-xl font-bold text-neutral-700">
            Your move, organized
          </h2>
          <p className="mx-auto max-w-md text-sm text-neutral-500">
            Sign in to build a personalized relocation checklist — destination-specific tasks,
            timed to your move date, from visa paperwork to settling in.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/login"
              className="rounded-full bg-brand-primary-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-500"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-semibold text-neutral-700 hover:border-brand-primary-500"
            >
              Create Account
            </Link>
          </div>
        </div>
      ) : !timeline ? (
        <SetupFlow onCreated={(tl) => setData((prev) => (prev ? { ...prev, timeline: tl } : prev))} />
      ) : (
        <TimelineView
          timeline={timeline}
          onChanged={(tl) => setData((prev) => (prev ? { ...prev, timeline: tl } : prev))}
        />
      )}

      <BottomNav currentTab="timeline" />
    </div>
  );
}
