import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  createGroup,
  createEvent,
  getCommunityData,
  joinGroup,
  leaveGroup,
  rsvpToEvent,
  type CommunityData,
  type EventView,
  type GroupView,
} from "~/lib/community";
import { listThreads, type ThreadView } from "~/lib/forums";
import { BottomNav } from "~/components/BottomNav";

export const Route = createFileRoute("/community/")({
  component: CommunityPage,
});

const GROUP_TYPE_COLORS: Record<string, string> = {
  Professional: "bg-brand-primary-500",
  Cultural: "bg-brand-coral-500",
  Business: "bg-brand-gold-500",
  Social: "bg-brand-secondary-500",
  Support: "bg-brand-coral-700",
};

const GROUP_ICONS: Record<string, string> = {
  Professional: "💼",
  Cultural: "🎨",
  Business: "🚀",
  Social: "🌍",
  Support: "👪",
};

const GROUP_TYPES = Object.keys(GROUP_TYPE_COLORS);

function formatMemberCount(count: number): string {
  if (count >= 1000) {
    const k = (count / 1000).toFixed(1).replace(/\.0$/, "");
    return `${k}k`;
  }
  return String(count);
}

function formatEventDate(date: string): { day: string; weekday: string } {
  try {
    const d = new Date(`${date}T00:00:00`);
    return {
      day: String(d.getDate()),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    };
  } catch {
    return { day: date.slice(-2), weekday: date.slice(0, 3) };
  }
}

