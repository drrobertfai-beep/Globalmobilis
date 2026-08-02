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
// Seed data (used when the JSON files are empty / missing)
// =============================================================================

export const SEED_GROUPS: CommunityGroup[] = [
  {
    id: "g_toronto_tech",
    name: "Toronto Tech Expats",
    description: "Tech professionals who've made Toronto home. Networking, job referrals and city survival tips.",
    type: "Professional",
    icon: "💼",
    color: "bg-brand-primary-500",
    city: "Toronto",
    country: "Canada",
    baseMembers: 1200,
    memberIds: [],
    adminIds: ["seed_admin_toronto"],
    createdBy: "seed_admin_toronto",
    createdAt: "2025-01-10T00:00:00.000Z",
  },
  {
    id: "g_berlin_creatives",
    name: "Berlin Creatives",
    description: "Designers, artists and makers building community in the German capital.",
    type: "Cultural",
    icon: "🎨",
    color: "bg-brand-coral-500",
    city: "Berlin",
    country: "Germany",
    baseMembers: 856,
    memberIds: [],
    adminIds: ["seed_admin_berlin"],
    createdBy: "seed_admin_berlin",
    createdAt: "2025-02-02T00:00:00.000Z",
  },
  {
    id: "g_dubai_entrepreneurs",
    name: "Dubai Entrepreneurs",
    description: "Founders and business owners navigating the UAE market — licensing, hiring, growth.",
    type: "Business",
    icon: "🚀",
    color: "bg-brand-gold-500",
    city: "Dubai",
    country: "United Arab Emirates",
    baseMembers: 632,
    memberIds: [],
    adminIds: ["seed_admin_dubai"],
    createdBy: "seed_admin_dubai",
    createdAt: "2025-03-05T00:00:00.000Z",
  },
  {
    id: "g_global_nomads",
    name: "Global Nomads",
    description: "Remote workers and digital nomads swapping visas, wifi and wanderlust.",
    type: "Social",
    icon: "🌍",
    color: "bg-brand-secondary-500",
    city: "Lisbon",
    country: "Portugal",
    baseMembers: 3400,
    memberIds: [],
    adminIds: ["seed_admin_nomads"],
    createdBy: "seed_admin_nomads",
    createdAt: "2025-01-20T00:00:00.000Z",
  },
  {
    id: "g_london_finance",
    name: "London Finance & Tech",
    description: "Professionals across finance and tech in the Square Mile and beyond.",
    type: "Professional",
    icon: "📊",
    color: "bg-brand-primary-700",
    city: "London",
    country: "United Kingdom",
    baseMembers: 2100,
    memberIds: [],
    adminIds: ["seed_admin_london"],
    createdBy: "seed_admin_london",
    createdAt: "2025-04-11T00:00:00.000Z",
  },
  {
    id: "g_sydney_families",
    name: "New Families in Sydney",
    description: "Parents settling into Sydney life — schools, healthcare and playgroups.",
    type: "Support",
    icon: "👪",
    color: "bg-brand-coral-700",
    city: "Sydney",
    country: "Australia",
    baseMembers: 423,
    memberIds: [],
    adminIds: ["seed_admin_sydney"],
    createdBy: "seed_admin_sydney",
    createdAt: "2025-05-01T00:00:00.000Z",
  },
];

export const SEED_EVENTS: CommunityEvent[] = [
  {
    id: "e_remote_lisbon",
    groupId: "g_global_nomads",
    groupName: "Global Nomads",
    title: "Remote Work in Lisbon",
    description: "Meet fellow nomads, compare visas and share the best co-working spots in Lisbon.",
    date: "2026-08-15",
    time: "6:00 PM",
    location: "Lisbon, Portugal",
    baseAttendees: 34,
    attendeeIds: [],
    createdBy: "seed_admin_nomads",
    createdAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "e_toronto_meetup",
    groupId: "g_toronto_tech",
    groupName: "Toronto Tech Expats",
    title: "Toronto Tech Meetup",
    description: "Monthly meetup — talks, hiring boards and demos from the community.",
    date: "2026-08-20",
    time: "2:00 PM",
    location: "Toronto, Canada",
    baseAttendees: 56,
    attendeeIds: [],
    createdBy: "seed_admin_toronto",
    createdAt: "2026-06-10T00:00:00.000Z",
  },
  {
    id: "e_berlin_pitch",
    groupId: "g_berlin_creatives",
    groupName: "Berlin Creatives",
    title: "Berlin Startup Pitch Night",
    description: "Creative founders pitch to a friendly room. Beers and feedback included.",
    date: "2026-08-27",
    time: "7:00 PM",
    location: "Berlin, Germany",
    baseAttendees: 28,
    attendeeIds: [],
    createdBy: "seed_admin_berlin",
    createdAt: "2026-06-15T00:00:00.000Z",
  },
];

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

    const { name, description, type, icon, color, city, country } = (data ||
      {}) as Record<string, string>;

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

    const { groupId } = (data || {}) as { groupId?: string };
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

    const { groupId } = (data || {}) as { groupId?: string };
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

    const { groupId, title, description, date, time, location } = (data ||
      {}) as Record<string, string>;

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

    const { eventId } = (data || {}) as { eventId?: string };
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
