/**
 * Global Mobilis — Community API
 *
 * Server functions for expat groups and events: list, create, join/leave,
 * RSVP. Persistence is JSON files under <project>/data/ (groups.json,
 * events.json). The current user is identified from the session cookie
 * (JWT issued by src/lib/auth.ts).
 */
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SESSION_COOKIE, verifySessionToken } from "./auth";
import type { AuthSession } from "./auth";

// =============================================================================
// Types
// =============================================================================

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  type: string;
  icon: string;
  color: string;
  city: string;
  country: string;
  /** Fictional seed members (for rich counts before real users join) */
  baseMembers: number;
  /** Real user ids that have joined via the app */
  memberIds: string[];
  adminIds: string[];
  createdBy: string;
  createdAt: string;
}

export interface CommunityEvent {
  id: string;
  groupId: string;
  groupName: string;
  title: string;
  description: string;
  date: string; // yyyy-mm-dd
  time: string;
  location: string;
  baseAttendees: number;
  attendeeIds: string[];
  createdBy: string;
  createdAt: string;
}

/** Group shape returned to the client (no internal member id lists) */
export interface GroupView {
  id: string;
  name: string;
  description: string;
  type: string;
  icon: string;
  color: string;
  city: string;
  country: string;
  memberCount: number;
  isMember: boolean;
  isAdmin: boolean;
}

export interface EventView {
  id: string;
  groupId: string;
  groupName: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendeeCount: number;
  isGoing: boolean;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
}

export interface CommunityData {
  groups: GroupView[];
  events: EventView[];
  currentUser: PublicUser | null;
}

export interface ActionResult {
  success: boolean;
  error?: string;
  group?: GroupView;
  event?: EventView;
  isGoing?: boolean;
  isMember?: boolean;
}

// =============================================================================
// JSON file persistence
// =============================================================================

const DATA_DIR = join(process.cwd(), "data");
const GROUPS_FILE = join(DATA_DIR, "groups.json");
const EVENTS_FILE = join(DATA_DIR, "events.json");

function ensureDataDir(): void {
  mkdirSync(DATA_DIR, { recursive: true });
}

