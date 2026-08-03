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
  const { existsSync, mkdirSync, readFileSync, writeFileSync } = await import("node:fs");
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
  // No file yet — serve (and persist) the seed catalog on first touch.
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, JSON.stringify(SEED_THREADS, null, 2));
  return SEED_THREADS;
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
  const { existsSync, mkdirSync, readFileSync, writeFileSync } = await import("node:fs");
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
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, JSON.stringify(SEED_REPLIES, null, 2));
  return SEED_REPLIES;
}

async function writeReplies(replies: ThreadReply[]): Promise<void> {
  const { join } = await import("node:path");
  const { mkdirSync, writeFileSync } = await import("node:fs");
  const dir = join(process.cwd(), "data");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "replies.json"), JSON.stringify(replies, null, 2));
}

// =============================================================================
// Seed data (used when the JSON files are empty / missing)
// =============================================================================

export const SEED_THREADS: ForumThread[] = [
  {
    id: "t_toronto_uk_guide",
    title: "Moving to Toronto from the UK — neighbourhood tips?",
    body: "Relocating with my family next month (job in the financial district). We've shortlisted Liberty Village, The Beaches and Leslieville. Priorities: decent commute downtown, good public schools, and a neighbourhood that doesn't feel like a ghost town at weekends. Anyone made a similar move and have strong opinions?",
    category: "Toronto",
    tags: ["housing", "families", "moving"],
    authorId: "seed_sophie",
    authorName: "Sophie Turner",
    upvotes: 18,
    upvoterIds: [],
    replyCount: 3,
    pinned: false,
    createdAt: "2026-07-28T09:14:00.000Z",
    updatedAt: "2026-07-28T09:14:00.000Z",
  },
  {
    id: "t_berlin_anmeldung",
    title: "Berlin Anmeldung as a freelancer — step-by-step?",
    body: "I keep reading conflicting advice about registering my address (Anmeldung) before or after getting a freelance visa. I have a Wohnungsgeberbestätigung from my landlord. What's the actual order of operations, and do I need an appointment at the Bürgeramt weeks in advance?",
    category: "Berlin",
    tags: ["visa", "freelance", "paperwork"],
    authorId: "seed_marco",
    authorName: "Marco Silva",
    upvotes: 24,
    upvoterIds: [],
    replyCount: 4,
    pinned: false,
    createdAt: "2026-07-25T16:40:00.000Z",
    updatedAt: "2026-07-25T16:40:00.000Z",
  },
  {
    id: "t_dubai_freezone",
    title: "Dubai: free zone vs mainland for an online consultancy?",
    body: "Planning to move my consulting practice to Dubai. I keep hearing mainland is 'better for credibility' but free zones are cheaper and 100% ownership. For a solo consultant serving overseas clients, is a free zone license (e.g. DMCC) enough, or should I bite the bullet and go mainland?",
    category: "Dubai",
    tags: ["business", "licensing"],
    authorId: "seed_amira",
    authorName: "Amira Hassan",
    upvotes: 31,
    upvoterIds: [],
    replyCount: 4,
    pinned: false,
    createdAt: "2026-07-22T08:05:00.000Z",
    updatedAt: "2026-07-22T08:05:00.000Z",
  },
  {
    id: "t_lisbon_dn_visa",
    title: "Digital Nomad Visa: the documents that actually got approved",
    body: "My Portugal D8 visa was approved last week after 11 weeks. Sharing what made the difference: 1) income proof in the exact format the consulate wanted (3 months of payslips + bank statements, not just a contract), 2) a rental lease longer than the standard 6 months, 3) a cover letter in Portuguese. Happy to answer questions.",
    category: "Lisbon",
    tags: ["visa", "remote work", "success story"],
    authorId: "seed_priya",
    authorName: "Priya Sharma",
    upvotes: 47,
    upvoterIds: [],
    replyCount: 5,
    pinned: true,
    createdAt: "2026-07-18T12:30:00.000Z",
    updatedAt: "2026-07-18T12:30:00.000Z",
  },
  {
    id: "t_london_salary",
    title: "London tech offer — what salary is actually realistic in 2026?",
    body: "Senior backend engineer offer: £95k base, 8% bonus, 25 days holiday, remote 2 days/week. I'm moving from Amsterdam where I earn €85k. The recruiter says £95k is 'top of band'. Is that true for a senior at a scale-up, or am I being lowballed?",
    category: "London",
    tags: ["jobs", "salary", "negotiation"],
    authorId: "seed_omar",
    authorName: "Omar Al-Farsi",
    upvotes: 29,
    upvoterIds: [],
    replyCount: 4,
    pinned: false,
    createdAt: "2026-07-15T10:20:00.000Z",
    updatedAt: "2026-07-15T10:20:00.000Z",
  },
  {
    id: "t_sydney_schools",
    title: "Sydney school zones: how far ahead should we plan?",
    body: "Two kids (8 and 11). We're renting in North Sydney but house-hunting in the Hills district for the school catchments. How competitive is enrolment really — do we need to be inside the zone before the school year starts, or can we apply from outside?",
    category: "Sydney",
    tags: ["families", "schools", "housing"],
    authorId: "seed_david",
    authorName: "David Kim",
    upvotes: 12,
    upvoterIds: [],
    replyCount: 3,
    pinned: false,
    createdAt: "2026-07-10T01:45:00.000Z",
    updatedAt: "2026-07-10T01:45:00.000Z",
  },
  {
    id: "t_general_transfer_fees",
    title: "Best way to transfer money internationally without getting rinsed?",
    body: "Between moving costs, rent deposits and family support, I'll be moving six figures between currencies this year. Wise vs Revolut vs a proper FX broker — what do people actually use for large transfers as an expat?",
    category: "General",
    tags: ["money", "banking"],
    authorId: "seed_emma",
    authorName: "Emma Johansson",
    upvotes: 22,
    upvoterIds: [],
    replyCount: 3,
    pinned: false,
    createdAt: "2026-07-05T18:00:00.000Z",
    updatedAt: "2026-07-05T18:00:00.000Z",
  },
  {
    id: "t_general_healthcare",
    title: "Which countries make expat health insurance unnecessary?",
    body: "Trying to compare healthcare as part of destination research. I know the UK has the NHS and Portugal has SNS, but how do they actually work for newcomers? Where have you lived where you genuinely didn't need private insurance?",
    category: "General",
    tags: ["healthcare", "insurance", "comparison"],
    authorId: "seed_lukas",
    authorName: "Lukas Weber",
    upvotes: 16,
    upvoterIds: [],
    replyCount: 3,
    pinned: false,
    createdAt: "2026-06-29T14:10:00.000Z",
    updatedAt: "2026-06-29T14:10:00.000Z",
  },
  {
    id: "t_general_first30",
    title: "First 30 days as an expat: what do you wish you'd done differently?",
    body: "Landing in a new country next month and want to front-load the admin so I can actually enjoy the first month. Bank account, SIM, tax number, health registration, flat viewing — what order did things actually need to happen for you, and what did you regret putting off?",
    category: "General",
    tags: ["newcomer", "checklist"],
    authorId: "seed_sophie",
    authorName: "Sophie Turner",
    upvotes: 35,
    upvoterIds: [],
    replyCount: 4,
    pinned: false,
    createdAt: "2026-06-22T07:55:00.000Z",
    updatedAt: "2026-06-22T07:55:00.000Z",
  },
];