// =============================================================================
// Modals
// =============================================================================

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-700">{title}</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CreateGroupModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (group: GroupView) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "Community",
    city: "",
    country: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const result = (await createGroup({
        ...form,
        icon: GROUP_ICONS[form.type] || "🌍",
        color: GROUP_TYPE_COLORS[form.type] || "bg-brand-secondary-500",
      })) as any;
      if (result.success) {
        onCreated(result.group as GroupView);
      } else {
        setError(result.error || "Could not create group.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-primary-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20";

  return (
    <Modal title="Create a group" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Group name *</label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Expats in Amsterdam"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Type</label>
          <div className="flex flex-wrap gap-1.5">
            {GROUP_TYPES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setForm({ ...form, type: t })}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  form.type === t
                    ? "bg-brand-primary-700 text-white"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                }`}
              >
                {GROUP_ICONS[t]} {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Description</label>
          <textarea
            className={inputClass}
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What is this group about?"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">City</label>
            <input
              className={inputClass}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Amsterdam"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Country</label>
            <input
              className={inputClass}
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder="Netherlands"
            />
          </div>
        </div>
        {error && <p className="rounded-lg bg-red-50 p-2.5 text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-primary-500 disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create group"}
        </button>
      </form>
    </Modal>
  );
}

function CreateEventModal({
  adminGroups,
  onClose,
  onCreated,
}: {
  adminGroups: GroupView[];
  onClose: () => void;
  onCreated: (event: EventView) => void;
}) {
  const [form, setForm] = useState({
    groupId: adminGroups[0]?.id || "",
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const result = (await createEvent(form)) as any;
      if (result.success) {
        onCreated(result.event as EventView);
      } else {
        setError(result.error || "Could not create event.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-primary-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20";

  return (
    <Modal title="Create an event" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Hosted by *</label>
          <select
            className={inputClass}
            value={form.groupId}
            onChange={(e) => setForm({ ...form, groupId: e.target.value })}
            required
          >
            {adminGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Event title *</label>
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Coffee Meetup — August"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Description</label>
          <textarea
            className={inputClass}
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What's happening at this event?"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Date *</label>
            <input
              type="date"
              className={inputClass}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Time *</label>
            <input
              type="time"
              className={inputClass}
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              required
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Location</label>
          <input
            className={inputClass}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. Central Library, Room 2"
          />
        </div>
        {error && <p className="rounded-lg bg-red-50 p-2.5 text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand-secondary-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-secondary-700 disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create event"}
        </button>
      </form>
    </Modal>
  );
}

// =============================================================================
// Page
// =============================================================================

function CommunityPage() {
  const [data, setData] = useState<CommunityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChip, setActiveChip] = useState("All");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [threads, setThreads] = useState<ThreadView[]>([]);

  const load = async () => {
    setLoading(true);
    const [commResult, threadsResult] = await Promise.all([
      getCommunityData(),
      listThreads({ category: null }),
    ]);
    setData(commResult as unknown as CommunityData);
    setThreads(threadsResult as unknown as ThreadView[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const currentUser = data?.currentUser ?? null;

  const adminGroups = useMemo(
    () => (data?.groups ?? []).filter((g) => g.isAdmin),
    [data],
  );

  const yourGroups = useMemo(
    () => (data?.groups ?? []).filter((g) => g.isMember),
    [data],
  );

  const visibleGroups = useMemo(() => {
    if (!data) return [];
    if (activeChip === "Your Groups" || activeChip === "Following") {
      return data.groups.filter((g) => g.isMember);
    }
    return data.groups;
  }, [data, activeChip]);

  const recentThreads = useMemo(() => {
    return [...threads]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5);
  }, [threads]);

  const requireLogin = (): boolean => {
    if (currentUser) return true;
    window.location.href = "/login";
    return false;
  };

  const handleJoin = async (group: GroupView) => {
    if (!requireLogin()) return;
    setBusy((b) => ({ ...b, [`j_${group.id}`]: true }));
    try {
      const result = (await joinGroup({ groupId: group.id })) as any;
      if (result.success && result.group) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                groups: prev.groups.map((g) => (g.id === group.id ? (result.group as GroupView) : g)),
              }
            : prev,
        );
      }
    } finally {
      setBusy((b) => ({ ...b, [`j_${group.id}`]: false }));
    }
  };

  const handleLeave = async (group: GroupView) => {
    if (!requireLogin()) return;
    setBusy((b) => ({ ...b, [`j_${group.id}`]: true }));
    try {
      const result = (await leaveGroup({ groupId: group.id })) as any;
      if (result.success && result.group) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                groups: prev.groups.map((g) => (g.id === group.id ? (result.group as GroupView) : g)),
              }
            : prev,
        );
      }
    } finally {
      setBusy((b) => ({ ...b, [`j_${group.id}`]: false }));
    }
  };

  const handleRsvp = async (event: EventView) => {
    if (!requireLogin()) return;
    setBusy((b) => ({ ...b, [`r_${event.id}`]: true }));
    try {
      const result = (await rsvpToEvent({ eventId: event.id })) as any;
      if (result.success && result.event) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                events: prev.events.map((e) => (e.id === event.id ? (result.event as EventView) : e)),
              }
            : prev,
        );
      }
    } finally {
      setBusy((b) => ({ ...b, [`r_${event.id}`]: false }));
    }
  };

  const handleGroupCreated = (group: GroupView) => {
    setData((prev) => (prev ? { ...prev, groups: [group, ...prev.groups] } : prev));
    setShowCreateGroup(false);
  };

  const handleEventCreated = (event: EventView) => {
    setData((prev) => (prev ? { ...prev, events: [...prev.events, event] } : prev));
    setShowCreateEvent(false);
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white px-4 pb-2 pt-6 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-neutral-700">Community</h1>
            <button
              onClick={() => {
                if (!requireLogin()) return;
                setShowCreateGroup(true);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary-50 text-brand-primary-700 transition-colors hover:bg-brand-primary-100"
              aria-label="Create group"
            >
              <span className="text-lg">+</span>
            </button>
          </div>
          <div className="mb-4 flex gap-2 overflow-x-auto hide-scrollbar">
            {["All", "Your Groups", "Forums", "Events"].map((chip) => (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  activeChip === chip
                    ? "bg-brand-primary-700 text-white"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-32 rounded bg-neutral-200" />
            <div className="flex gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-32 w-48 rounded-2xl bg-neutral-100" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6">
          {/* Your Groups */}
          {(activeChip === "All" || activeChip === "Your Groups") && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-neutral-700">Your groups</h2>
              {yourGroups.length === 0 ? (
                <div className="card flex flex-col items-center gap-2 p-6 text-center">
                  <span className="text-2xl">🌐</span>
                  <p className="text-sm text-neutral-500">
                    {currentUser
                      ? "You haven't joined any groups yet. Discover one below!"
                      : "Sign in to join groups and connect with expats worldwide."}
                  </p>
                  {!currentUser && (
                    <Link
                      to="/signup"
                      className="mt-1 rounded-full bg-brand-primary-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-primary-500"
                    >
                      Create an account
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                  {yourGroups.map((group) => (
                    <div key={group.id} className="card w-48 shrink-0 p-4">
                      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg text-white ${group.color}`}>
                        {group.icon}
                      </div>
                      <h3 className="text-sm font-bold text-neutral-700">{group.name}</h3>
                      <p className="text-xs text-neutral-500">{formatMemberCount(group.memberCount)} members</p>
                      <button
                        onClick={() => handleLeave(group)}
                        disabled={busy[`j_${group.id}`]}
                        className="mt-3 w-full rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-700 disabled:opacity-60"
                      >
                        {busy[`j_${group.id}`] ? "..." : "Leave"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Discover Groups */}
          {(activeChip === "All" || activeChip === "Your Groups") && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-neutral-700">Discover groups near you</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {visibleGroups.map((group) => (
                <div key={group.id} className="card flex items-center gap-3 p-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg text-white ${group.color}`}>
                    {group.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-sm font-bold text-neutral-700">{group.name}</h3>
                      {group.isAdmin && (
                        <span className="shrink-0 rounded-full bg-brand-gold-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-brand-gold-700">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-neutral-500">
                      {group.type} · {formatMemberCount(group.memberCount)} members
                    </p>
                    {group.city && (
                      <p className="truncate text-[11px] text-neutral-400">
                        {group.city}
                        {group.country ? `, ${group.country}` : ""}
                      </p>
                    )}
                  </div>
                  {group.isMember ? (
                    <button
                      onClick={() => handleLeave(group)}
                      disabled={busy[`j_${group.id}`]}
                      className="shrink-0 rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-700 disabled:opacity-60"
                    >
                      {busy[`j_${group.id}`] ? "..." : "Leave"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoin(group)}
                      disabled={busy[`j_${group.id}`]}
                      className="shrink-0 rounded-full bg-brand-secondary-100 px-3 py-1 text-xs font-medium text-brand-secondary-700 transition-colors hover:bg-brand-secondary-300 disabled:opacity-60"
                    >
                      {busy[`j_${group.id}`] ? "..." : "Join"}
                    </button>
                  )}
                </div>
              ))}
              {visibleGroups.length === 0 && (
                <p className="text-sm text-neutral-400">No groups match this filter yet.</p>
              )}
            </div>
            </section>
          )}

          {/* Forums preview */}
          {(activeChip === "All" || activeChip === "Forums") && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-neutral-700">Latest forum threads</h2>
                <Link
                  to="/community/forums"
                  className="text-xs font-semibold text-brand-secondary-500 hover:text-brand-secondary-700"
                >
                  View all forums →
                </Link>
              </div>
              {recentThreads.length === 0 ? (
                <div className="card flex flex-col items-center gap-2 p-6 text-center">
                  <span className="text-2xl">💬</span>
                  <p className="text-sm text-neutral-500">
                    No threads yet — start the conversation!
                  </p>
                  <Link
                    to="/community/forums"
                    className="mt-1 rounded-full bg-brand-primary-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-primary-500"
                  >
                    Browse forums
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentThreads.map((thread) => (
                    <Link
                      key={thread.id}
                      to="/community/forums/$threadId"
                      params={{ threadId: thread.id }}
                      className="card flex items-center gap-3 p-3 transition-colors hover:border-brand-secondary-300"
                    >
                      <div className="flex shrink-0 flex-col items-center gap-0.5 rounded-xl bg-neutral-50 px-2.5 py-1.5">
                        <span className="text-sm font-bold text-brand-primary-700">
                          {thread.upvotes}
                        </span>
                        <span className="text-[9px] font-medium text-neutral-400">votes</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-neutral-700">
                          {thread.title}
                        </p>
                        <p className="truncate text-[11px] text-neutral-400">
                          <span className="font-medium text-neutral-500">{thread.authorName}</span>
                          {" · "}
                          {thread.category}
                          {" · "}
                          💬 {thread.replyCount}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Upcoming Events */}
          {(activeChip === "All" || activeChip === "Events") && (
            <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-700">Upcoming events</h2>
              {adminGroups.length > 0 && (
                <button
                  onClick={() => setShowCreateEvent(true)}
                  className="rounded-full bg-brand-secondary-500 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-secondary-700"
                >
                  + Create Event
                </button>
              )}
            </div>
            <div className="space-y-3">
              {(data?.events ?? []).map((event) => {
                const { day, weekday } = formatEventDate(event.date);
                return (
                  <div key={event.id} className="card flex items-center gap-4 p-4">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-primary-50 text-center">
                      <span className="text-xs font-bold text-brand-primary-700">{day}</span>
                      <span className="text-[10px] text-neutral-500">{weekday}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-neutral-700">{event.title}</h3>
                      <p className="truncate text-xs text-neutral-500">
                        {event.groupName} · {event.time}
                        {event.location ? ` · ${event.location}` : ""}
                      </p>
                      <p className="text-xs text-neutral-400">{event.attendeeCount} going</p>
                    </div>
                    <button
                      onClick={() => handleRsvp(event)}
                      disabled={busy[`r_${event.id}`]}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
                        event.isGoing
                          ? "border border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                          : "bg-brand-secondary-500 text-white hover:bg-brand-secondary-700"
                      }`}
                    >
                      {busy[`r_${event.id}`]
                        ? "..."
                        : event.isGoing
                          ? "Not going"
                          : "Going"}
                    </button>
                  </div>
                );
              })}
              {(data?.events ?? []).length === 0 && (
                <p className="text-sm text-neutral-400">No upcoming events yet — create one!</p>
              )}
            </div>
            </section>
          )}
        </div>
      )}

      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} onCreated={handleGroupCreated} />}
      {showCreateEvent && adminGroups.length > 0 && (
        <CreateEventModal
          adminGroups={adminGroups}
          onClose={() => setShowCreateEvent(false)}
          onCreated={handleEventCreated}
        />
      )}

      {/* Bottom tab bar */}
      <BottomNav currentTab="connect" />
    </div>
  );
}