function readGroups(): CommunityGroup[] {
  try {
    if (existsSync(GROUPS_FILE)) {
      return JSON.parse(readFileSync(GROUPS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("community: failed to read groups.json", err);
  }
  return [];
}

function writeGroups(groups: CommunityGroup[]): void {
  ensureDataDir();
  writeFileSync(GROUPS_FILE, JSON.stringify(groups, null, 2));
}

function readEvents(): CommunityEvent[] {
  try {
    if (existsSync(EVENTS_FILE)) {
      return JSON.parse(readFileSync(EVENTS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("community: failed to read events.json", err);
  }
  return [];
}

function writeEvents(events: CommunityEvent[]): void {
  ensureDataDir();
  writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
}

// =============================================================================
// Helpers
// =============================================================================

let idCounter = 0;
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${++idCounter}`;
}

function toPublicUser(session: AuthSession): PublicUser {
  return { id: session.userId, name: session.name, email: session.email };
}

/** Resolve the current user from the session cookie, or null. */
async function getCurrentUser(): Promise<AuthSession | null> {
  try {
    const token = getCookie(SESSION_COOKIE);
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

function toGroupView(group: CommunityGroup, userId: string | null): GroupView {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    type: group.type,
    icon: group.icon,
    color: group.color,
    city: group.city,
    country: group.country,
    memberCount: group.baseMembers + group.memberIds.length,
    isMember: !!userId && group.memberIds.includes(userId),
    isAdmin: !!userId && group.adminIds.includes(userId),
  };
}

function toEventView(event: CommunityEvent, userId: string | null): EventView {
  return {
    id: event.id,
    groupId: event.groupId,
    groupName: event.groupName,
    title: event.title,
    description: event.description,
    date: event.date,
    time: event.time,
    location: event.location,
    attendeeCount: event.baseAttendees + event.attendeeIds.length,
    isGoing: !!userId && event.attendeeIds.includes(userId),
  };
}

function requireUser(session: AuthSession | null): ActionResult | null {
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

/** List all groups with membership state for the current user. */
export const listGroups = createServerFn({ method: "GET" }).handler(
  async (): Promise<GroupView[]> => {
    const user = await getCurrentUser();
    return readGroups().map((g) => toGroupView(g, user?.userId ?? null));
  },
);

/** List all events with RSVP state for the current user. */
export const listEvents = createServerFn({ method: "GET" }).handler(
  async (): Promise<EventView[]> => {
    const user = await getCurrentUser();
    return readEvents().map((e) => toEventView(e, user?.userId ?? null));
  },
);

/** Load everything the community page needs in one round-trip. */
export const getCommunityData = createServerFn({ method: "GET" }).handler(
  async (): Promise<CommunityData> => {
    const user = await getCurrentUser();
    const groups = readGroups().map((g) => toGroupView(g, user?.userId ?? null));
    const events = readEvents().map((e) => toEventView(e, user?.userId ?? null));
    return {
      groups,
      events,
      currentUser: user ? toPublicUser(user) : null,
    };
  },
);

/** Create a new group. Creator becomes admin and first member. */
export const createGroup = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<ActionResult> => {
    const user = await getCurrentUser();
    const blocked = requireUser(user);
    if (blocked) return blocked;

    const name = getStrField(data, "name") ?? "";
    const description = getStrField(data, "description") ?? "";
    const type = getStrField(data, "type") ?? "";
    const icon = getStrField(data, "icon") ?? "";
    const color = getStrField(data, "color") ?? "";
    const city = getStrField(data, "city") ?? "";
    const country = getStrField(data, "country") ?? "";

    if (!name || !name.trim()) {
      return { success: false, error: "Group name is required." };
    }

    const groups = readGroups();
    if (groups.some((g) => g.name.toLowerCase() === name.trim().toLowerCase())) {
      return { success: false, error: "A group with that name already exists." };
    }

    const group: CommunityGroup = {
      id: generateId("g"),
      name: name.trim(),
      description: description?.trim() || "",
      type: type?.trim() || "Community",
      icon: icon || "🌍",
      color: color || "bg-brand-secondary-500",
      city: city?.trim() || "",
      country: country?.trim() || "",
      baseMembers: 0,
      memberIds: [user!.userId],
      adminIds: [user!.userId],
      createdBy: user!.userId,
      createdAt: new Date().toISOString(),
    };

    groups.push(group);
    writeGroups(groups);
    return { success: true, group: toGroupView(group, user!.userId) };
  },
);

/** Join a group as the current user. */
export const joinGroup = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<ActionResult> => {
    const user = await getCurrentUser();
    const blocked = requireUser(user);
    if (blocked) return blocked;

    const groupId = getStrField(data, "groupId");
    if (!groupId) return { success: false, error: "Group is required." };

    const groups = readGroups();
    const group = groups.find((g) => g.id === groupId);
    if (!group) return { success: false, error: "Group not found." };
    if (group.memberIds.includes(user!.userId)) {
      return { success: true, isMember: true, group: toGroupView(group, user!.userId) };
    }

    group.memberIds.push(user!.userId);
    writeGroups(groups);
    return { success: true, isMember: true, group: toGroupView(group, user!.userId) };
  },
);

/** Leave a group as the current user. */
export const leaveGroup = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<ActionResult> => {
    const user = await getCurrentUser();
    const blocked = requireUser(user);
    if (blocked) return blocked;

    const groupId = getStrField(data, "groupId");
    if (!groupId) return { success: false, error: "Group is required." };

    const groups = readGroups();
    const group = groups.find((g) => g.id === groupId);
    if (!group) return { success: false, error: "Group not found." };

    group.memberIds = group.memberIds.filter((id) => id !== user!.userId);
    writeGroups(groups);
    return { success: true, isMember: false, group: toGroupView(group, user!.userId) };
  },
);

/** Create an event under one of the current user's groups (admin only). */
export const createEvent = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<ActionResult> => {
    const user = await getCurrentUser();
    const blocked = requireUser(user);
    if (blocked) return blocked;

    const groupId = getStrField(data, "groupId") ?? "";
    const title = getStrField(data, "title") ?? "";
    const description = getStrField(data, "description") ?? "";
    const date = getStrField(data, "date") ?? "";
    const time = getStrField(data, "time") ?? "";
    const location = getStrField(data, "location") ?? "";

    if (!groupId) return { success: false, error: "Please choose a group." };
    if (!title || !title.trim()) return { success: false, error: "Event title is required." };
    if (!date) return { success: false, error: "Event date is required." };
    if (!time) return { success: false, error: "Event time is required." };

    const groups = readGroups();
    const group = groups.find((g) => g.id === groupId);
    if (!group) return { success: false, error: "Group not found." };
    if (!group.adminIds.includes(user!.userId)) {
      return {
        success: false,
        error: "Only group admins can create events for this group.",
      };
    }

    const events = readEvents();
    const event: CommunityEvent = {
      id: generateId("e"),
      groupId: group.id,
      groupName: group.name,
      title: title.trim(),
      description: description?.trim() || "",
      date,
      time: time.trim(),
      location: location?.trim() || "",
      baseAttendees: 0,
      attendeeIds: [],
      createdBy: user!.userId,
      createdAt: new Date().toISOString(),
    };

    events.push(event);
    writeEvents(events);
    return { success: true, event: toEventView(event, user!.userId) };
  },
);

/** Toggle RSVP for the current user on an event. */
export const rsvpToEvent = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<ActionResult> => {
    const user = await getCurrentUser();
    const blocked = requireUser(user);
    if (blocked) return blocked;

    const eventId = getStrField(data, "eventId");
    if (!eventId) return { success: false, error: "Event is required." };

    const events = readEvents();
    const event = events.find((e) => e.id === eventId);
    if (!event) return { success: false, error: "Event not found." };

    const going = event.attendeeIds.includes(user!.userId);
    if (going) {
      event.attendeeIds = event.attendeeIds.filter((id) => id !== user!.userId);
      writeEvents(events);
      return { success: true, isGoing: false, event: toEventView(event, user!.userId) };
    }

    event.attendeeIds.push(user!.userId);
    writeEvents(events);
    return { success: true, isGoing: true, event: toEventView(event, user!.userId) };
  },
);