export const SEED_REPLIES: ThreadReply[] = [
  // t_toronto_uk_guide
  {
    id: "r_toronto_1",
    threadId: "t_toronto_uk_guide",
    body: "Moved from Manchester 4 years ago and chose Leslieville. The commute downtown is ~25 min on the Queen streetcar, schools are solid, and it has the village feel you won't get in Liberty Village (which is lovely but very condo-y).",
    authorId: "seed_david",
    authorName: "David Kim",
    upvotes: 9,
    upvoterIds: [],
    isAcceptedAnswer: true,
    createdAt: "2026-07-28T12:02:00.000Z",
  },
  {
    id: "r_toronto_2",
    threadId: "t_toronto_uk_guide",
    body: "+1 for Leslieville with kids. Liberty Village is mostly young professionals and the school catchment isn't as strong. The Beaches is fantastic but pricey — check the GO train access if you'll be commuting daily.",
    authorId: "seed_emma",
    authorName: "Emma Johansson",
    upvotes: 4,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-29T09:31:00.000Z",
  },
  {
    id: "r_toronto_3",
    threadId: "t_toronto_uk_guide",
    body: "One more thing: winter. If you can, pick somewhere on a streetcar/subway line so you're not walking 20 min in -15°C. That ruled out parts of the Beaches for us.",
    authorId: "seed_marco",
    authorName: "Marco Silva",
    upvotes: 6,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-30T15:47:00.000Z",
  },
  // t_berlin_anmeldung
  {
    id: "r_berlin_1",
    threadId: "t_berlin_anmeldung",
    body: "Do the Anmeldung FIRST — you need it for the tax ID and basically every other step, including the freelance visa appointment. Book the Bürgeramt slot the moment you have your lease; slots can be 3-6 weeks out.",
    authorId: "seed_lukas",
    authorName: "Lukas Weber",
    upvotes: 14,
    upvoterIds: [],
    isAcceptedAnswer: true,
    createdAt: "2026-07-25T18:22:00.000Z",
  },
  {
    id: "r_berlin_2",
    threadId: "t_berlin_anmeldung",
    body: "Wohnungsgeberbestätigung is the key document — make sure it's dated and signed by the landlord. Bring the original, not a photo. Also print two copies of everything.",
    authorId: "seed_priya",
    authorName: "Priya Sharma",
    upvotes: 7,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-26T08:15:00.000Z",
  },
  {
    id: "r_berlin_3",
    threadId: "t_berlin_anmeldung",
    body: "If you can't get a Bürgeramt slot, check the 'Bürgeramt ohne Termin' locations early in the morning — they take walk-ins for Anmeldung specifically.",
    authorId: "seed_omar",
    authorName: "Omar Al-Farsi",
    upvotes: 5,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-27T11:03:00.000Z",
  },
  {
    id: "r_berlin_4",
    threadId: "t_berlin_anmeldung",
    body: "And once it's done, don't forget the Rundfunkbeitrag letter will find you. It's ~€18/month and there's no avoiding it.",
    authorId: "seed_emma",
    authorName: "Emma Johansson",
    upvotes: 8,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-28T19:40:00.000Z",
  },
  // t_dubai_freezone
  {
    id: "r_dubai_1",
    threadId: "t_dubai_freezone",
    body: "For a solo consultant serving overseas clients, DMCC (or IFZA) is plenty. You only need mainland if you want to work with government/onshore clients directly or open a physical retail presence. Setup is 3-5 days with the right agent.",
    authorId: "seed_amira",
    authorName: "Amira Hassan",
    upvotes: 11,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-22T14:20:00.000Z",
  },
  {
    id: "r_dubai_2",
    threadId: "t_dubai_freezone",
    body: "Mainland is genuinely overkill for most solos. One caveat: if your clients are in the UAE, a free zone invoice to a local company can create VAT friction — worth checking with an accountant first.",
    authorId: "seed_sophie",
    authorName: "Sophie Turner",
    upvotes: 6,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-23T09:48:00.000Z",
  },
  {
    id: "r_dubai_3",
    threadId: "t_dubai_freezone",
    body: "DMCC is solid and has good office flex options. Budget ~AED 25-30k/year all-in for a solo setup including visa.",
    authorId: "seed_omar",
    authorName: "Omar Al-Farsi",
    upvotes: 9,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-23T16:12:00.000Z",
  },
  {
    id: "r_dubai_4",
    threadId: "t_dubai_freezone",
    body: "Just don't fall for the cheapest free zone (some are < AED 10k but have limited visa packages and weak bank support). DMCC is the sweet spot for credibility.",
    authorId: "seed_marco",
    authorName: "Marco Silva",
    upvotes: 7,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-24T10:05:00.000Z",
  },
  // t_lisbon_dn_visa
  {
    id: "r_lisbon_1",
    threadId: "t_lisbon_dn_visa",
    body: "This is exactly the detail people miss — the consulate really does want the income proof structured the way you described. Adding the 12-month lease made a huge difference for me too.",
    authorId: "seed_lukas",
    authorName: "Lukas Weber",
    upvotes: 10,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-18T15:30:00.000Z",
  },
  {
    id: "r_lisbon_2",
    threadId: "t_lisbon_dn_visa",
    body: "How far ahead did you start the apartment hunt? We found that landlords in Lisbon want the NIF first, which you can get remotely with a fiscal representative — worth doing before you even land.",
    authorId: "seed_sophie",
    authorName: "Sophie Turner",
    upvotes: 8,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-19T10:14:00.000Z",
  },
  {
    id: "r_lisbon_3",
    threadId: "t_lisbon_dn_visa",
    body: "Also flagging: make sure the bank statements show consistent monthly income for the full 3 months. One dip can trigger a request for more documents.",
    authorId: "seed_david",
    authorName: "David Kim",
    upvotes: 5,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-20T13:44:00.000Z",
  },
  {
    id: "r_lisbon_4",
    threadId: "t_lisbon_dn_visa",
    body: "Congratulations! How long is the D8 valid before you need to convert to a residence permit? Trying to plan the timeline.",
    authorId: "seed_emma",
    authorName: "Emma Johansson",
    upvotes: 3,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-21T17:28:00.000Z",
  },
  {
    id: "r_lisbon_5",
    threadId: "t_lisbon_dn_visa",
    body: "4 months from entry, then you apply for the residence permit (ARI) — budget another 3-6 months for that. Get a lawyer; it's worth every euro.",
    authorId: "seed_priya",
    authorName: "Priya Sharma",
    upvotes: 6,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-21T19:02:00.000Z",
  },
  // t_london_salary
  {
    id: "r_london_1",
    threadId: "t_london_salary",
    body: "For a scale-up senior backend role, £95k is decent but not 'top of band' — top is usually £110-120k at the bigger names. If the equity is meaningful it can be fine, but I'd counter at £105k.",
    authorId: "seed_sophie",
    authorName: "Sophie Turner",
    upvotes: 13,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-15T14:35:00.000Z",
  },
  {
    id: "r_london_2",
    threadId: "t_london_salary",
    body: "Also compare total comp, not just base. UK pension contributions (~5-8%), the 25 days, and whether the bonus is guaranteed vs discretionary. Amsterdam's 30% ruling changes the picture too.",
    authorId: "seed_marco",
    authorName: "Marco Silva",
    upvotes: 7,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-16T09:12:00.000Z",
  },
  {
    id: "r_london_3",
    threadId: "t_london_salary",
    body: "Counter with data: levels.fyi and the salary threads here. £95k → £105k is a very normal ask at that level.",
    authorId: "seed_omar",
    authorName: "Omar Al-Farsi",
    upvotes: 9,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-16T18:51:00.000Z",
  },
  {
    id: "r_london_4",
    threadId: "t_london_salary",
    body: "Don't forget you can also negotiate a relocation package — many UK scale-ups will cover visa costs and 1-2 months of temporary housing if you ask.",
    authorId: "seed_priya",
    authorName: "Priya Sharma",
    upvotes: 5,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-17T08:26:00.000Z",
  },
  // t_sydney_schools
  {
    id: "r_sydney_1",
    threadId: "t_sydney_schools",
    body: "You need to be inside the catchment BEFORE enrolment, and popular schools enforce it hard — they check utility bills and lease agreements. Start the house hunt at least 6 months before the school year.",
    authorId: "seed_emma",
    authorName: "Emma Johansson",
    upvotes: 8,
    upvoterIds: [],
    isAcceptedAnswer: true,
    createdAt: "2026-07-10T06:33:00.000Z",
  },
  {
    id: "r_sydney_2",
    threadId: "t_sydney_schools",
    body: "Catchment boundaries change year to year — check the NSW Department of Education school finder for the CURRENT boundary, not last year's map.",
    authorId: "seed_lukas",
    authorName: "Lukas Weber",
    upvotes: 4,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-11T11:20:00.000Z",
  },
  {
    id: "r_sydney_3",
    threadId: "t_sydney_schools",
    body: "If a school is over-enrolled, out-of-area applications almost never succeed for year levels with waiting lists. The Hills schools are some of the most competitive in the state.",
    authorId: "seed_david",
    authorName: "David Kim",
    upvotes: 6,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-12T15:41:00.000Z",
  },
  // t_general_transfer_fees
  {
    id: "r_transfer_1",
    threadId: "t_general_transfer_fees",
    body: "For six figures, skip Wise and Revolut — use a currency broker (e.g. OFX, WorldFirst). You'll get a better spread and a dedicated account manager. Anything under ~£10k, Wise is fine.",
    authorId: "seed_omar",
    authorName: "Omar Al-Farsi",
    upvotes: 12,
    upvoterIds: [],
    isAcceptedAnswer: true,
    createdAt: "2026-07-05T20:15:00.000Z",
  },
  {
    id: "r_transfer_2",
    threadId: "t_general_transfer_fees",
    body: "+1 on brokers. Also: never transfer on a Friday afternoon — rates swing over the weekend and you lose the float.",
    authorId: "seed_priya",
    authorName: "Priya Sharma",
    upvotes: 5,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-06T09:50:00.000Z",
  },
  {
    id: "r_transfer_3",
    threadId: "t_general_transfer_fees",
    body: "Check if your destination country has a preferential rate for foreign remittances too. Some banks do 0-fee inbound for migrants.",
    authorId: "seed_amira",
    authorName: "Amira Hassan",
    upvotes: 4,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-07T13:09:00.000Z",
  },
  // t_general_healthcare
  {
    id: "r_health_1",
    threadId: "t_general_healthcare",
    body: "Portugal's SNS covers residents but you'll wait for specialists; most expats keep private insurance (~€40-60/month). The UK NHS is free at point of use but dentist/optical are private.",
    authorId: "seed_marco",
    authorName: "Marco Silva",
    upvotes: 9,
    upvoterIds: [],
    isAcceptedAnswer: true,
    createdAt: "2026-06-29T16:45:00.000Z",
  },
  {
    id: "r_health_2",
    threadId: "t_general_healthcare",
    body: "Germany doesn't make it unnecessary — public insurance is mandatory. But it's excellent value (income-based, covers family). Different question than 'do I need it'.",
    authorId: "seed_lukas",
    authorName: "Lukas Weber",
    upvotes: 7,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-06-30T10:12:00.000Z",
  },
  {
    id: "r_health_3",
    threadId: "t_general_healthcare",
    body: "In Dubai you MUST have insurance (it's required for the residency visa). So the answer there is 'yes, but you have no choice'.",
    authorId: "seed_amira",
    authorName: "Amira Hassan",
    upvotes: 6,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-07-01T08:30:00.000Z",
  },
  // t_general_first30
  {
    id: "r_first30_1",
    threadId: "t_general_first30",
    body: "Open the bank account and get a local SIM in week one — everything else (rent, phone contracts, salary) requires both. I did them last and regretted it for a month.",
    authorId: "seed_emma",
    authorName: "Emma Johansson",
    upvotes: 15,
    upvoterIds: [],
    isAcceptedAnswer: true,
    createdAt: "2026-06-22T12:00:00.000Z",
  },
  {
    id: "r_first30_2",
    threadId: "t_general_first30",
    body: "Register with a GP / health system early even if you don't need it — appointments can take weeks and you don't want your first one to be an emergency.",
    authorId: "seed_david",
    authorName: "David Kim",
    upvotes: 8,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-06-23T09:27:00.000Z",
  },
  {
    id: "r_first30_3",
    threadId: "t_general_first30",
    body: "Take photos of EVERY document (lease, visa, passport pages) and keep them in one cloud folder. You will be asked for copies at least 15 times.",
    authorId: "seed_sophie",
    authorName: "Sophie Turner",
    upvotes: 11,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-06-24T14:55:00.000Z",
  },
  {
    id: "r_first30_4",
    threadId: "t_general_first30",
    body: "And say yes to every community invite in the first month. It's how you build the network that solves the other 90% of problems.",
    authorId: "seed_priya",
    authorName: "Priya Sharma",
    upvotes: 10,
    upvoterIds: [],
    isAcceptedAnswer: false,
    createdAt: "2026-06-25T18:41:00.000Z",
  },
];

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

    const { title, body, category, tags } = (data ?? {}) as {
      title?: string;
      body?: string;
      category?: string;
      tags?: string[] | string;
    };

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

    const { threadId, body } = (data ?? {}) as { threadId?: string; body?: string };
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

    const { threadId } = (data ?? {}) as { threadId?: string };
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

    const { threadId } = (data ?? {}) as { threadId?: string };
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

    const { replyId } = (data ?? {}) as { replyId?: string };
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

    const { replyId } = (data ?? {}) as { replyId?: string };
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

    const { threadId, replyId } = (data ?? {}) as {
      threadId?: string;
      replyId?: string;
    };
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
