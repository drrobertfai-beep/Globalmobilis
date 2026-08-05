/**
 * Global Mobilis — Video Consultations (Mentors)
 *
 * Server functions for the mentor directory and consultation bookings:
 * listMentors, getMentor, bookSession, getMyBookings, cancelBooking.
 *
 * Persistence: JSON files under <project>/data/ — mentors.json (seeded with
 * 12 verified mentors across 6 featured cities) and bookings.json (user
 * bookings). The current user is identified from the session cookie (JWT
 * issued by src/lib/auth.ts).
 *
 * Video calls are powered by Jitsi Meet (free, no API key) — each booking
 * gets a unique room named `gm-mentor-{bookingId}` embedded via iframe.
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
export interface Mentor {
  id: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  avatar: string; // initials like "AS"
  avatarColor: string; // tailwind bg class
  title: string; // e.g. "Immigration Lawyer"
  bio: string;
  expertise: string[]; // e.g. ["visa", "housing", "jobs"]
  hourlyRate: number; // USD
  currency: string;
  rating: number; // 1-5
  reviewCount: number;
  languages: string[];
  availableTimeSlots: string[]; // ISO datetime strings for upcoming slots
  videoIntroUrl?: string; // optional intro video
}

export interface Booking {
  id: string;
  mentorId: string;
  userId: string;
  userName: string;
  slot: string; // ISO datetime
  status: "confirmed" | "completed" | "cancelled";
  meetingLink: string;
  createdAt: string;
}

/** Lightweight mentor shape used by the directory. */
export interface MentorCardView {
  id: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  avatar: string;
  avatarColor: string;
  title: string;
  expertise: string[];
  hourlyRate: number;
  currency: string;
  rating: number;
  reviewCount: number;
}

/** Full mentor profile (directory card fields + bio/languages/slots). */
export interface MentorProfileView extends MentorCardView {
  bio: string;
  languages: string[];
  availableTimeSlots: string[];
  videoIntroUrl?: string;
}

/** Booking enriched with mentor info for dashboards and the video room. */
export interface BookingView {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorTitle: string;
  mentorAvatar: string;
  mentorAvatarColor: string;
  mentorCity: string;
  mentorCountry: string;
  mentorFlag: string;
  slot: string;
  status: Booking["status"];
  meetingLink: string;
  createdAt: string;
}

export interface BookingResult {
  success: boolean;
  booking?: BookingView;
  error?: string;
}

export const FEATURED_CITIES = [
  "Toronto",
  "Berlin",
  "Dubai",
  "Lisbon",
  "London",
  "Sydney",
] as const;

// =============================================================================
// Helpers
// =============================================================================
let idCounter = 0;
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${++idCounter}`;
}

async function getCurrentUser(): Promise<AuthSession | null> {
  try {
    const token = getCookie(SESSION_COOKIE);
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

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

/** Format an ISO slot as "Wed, Aug 12 · 2:00 PM" for UI display. */
export function formatSlot(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

/** 5 star characters (★ filled / ☆ empty) for a 1-5 rating. */
export function ratingStars(rating: number): string[] {
  const rounded = Math.round(rating);
  return Array.from({ length: 5 }, (_, i) => (i < rounded ? "★" : "☆"));
}

/** Generate `count` upcoming ISO slots over the next several days. */
function makeSlots(count: number): string[] {
  const slots: string[] = [];
  const now = Date.now();
  const hours = [9, 11, 14, 16, 18];
  let dayOffset = 1;
  let hourIdx = 0;
  while (slots.length < count && dayOffset <= 14) {
    const d = new Date(now);
    d.setDate(d.getDate() + dayOffset);
    d.setUTCHours(hours[hourIdx % hours.length], 0, 0, 0);
    if (d.getTime() > now) slots.push(d.toISOString());
    hourIdx += 1;
    if (hourIdx % hours.length === 0) dayOffset += 1;
  }
  return slots;
}

// =============================================================================
// JSON file persistence
// =============================================================================
const DATA_DIR = join(process.cwd(), "data");
const MENTORS_FILE = join(DATA_DIR, "mentors.json");
const BOOKINGS_FILE = join(DATA_DIR, "bookings.json");

function readJson<T>(file: string, fallback: T): T {
  try {
    if (existsSync(file)) return JSON.parse(readFileSync(file, "utf-8")) as T;
  } catch (err) {
    console.error(`mentors: failed to read ${file}`, err);
  }
  return fallback;
}

function writeJson(file: string, value: unknown): void {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(file, JSON.stringify(value, null, 2));
}

/** Keep each mentor's availability fresh: drop past slots, re-seed if empty. */
function ensureFutureSlots(mentors: Mentor[]): boolean {
  const now = Date.now();
  let changed = false;
  for (const m of mentors) {
    const future = m.availableTimeSlots.filter((s) => new Date(s).getTime() > now);
    if (future.length === 0) {
      m.availableTimeSlots = makeSlots(5);
      changed = true;
    } else if (future.length !== m.availableTimeSlots.length) {
      m.availableTimeSlots = future;
      changed = true;
    }
  }
  return changed;
}

function readMentors(): Mentor[] {
  let mentors = readJson<Mentor[]>(MENTORS_FILE, []);
  if (mentors.length === 0) {
    mentors = SEED_MENTORS.map((m) => ({ ...m, availableTimeSlots: makeSlots(m.availableTimeSlots.length) }));
    writeJson(MENTORS_FILE, mentors);
  } else if (ensureFutureSlots(mentors)) {
    writeJson(MENTORS_FILE, mentors);
  }
  return mentors;
}

function writeMentors(mentors: Mentor[]): void {
  writeJson(MENTORS_FILE, mentors);
}

function readBookings(): Booking[] {
  return readJson<Booking[]>(BOOKINGS_FILE, []);
}

function writeBookings(bookings: Booking[]): void {
  writeJson(BOOKINGS_FILE, bookings);
}

function toCardView(m: Mentor): MentorCardView {
  return {
    id: m.id,
    name: m.name,
    city: m.city,
    country: m.country,
    flag: m.flag,
    avatar: m.avatar,
    avatarColor: m.avatarColor,
    title: m.title,
    expertise: m.expertise,
    hourlyRate: m.hourlyRate,
    currency: m.currency,
    rating: m.rating,
    reviewCount: m.reviewCount,
  };
}

function toBookingView(b: Booking, mentors: Mentor[]): BookingView {
  const m = mentors.find((x) => x.id === b.mentorId);
  return {
    id: b.id,
    mentorId: b.mentorId,
    mentorName: m?.name ?? "Mentor",
    mentorTitle: m?.title ?? "",
    mentorAvatar: m?.avatar ?? "?",
    mentorAvatarColor: m?.avatarColor ?? "bg-brand-primary-500",
    mentorCity: m?.city ?? "",
    mentorCountry: m?.country ?? "",
    mentorFlag: m?.flag ?? "",
    slot: b.slot,
    status: b.status,
    meetingLink: b.meetingLink,
    createdAt: b.createdAt,
  };
}

// =============================================================================
// Seed data — 12 verified mentors across 6 featured cities
// =============================================================================
const SEED_MENTORS: Mentor[] = [
  // ── Toronto ────────────────────────────────────────────────────────────────
  {
    id: "m_tor_priya",
    name: "Priya Sharma",
    city: "Toronto",
    country: "Canada",
    flag: "🇨🇦",
    avatar: "PS",
    avatarColor: "bg-brand-primary-500",
    title: "Immigration Lawyer",
    bio: "Licensed Canadian immigration lawyer with 12 years of experience and 800+ successful applications. I help families, professionals and students navigate work permits, permanent residence and citizenship. Book a session to get a straight answer on your eligibility and a clear action plan for your Canadian dream.",
    expertise: ["visa", "work permit", "PR"],
    hourlyRate: 95,
    currency: "USD",
    rating: 4.9,
    reviewCount: 87,
    languages: ["English", "Hindi", "Punjabi"],
    availableTimeSlots: makeSlots(5),
  },
  {
    id: "m_tor_david",
    name: "David Kalu",
    city: "Toronto",
    country: "Canada",
    flag: "🇨🇦",
    avatar: "DK",
    avatarColor: "bg-brand-coral-500",
    title: "Tech Recruiter",
    bio: "Senior technical recruiter at a Toronto scale-up. I've screened 5,000+ candidates for Canadian tech roles and know exactly what hiring managers look for. I'll review your resume, prep you for interviews and help you break into Toronto's booming tech scene.",
    expertise: ["tech jobs", "resume", "interviews"],
    hourlyRate: 65,
    currency: "USD",
    rating: 4.7,
    reviewCount: 54,
    languages: ["English", "Igbo"],
    availableTimeSlots: makeSlots(4),
  },
  // ── Berlin ────────────────────────────────────────────────────────────────
  {
    id: "m_ber_lena",
    name: "Lena Hoffmann",
    city: "Berlin",
    country: "Germany",
    flag: "🇩🇪",
    avatar: "LH",
    avatarColor: "bg-brand-secondary-500",
    title: "Visa Specialist",
    bio: "Former case officer at the Berlin Ausländerbehörde, now an independent relocation consultant. I specialise in EU Blue Cards, freelance (freiberuflich) visas and family reunification. Clear, practical guidance on the documents that actually matter.",
    expertise: ["visa", "blue card", "residence permit"],
    hourlyRate: 70,
    currency: "USD",
    rating: 4.8,
    reviewCount: 63,
    languages: ["German", "English", "French"],
    availableTimeSlots: makeSlots(5),
  },
  {
    id: "m_ber_jonas",
    name: "Jonas Weber",
    city: "Berlin",
    country: "Germany",
    flag: "🇩🇪",
    avatar: "JW",
    avatarColor: "bg-brand-gold-500",
    title: "Startup Founder",
    bio: "Founded two Berlin startups and mentored 40+ founders through Tech Open Air and Startup Grind. If you're moving to build or join a startup, I'll help you understand the local ecosystem, meet the right people and raise your first round.",
    expertise: ["startups", "networking", "funding"],
    hourlyRate: 80,
    currency: "USD",
    rating: 4.6,
    reviewCount: 41,
    languages: ["German", "English"],
    availableTimeSlots: makeSlots(4),
  },
  // ── Dubai ─────────────────────────────────────────────────────────────────
  {
    id: "m_dub_omar",
    name: "Omar Al-Farsi",
    city: "Dubai",
    country: "UAE",
    flag: "🇦🇪",
    avatar: "OA",
    avatarColor: "bg-brand-primary-700",
    title: "Business Setup Consultant",
    bio: "15 years in Dubai's business landscape. I guide entrepreneurs through company formation, free zone selection, licensing and the new UAE corporate tax regime. From golden visa eligibility to bank account opening — I've done it hundreds of times.",
    expertise: ["company setup", "free zone", "tax"],
    hourlyRate: 120,
    currency: "USD",
    rating: 5.0,
    reviewCount: 112,
    languages: ["Arabic", "English", "Urdu"],
    availableTimeSlots: makeSlots(6),
  },
  {
    id: "m_dub_fatima",
    name: "Fatima Rahman",
    city: "Dubai",
    country: "UAE",
    flag: "🇦🇪",
    avatar: "FR",
    avatarColor: "bg-brand-coral-700",
    title: "Real Estate Agent",
    bio: "RERA-certified agent with a portfolio across Dubai Marina, Downtown and JVC. Whether you're renting your first apartment sight-unseen or buying an off-plan investment, I'll help you avoid the tourist traps and get a fair deal.",
    expertise: ["housing", "rentals", "relocation"],
    hourlyRate: 55,
    currency: "USD",
    rating: 4.5,
    reviewCount: 38,
    languages: ["English", "Bengali", "Hindi"],
    availableTimeSlots: makeSlots(4),
  },
  // ── Lisbon ─────────────────────────────────────────────────────────────────
  {
    id: "m_lis_ines",
    name: "Inês Costa",
    city: "Lisbon",
    country: "Portugal",
    flag: "🇵🇹",
    avatar: "IC",
    avatarColor: "bg-brand-gold-700",
    title: "D8 Visa Expert",
    bio: "Portuguese immigration lawyer specialising in the D8 digital nomad visa and NHR tax regime. I've secured 200+ D8 approvals for remote workers. I'll walk you through income thresholds, NIF, NHR and the exact paperwork — no agency fees.",
    expertise: ["d8 visa", "remote work", "nif"],
    hourlyRate: 75,
    currency: "USD",
    rating: 4.9,
    reviewCount: 96,
    languages: ["Portuguese", "English", "Spanish"],
    availableTimeSlots: makeSlots(5),
  },
  {
    id: "m_lis_marco",
    name: "Marco Silva",
    city: "Lisbon",
    country: "Portugal",
    flag: "🇵🇹",
    avatar: "MS",
    avatarColor: "bg-brand-secondary-700",
    title: "Expat Life Coach",
    bio: "Moved from São Paulo to Lisbon in 2018 and never looked back. I coach expats through culture shock, language confidence and building a real social life abroad. Practical, warm, no-nonsense support for your first year in Portugal.",
    expertise: ["culture", "integration", "career change"],
    hourlyRate: 45,
    currency: "USD",
    rating: 4.7,
    reviewCount: 59,
    languages: ["Portuguese", "English", "Spanish"],
    availableTimeSlots: makeSlots(4),
  },
  // ── London ─────────────────────────────────────────────────────────────────
  {
    id: "m_lon_charlotte",
    name: "Charlotte Hayes",
    city: "London",
    country: "UK",
    flag: "🇬🇧",
    avatar: "CH",
    avatarColor: "bg-brand-primary-500",
    title: "Finance Recruiter",
    bio: "Executive recruiter at a City firm placing candidates across banking, fintech and asset management. I'll help you translate your experience into a CV that London recruiters understand, navigate visa sponsorship and ace competency interviews.",
    expertise: ["finance jobs", "CV", "banking"],
    hourlyRate: 85,
    currency: "USD",
    rating: 4.8,
    reviewCount: 71,
    languages: ["English"],
    availableTimeSlots: makeSlots(5),
  },
  {
    id: "m_lon_daniel",
    name: "Daniel Osei",
    city: "London",
    country: "UK",
    flag: "🇬🇧",
    avatar: "DO",
    avatarColor: "bg-brand-secondary-500",
    title: "NHS Registration Guide",
    bio: "Registered nurse and founder of a medical-recruitment support network. I guide international doctors and nurses through GMC/NMC registration, IELTS/OET requirements, and landing their first NHS job — I've supported 300+ healthcare professionals.",
    expertise: ["nhs", "nursing", "medical jobs"],
    hourlyRate: 60,
    currency: "USD",
    rating: 4.6,
    reviewCount: 44,
    languages: ["English", "Twi"],
    availableTimeSlots: makeSlots(4),
  },
  // ── Sydney ─────────────────────────────────────────────────────────────────
  {
    id: "m_syd_grace",
    name: "Grace Thompson",
    city: "Sydney",
    country: "Australia",
    flag: "🇦🇺",
    avatar: "GT",
    avatarColor: "bg-brand-coral-500",
    title: "Migration Agent",
    bio: "MARA-registered migration agent (MARN 1900234) with 10 years in skilled migration. From EOI and points testing to employer sponsorship and 189/190 visas, I give you an honest assessment of your chances and the fastest compliant pathway.",
    expertise: ["visa", "skilled migration", "PR"],
    hourlyRate: 90,
    currency: "USD",
    rating: 4.8,
    reviewCount: 88,
    languages: ["English"],
    availableTimeSlots: makeSlots(5),
  },
  {
    id: "m_syd_sam",
    name: "Sam Whitfield",
    city: "Sydney",
    country: "Australia",
    flag: "🇦🇺",
    avatar: "SW",
    avatarColor: "bg-brand-gold-500",
    title: "Education Consultant",
    bio: "Former international student now advising families and students on Australian universities, student visas and scholarships. I help you shortlist the right courses, nail your application and get your enrolment sorted before you land.",
    expertise: ["universities", "student visa", "scholarships"],
    hourlyRate: 60,
    currency: "USD",
    rating: 4.6,
    reviewCount: 47,
    languages: ["English", "Mandarin"],
    availableTimeSlots: makeSlots(4),
  },
];

// =============================================================================
// Server Functions
// =============================================================================

/** All mentors, optionally filtered by city. */
export const listMentors = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<MentorCardView[]> => {
    const city = getStrField(data, "city");
    const mentors = readMentors();
    const filtered = city ? mentors.filter((m) => m.city === city) : mentors;
    return filtered
      .sort((a, b) => b.rating - a.rating)
      .map(toCardView);
  },
);

/** Single mentor profile with fresh availability (future slots only). */
export const getMentor = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<MentorProfileView | null> => {
    const mentorId = getStrField(data, "mentorId");
    if (!mentorId) return null;
    const mentors = readMentors();
    const m = mentors.find((x) => x.id === mentorId);
    if (!m) return null;
    const now = Date.now();
    return {
      ...toCardView(m),
      bio: m.bio,
      languages: m.languages,
      availableTimeSlots: m.availableTimeSlots
        .filter((s) => new Date(s).getTime() > now)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()),
      videoIntroUrl: m.videoIntroUrl,
    };
  },
);

/** Book a session with a mentor at the given slot. Generates the Jitsi link. */
export const bookSession = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<BookingResult> => {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "You must be signed in to book a session." };
    }
    const mentorId = getStrField(data, "mentorId");
    const slot = getStrField(data, "slot");
    if (!mentorId || !slot) {
      return { success: false, error: "Mentor and time slot are required." };
    }

    const mentors = readMentors();
    const mentor = mentors.find((m) => m.id === mentorId);
    if (!mentor) return { success: false, error: "Mentor not found." };

    const slotTime = new Date(slot).getTime();
    if (Number.isNaN(slotTime) || slotTime <= Date.now()) {
      return { success: false, error: "Please choose an upcoming time slot." };
    }
    if (!mentor.availableTimeSlots.includes(slot)) {
      return { success: false, error: "That time slot is no longer available. Please pick another." };
    }

    const bookings = readBookings();
    const taken = bookings.some(
      (b) => b.mentorId === mentorId && b.slot === slot && b.status === "confirmed",
    );
    if (taken) {
      return { success: false, error: "That time slot was just booked by someone else. Please pick another." };
    }

    const id = generateId("bk");
    const booking: Booking = {
      id,
      mentorId,
      userId: user.userId,
      userName: user.name,
      slot,
      status: "confirmed",
      meetingLink: `https://meet.jit.si/gm-mentor-${id}`,
      createdAt: new Date().toISOString(),
    };

    // Remove the booked slot from the mentor's availability.
    mentor.availableTimeSlots = mentor.availableTimeSlots.filter((s) => s !== slot);
    writeMentors(mentors);
    bookings.push(booking);
    writeBookings(bookings);

    return { success: true, booking: toBookingView(booking, mentors) };
  },
);

/** The current user's bookings (enriched with mentor info), soonest first. */
export const getMyBookings = createServerFn({ method: "GET" }).handler(
  async (): Promise<BookingView[]> => {
    const user = await getCurrentUser();
    if (!user) return [];
    const mentors = readMentors();
    return readBookings()
      .filter((b) => b.userId === user.userId)
      .sort((a, b) => new Date(a.slot).getTime() - new Date(b.slot).getTime())
      .map((b) => toBookingView(b, mentors));
  },
);

/** Cancel a confirmed booking — only allowed more than 24h before the slot. */
export const cancelBooking = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<{ success: boolean; error?: string }> => {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "You must be signed in." };
    const bookingId = getStrField(data, "bookingId");
    if (!bookingId) return { success: false, error: "Booking ID is required." };

    const bookings = readBookings();
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: "Booking not found." };
    if (booking.userId !== user.userId) return { success: false, error: "This booking belongs to another user." };
    if (booking.status !== "confirmed") return { success: false, error: "This booking is no longer active." };

    const slotTime = new Date(booking.slot).getTime();
    if (slotTime - Date.now() < 24 * 60 * 60 * 1000) {
      return {
        success: false,
        error: "Sessions within 24 hours cannot be cancelled online. Please contact support.",
      };
    }

    booking.status = "cancelled";
    writeBookings(bookings);

    // Give the slot back to the mentor.
    const mentors = readMentors();
    const mentor = mentors.find((m) => m.id === booking.mentorId);
    if (mentor && !mentor.availableTimeSlots.includes(booking.slot)) {
      mentor.availableTimeSlots.push(booking.slot);
      mentor.availableTimeSlots.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      writeMentors(mentors);
    }

    return { success: true };
  },
);
