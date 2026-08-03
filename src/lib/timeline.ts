/**
 * Global Mobilis — Relocation Timeline
 *
 * Generates a personalized, step-by-step relocation checklist from a
 * destination template + move date. Persistence is a JSON file under
 * <project>/data/ (timelines.json), one active timeline per user (keyed by
 * userId). The current user is identified from the session cookie (JWT issued
 * by src/lib/auth.ts).
 *
 * IMPORTANT build constraint: this module's scope must stay free of node
 * builtin imports (node:fs / node:path), `@tanstack/react-start/server` and
 * value imports from other libs — it is imported by several client route
 * bundles (timeline.tsx, dashboard.tsx), and the TanStack Start client
 * transform only reliably drops node imports that are referenced inside
 * `createServerFn` handlers. Everything touching the filesystem and the
 * session cookie therefore uses dynamic `await import()` inside
 * handler-reachable code. Module scope holds only `createServerFn`, the auth
 * helpers, type imports and pure constants.
 */
import { createServerFn } from "@tanstack/react-start";
import { SESSION_COOKIE, verifySessionToken } from "./auth";
import type { AuthSession } from "./auth";

// =============================================================================
// Types
// =============================================================================

export type TimelinePhase =
  | "before-you-go"
  | "getting-ready"
  | "final-countdown"
  | "arrival-week"
  | "first-30-days"
  | "settling-in";

export type TimelineCategory =
  | "visa"
  | "housing"
  | "banking"
  | "healthcare"
  | "legal"
  | "transport"
  | "utilities"
  | "education"
  | "community";

export interface TimelineTask {
  id: string;
  title: string;
  description: string;
  phase: TimelinePhase;
  category: TimelineCategory;
  daysBeforeMove: number; // negative = before move, positive = after
  durationDays: number; // how long the task typically takes
  externalLinks: { label: string; url: string }[];
  tips: string;
}

export interface UserTask {
  taskId: string; // references TimelineTask.id
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface UserTimeline {
  userId: string;
  destination: string;
  moveDate: string; // ISO date (YYYY-MM-DD)
  tasks: UserTask[];
  createdAt: string;
}

/** Merged view: template task + the user's per-task state. */
export interface TimelineTaskView extends TimelineTask {
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface TimelineProgress {
  total: number;
  completed: number;
  percentage: number;
}

export interface TimelineDetail {
  destination: string;
  destinationFlag: string;
  moveDate: string;
  createdAt: string;
  tasks: TimelineTaskView[];
  progress: TimelineProgress;
}

export interface TimelineActionResult {
  success: boolean;
  error?: string;
  timeline?: TimelineDetail | null;
  progress?: TimelineProgress | null;
}

export interface TimelineData {
  currentUser: { id: string; name: string } | null;
  timeline: TimelineDetail | null;
}

// =============================================================================
// Constants (pure — safe in module scope for the client bundle)
// =============================================================================

export const TIMELINE_DESTINATIONS = [
  "Toronto",
  "Berlin",
  "Dubai",
  "Lisbon",
  "London",
  "Sydney",
  "Generic",
];

export const DESTINATION_FLAGS: Record<string, string> = {
  Toronto: "🇨🇦",
  Berlin: "🇩🇪",
  Dubai: "🇦🇪",
  Lisbon: "🇵🇹",
  London: "🇬🇧",
  Sydney: "🇦🇺",
  Generic: "🌍",
};

export const PHASE_META: {
  id: TimelinePhase;
  label: string;
  icon: string;
  /** Tailwind accent classes for the phase header dot / text. */
  dot: string;
  text: string;
  /** Approx. range relative to move date, for the header date-range hint. */
  fromDays: number;
  toDays: number;
}[] = [
  {
    id: "before-you-go",
    label: "Before You Go",
    icon: "🛫",
    dot: "bg-amber-500",
    text: "text-amber-700",
    fromDays: -90,
    toDays: -60,
  },
  {
    id: "getting-ready",
    label: "Getting Ready",
    icon: "📦",
    dot: "bg-blue-500",
    text: "text-blue-700",
    fromDays: -60,
    toDays: -30,
  },
  {
    id: "final-countdown",
    label: "Final Countdown",
    icon: "⏳",
    dot: "bg-orange-500",
    text: "text-orange-700",
    fromDays: -14,
    toDays: -7,
  },
  {
    id: "arrival-week",
    label: "Arrival Week",
    icon: "🛬",
    dot: "bg-green-500",
    text: "text-green-700",
    fromDays: -3,
    toDays: 7,
  },
  {
    id: "first-30-days",
    label: "First 30 Days",
    icon: "🏙️",
    dot: "bg-brand-primary-700",
    text: "text-brand-primary-700",
    fromDays: 7,
    toDays: 30,
  },
  {
    id: "settling-in",
    label: "Settling In",
    icon: "🌱",
    dot: "bg-brand-secondary-500",
    text: "text-brand-secondary-700",
    fromDays: 30,
    toDays: 90,
  },
];

export const CATEGORY_LABELS: Record<TimelineCategory, string> = {
  visa: "Visa",
  housing: "Housing",
  banking: "Banking",
  healthcare: "Healthcare",
  legal: "Legal & Tax",
  transport: "Transport",
  utilities: "Utilities",
  education: "Education",
  community: "Community",
};

// =============================================================================
// Task templates
// =============================================================================

function task(
  id: string,
  title: string,
  description: string,
  phase: TimelinePhase,
  category: TimelineCategory,
  daysBeforeMove: number,
  durationDays: number,
  tips: string,
  externalLinks: { label: string; url: string }[] = [],
): TimelineTask {
  return {
    id,
    title,
    description,
    phase,
    category,
    daysBeforeMove,
    durationDays,
    tips,
    externalLinks,
  };
}

const TORONTO_TASKS: TimelineTask[] = [
  task(
    "tto_pr",
    "Apply for permanent residence (Express Entry)",
    "Submit your Express Entry profile or paper PR application well ahead of moving. Processing typically takes 6–12 months, so start the moment you decide to move.",
    "before-you-go",
    "visa",
    -90,
    90,
    "Keep your profile documents (ECA report, IELTS/CELPIP, proof of funds) in one folder — you'll reference them constantly.",
    [{ label: "IRCC Express Entry", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html" }],
  ),
  task(
    "tto_eca",
    "Get credentials assessed & documents translated",
    "Have your education assessed (WES/ICAS) and translate any non-English/French documents. Needed for the job market, licensing, and some bank accounts.",
    "before-you-go",
    "education",
    -80,
    30,
    "WES reports are accepted by most employers; order extra copies.",
  ),
  task(
    "tto_workpermit",
    "Confirm job offer & work permit paperwork",
    "If moving for work, confirm your employer has filed the Labour Market Impact Assessment (LMIA) or that you qualify for an LMIA-exempt permit. Get the offer letter in writing.",
    "before-you-go",
    "visa",
    -75,
    45,
    "Ask HR whether they cover relocation — many Toronto employers offer moving allowances.",
  ),
  task(
    "tto_stay",
    "Book temporary accommodation for your first 2–3 weeks",
    "Book an Airbnb, hotel or short-term rental near where you'll want to live. Long-term leases usually start the 1st of the month and need an in-person viewing.",
    "before-you-go",
    "housing",
    -60,
    5,
    "Book in a neighbourhood close to your work commute so viewings are easy.",
  ),
  task(
    "tto_school",
    "Register children for school (TDSB catchment)",
    "Contact the Toronto District School Board (TDSB) catchment school for your address. Bring proof of address, immigration documents, and health records.",
    "before-you-go",
    "education",
    -60,
    14,
    "School zones are strict — confirm your shortlist of rentals is inside the catchment you want.",
    [{ label: "TDSB enrolment", url: "https://www.tdsb.on.ca/Find-your-School" }],
  ),
  task(
    "tto_shipping",
    "Arrange shipping of household goods & pets",
    "Book an international mover or sea-freight for large items. If bringing pets, start the quarantine/vaccination paperwork now (Canada has strict entry rules).",
    "getting-ready",
    "transport",
    -45,
    21,
    "Get 2–3 quotes — door-to-door rates vary a lot; check customs forms carefully.",
  ),
  task(
    "tto_sim",
    "Set up a Canadian phone number / eSIM",
    "Buy a Canadian SIM or eSIM (Rogers, Bell, Telus, or budget carriers like Fido/Lucky) so you have data from day one. Many can be ordered before arrival.",
    "getting-ready",
    "utilities",
    -40,
    7,
    "An eSIM active before landing means a working phone at the airport.",
  ),
  task(
    "tto_bank",
    "Open a Canadian bank account (RBC/TD/BMO)",
    "Canada's big banks let newcomers open accounts before arrival with just a passport and visa. Do it now so salary/rent are ready on day one.",
    "getting-ready",
    "banking",
    -35,
    14,
    "Compare newcomer packages — TD and RBC often waive monthly fees for a year.",
  ),
  task(
    "tto_rentsearch",
    "Research & shortlist long-term rentals",
    "Browse condos.ca, rentals.ca and Realtor.ca. Toronto leases typically require first + last month's rent and a credit check; budget for a co-signer if you have no Canadian credit.",
    "getting-ready",
    "housing",
    -30,
    30,
    "Competition is fierce in spring/summer — book viewings within 48h of listing.",
    [{ label: "condos.ca", url: "https://condos.ca" }],
  ),
  task(
    "tto_notify",
    "Notify current landlord/banks & set up mail forwarding",
    "Cancel or transfer subscriptions, utilities, and gym memberships. Set up mail forwarding or a digital mailbox before you leave.",
    "final-countdown",
    "utilities",
    -14,
    7,
    "Use Canada Post's mail forwarding if you have Canadian ties already; otherwise a virtual mailbox service.",
  ),
  task(
    "tto_insurance_gap",
    "Enrol in private health insurance for the OHIP gap",
    "OHIP has a 3-month waiting period for new residents — private travel/immigrant insurance covers that window. Buy it before you land.",
    "final-countdown",
    "healthcare",
    -14,
    10,
    "Check your employer's plan — many cover newcomers from day one via group insurance.",
  ),
  task(
    "tto_tenantins",
    "Buy tenant insurance for your first rental",
    "Tenant/contents insurance is cheap (~$20–30/month) and often required by Toronto landlords. Arrange it the week before you sign.",
    "final-countdown",
    "housing",
    -7,
    3,
    "Bundle with auto insurance if you'll drive for a discount.",
  ),
  task(
    "tto_winter",
    "Prepare winter clothing",
    "Toronto winters hit -10°C to -20°C. Buy a proper winter coat, boots, and layers before arrival — it's cheaper than at tourist stores, and you'll need it immediately.",
    "final-countdown",
    "utilities",
    -7,
    5,
    "Down or synthetic-insulated parka + waterproof boots with grip. Thermal base layers help.",
  ),
  task(
    "tto_ttc",
    "Get a Presto card & TTC pass",
    "Pick up a PRESTO card at any station or Shoppers Drug Mart and load a monthly pass. The TTC connects everything downtown and beyond.",
    "arrival-week",
    "transport",
    3,
    1,
    "Use the TTC Trip Planner app; GO Transit (regional rail) uses the same PRESTO card.",
  ),
  task(
    "tto_sin",
    "Apply for your SIN at Service Canada",
    "Your Social Insurance Number is required for any job, bank account, and tax filings. Apply in person at Service Canada with your passport and work permit/PR card.",
    "first-30-days",
    "legal",
    7,
    2,
    "Service Canada is free — never pay a third party for a SIN.",
    [{ label: "Service Canada SIN", url: "https://www.canada.ca/en/employment-social-development/services/sin.html" }],
  ),
  task(
    "tto_bank_activate",
    "Activate your bank account & credit card",
    "Visit your bank with your SIN and address proof to finalize the account and apply for a first credit card — important for building Canadian credit history.",
    "first-30-days",
    "banking",
    10,
    5,
    "Ask for a secured credit card if you don't qualify for an unsecured one yet.",
  ),
  task(
    "tto_ohip",
    "Apply for your OHIP health card",
    "Ontario's health card has a 3-month waiting period — apply immediately after establishing residency (lease + ID + immigration status) to start the clock.",
    "first-30-days",
    "healthcare",
    10,
    3,
    "Bring proof of address, identity, and immigration status to a ServiceOntario centre.",
    [{ label: "OHIP eligibility", url: "https://www.ontario.ca/page/apply-ohip" }],
  ),
  task(
    "tto_cra",
    "Register with the CRA (taxes)",
    "Register with the Canada Revenue Agency — you'll file taxes as a resident and may be eligible for the GST/HST credit. Your SIN + address is all you need to create a My Account.",
    "first-30-days",
    "legal",
    14,
    7,
    "File a tax return even with $0 income — it unlocks benefits like the Canada Child Benefit.",
  ),
  task(
    "tto_doctor",
    "Find a family doctor & join community groups",
    "Use Healthcare Connect to register for a family doctor (waitlists exist), and join Toronto expat/neighbourhood groups to build your network.",
    "settling-in",
    "community",
    30,
    30,
    "Walk-in clinics fill the gap while you wait for a family doctor.",
  ),
  task(
    "tto_license",
    "Exchange your driver's licence",
    "Ontario lets you exchange a licence from many countries without a road test. Bring your current licence + translation to DriveTest, pay the fee, and swap it for a G licence.",
    "settling-in",
    "transport",
    45,
    14,
    "If your country isn't on the exchange list, you'll take a written test then a road test.",
    [{ label: "Ontario licence exchange", url: "https://www.ontario.ca/page/exchange-out-province-drivers-licence" }],
  ),
  task(
    "tto_library",
    "Get a library card & register at your community centre",
    "The Toronto Public Library card is free and gives you e-books, language classes, and museum passes. Community centres offer cheap fitness and rec programs.",
    "settling-in",
    "community",
    60,
    7,
    "Some TPL branches run newcomer conversation circles — a great way to practice.",
  ),
];

const BERLIN_TASKS: TimelineTask[] = [
  task(
    "tbe_visa",
    "Apply for your visa (work or Freiberufler freelance)",
    "Apply at the German consulate for a work visa or freelance (Freiberufler) visa. Freiberufler requires a portfolio, client letters, and proof of income.",
    "before-you-go",
    "visa",
    -90,
    60,
    "Consulate slots book out months ahead — schedule the appointment before anything else.",
  ),
  task(
    "tbe_lang",
    "Start German language basics",
    "Learn survival German (A1) before arrival — it unlocks bureaucracy, landlords, and neighbours. Use apps, online tutors, or a VHS course if you're already here.",
    "before-you-go",
    "education",
    -80,
    90,
    "Even basic German makes the Bürgeramt and apartment viewings dramatically easier.",
  ),
  task(
    "tbe_bank",
    "Open a German bank account remotely (N26 / Commerzbank)",
    "N26, Commerzbank, and DKB allow remote onboarding with a passport and address. You'll need a German IBAN for salary, rent, and utilities.",
    "before-you-go",
    "banking",
    -70,
    14,
    "If your employer insists on a traditional bank, open a Sparkasse account after Anmeldung.",
  ),
  task(
    "tbe_health",
    "Set up health insurance (TK / AOK)",
    "Health insurance is mandatory in Germany. TK and AOK accept newcomers — you can arrange cover before arrival so it starts on day one.",
    "before-you-go",
    "healthcare",
    -60,
    14,
    "Public insurance (gesetzlich) covers dependants free; private (privat) is cheaper for some freelancers but harder to leave.",
  ),
  task(
    "tbe_hunt",
    "Start apartment hunting (ImmobilienScout24)",
    "Berlin's rental market is brutal. Create a profile on ImmobilienScout24, prepare your Schufa-ready document pack, and set alerts.",
    "before-you-go",
    "housing",
    -60,
    60,
    "Landlords want proof of income, SCHUFA, and often a Mietschuldenfreiheitsbescheinigung.",
    [{ label: "ImmobilienScout24", url: "https://www.immobilienscout24.de" }],
  ),
  task(
    "tbe_docs",
    "Gather documents & translations",
    "Get birth certificates, degrees, and marriage certificates translated (beglaubigte Übersetzung) and apostilled where needed.",
    "getting-ready",
    "legal",
    -45,
    21,
    "Translators certified in Germany are required for official purposes — book ahead.",
  ),
  task(
    "tbe_shortlist",
    "Shortlist apartments & arrange viewings for arrival week",
    "Book viewings for the first few days after you arrive. Berlin apartments go fast — bring your full document folder to every viewing.",
    "getting-ready",
    "housing",
    -30,
    30,
    "Consider a Zwischenmiete (sublet) for the first 1–3 months while you find a permanent flat.",
  ),
  task(
    "tbe_move",
    "Arrange moving & pet transport",
    "Book an international mover or bring only essentials. Germany has strict pet import rules (rabies vaccine, microchip, EU health certificate).",
    "final-countdown",
    "transport",
    -14,
    10,
    "Get 3 mover quotes; declare goods on the German customs form (Zoll) if shipping.",
  ),
  task(
    "tbe_leave",
    "Cancel subscriptions & notify the embassy",
    "Cancel home-country subscriptions and notify your German embassy/consulate of your address change. Pack your Anmeldung document pack (passport, lease).",
    "final-countdown",
    "utilities",
    -7,
    5,
    "Print 3 copies of every document — you'll be asked for copies constantly.",
  ),
  task(
    "tbe_anmeldung",
    "Register your address (Anmeldung) at the Bürgeramt",
    "Register within 14 days of moving in. Book a Bürgeramt appointment the moment you have your lease; bring your passport, lease, and landlord's Wohnungsgeberbestätigung.",
    "arrival-week",
    "legal",
    2,
    2,
    "Slots can be 3–6 weeks out — check for early-morning walk-in offices (Bürgeramt ohne Termin).",
    [{ label: "Berlin Bürgeramt", url: "https://service.berlin.de/terminvereinbarung/" }],
  ),
  task(
    "tbe_sim",
    "Get a German SIM / eSIM",
    "Telekom, Vodafone, O2, or budget MVNOs (Aldi Talk, Congstar). Bring your passport for registration — it's mandatory in Germany.",
    "arrival-week",
    "utilities",
    3,
    1,
    "Many providers now offer eSIMs activated online before you land.",
  ),
  task(
    "tbe_bvg",
    "Get a BVG monthly pass (or Deutschlandticket)",
    "The BVG monthly pass covers all U-Bahn, S-Bahn, tram and bus in Berlin. The €58 Deutschlandticket covers all of Germany by regional transport.",
    "first-30-days",
    "transport",
    7,
    2,
    "Tourists pay €3+ per ride — the monthly pass pays for itself in ~9 rides.",
  ),
  task(
    "tbe_bank_activate",
    "Activate bank account & get your SCHUFA report",
    "Finalize your bank account with your Meldebescheinigung (registration certificate). Then request your SCHUFA credit report — landlords will ask for it.",
    "first-30-days",
    "banking",
    10,
    7,
    "Your SCHUFA score starts building once you're registered — a clean report is gold in Berlin.",
  ),
  task(
    "tbe_residence",
    "Book your residence permit appointment (Ausländerbehörde)",
    "If you're not an EU citizen, book the Ausländerbehörde appointment for your residence permit as soon as you have Anmeldung and health insurance.",
    "first-30-days",
    "visa",
    14,
    30,
    "Appointments take weeks — book immediately and keep your Fiktionsbescheinigung current.",
  ),
  task(
    "tbe_taxid",
    "Register for your German tax ID (Steuer-ID)",
    "Your Steuer-ID arrives by post automatically after Anmeldung. If it doesn't arrive in 4 weeks, request it from the local Finanzamt. Needed for every job and bank.",
    "first-30-days",
    "legal",
    21,
    7,
    "Employers ask for the tax ID — a temporary tax number works until it arrives.",
  ),
  task(
    "tbe_rundfunk",
    "Register for the Rundfunkbeitrag",
    "The mandatory public broadcasting fee (~€18.36/month) applies to every household. Register with ARD ZDF Deutschlandradio using your Anmeldung number.",
    "settling-in",
    "utilities",
    30,
    7,
    "You can't avoid it — ignoring the letters adds late fees. Register and pay it quietly.",
    [{ label: "Rundfunkbeitrag", url: "https://www.rundfunkbeitrag.de" }],
  ),
  task(
    "tbe_haftpflicht",
    "Get Haftpflicht (personal liability insurance)",
    "Haftpflichtversicherung covers damage you cause to others — Germans consider it essential, and landlords/employers often require it.",
    "settling-in",
    "housing",
    45,
    5,
    "It costs ~€60/year and covers a lifetime of accidents. Truly non-negotiable in Germany.",
  ),
  task(
    "tbe_vhs",
    "Enrol in a German language course (VHS)",
    "Volkshochschule (VHS) offers affordable in-person German classes. Aim for B1 — the level where bureaucracy and friendships start working.",
    "settling-in",
    "education",
    45,
    90,
    "Your employer may fund a course; ask before paying yourself.",
  ),
  task(
    "tbe_community",
    "Join Berlin expat & neighbourhood communities",
    "Join Global Mobilis Berlin groups, Meetup events, and your Kiez (neighbourhood) Facebook groups. Berlin's expat scene is huge — plug in early.",
    "settling-in",
    "community",
    60,
    30,
    "Stammtisch (regular meetups) are a classic way to meet people in Berlin.",
  ),
];

const DUBAI_TASKS: TimelineTask[] = [
  task(
    "tdu_offer",
    "Secure employment offer & entry permit",
    "Your employer sponsors your residency in Dubai. Confirm the offer letter, entry permit, and whether they cover flights, accommodation, and health insurance.",
    "before-you-go",
    "visa",
    -90,
    45,
    "Entry permits are valid for 2 months — time your arrival to maximize the stamping window.",
  ),
  task(
    "tdu_attest",
    "Attest your degree certificates",
    "Degrees need attestation: your home country's foreign ministry, then the UAE embassy, then the UAE Ministry of Foreign Affairs (MOFA). Start 2 months out — it's slow.",
    "before-you-go",
    "legal",
    -80,
    45,
    "Use a reputable attestation agency to avoid losing originals in the mail.",
  ),
  task(
    "tdu_culture",
    "Research local laws & cultural norms",
    "Dubai is liberal but has specific rules: dress codes, Ramadan etiquette, no public intoxication, and strict social media laws. Read up before you arrive.",
    "before-you-go",
    "community",
    -70,
    30,
    "The 'Dubai Expat' communities online are a goldmine of current, practical advice.",
  ),
  task(
    "tdu_healthins",
    "Arrange mandatory health insurance",
    "Health insurance is mandatory for all Dubai residents. Your employer must provide it (or you buy your own plan) — check coverage before you sign anything.",
    "before-you-go",
    "healthcare",
    -60,
    14,
    "Basic plans cover essential care; upgrade to a plan with international coverage if you travel.",
  ),
  task(
    "tdu_areas",
    "Research areas & budgets (Marina, JVC, Downtown)",
    "Compare Dubai Marina, JLT, Downtown, JVC, and Business Bay. Budget: rent is often paid in 1–4 cheques per year, plus 5% Ejari + 5% agency fee.",
    "before-you-go",
    "housing",
    -60,
    30,
    "Studio rents vary ~AED 35k–70k/year depending on area — set expectations early.",
  ),
  task(
    "tdu_prebank",
    "Pre-open a bank account (ENBD / ADCB)",
    "Emirates NBD and ADCB offer pre-arrival account opening for new residents with just your passport and entry permit.",
    "getting-ready",
    "banking",
    -45,
    14,
    "Salary accounts often come with free transfers and credit card offers.",
  ),
  task(
    "tdu_shortlist",
    "Shortlist apartments & arrange virtual viewings",
    "Dubai rentals move fast. Use Bayut/Dubizzle, arrange video viewings before you fly, and have your document pack ready (passport, visa, employment letter).",
    "getting-ready",
    "housing",
    -30,
    21,
    "Many landlords accept online signing with a power of attorney — but visit before committing.",
  ),
  task(
    "tdu_shipping",
    "Arrange shipment of belongings / vehicle",
    "Dubai has high customs duties on some goods. If importing a car, check RTA requirements and 55% duty on Japanese cars. Container shipping takes 4–8 weeks.",
    "getting-ready",
    "transport",
    -21,
    30,
    "Most expats ship only personal effects and buy furniture locally — cheaper and faster.",
  ),
  task(
    "tdu_docs",
    "Prepare your document pack",
    "Make copies of passport, visa, photos (white background, passport-size), and Emirates ID application form. Dubai runs on paperwork.",
    "final-countdown",
    "legal",
    -7,
    2,
    "Keep 10+ passport photos — you'll use them for ID cards, gyms, and more.",
  ),
  task(
    "tdu_medical",
    "Complete medical & biometrics for Emirates ID",
    "After arrival, do the medical fitness test (blood tests, chest X-ray) and biometric fingerprinting at an approved centre. Results take 2–5 days.",
    "arrival-week",
    "visa",
    3,
    5,
    "The medical centre will stamp your passport — don't lose that page.",
  ),
  task(
    "tdu_emirates",
    "Apply for your Emirates ID",
    "The Emirates ID is mandatory within 30 days of arrival and is your key to everything (SIM, banking, Ejari, health). Apply via the Federal Authority for Identity.",
    "arrival-week",
    "legal",
    5,
    10,
    "Carry the application slip until the physical card arrives — it works as proof.",
  ),
  task(
    "tdu_sim",
    "Get an Etisalat / du SIM card",
    "Buy a SIM from Etisalat or du (or an eSIM). Tourist plans are pricey — switch to a resident plan with your Emirates ID.",
    "arrival-week",
    "utilities",
    5,
    2,
    "Du and Etisalat both offer decent home internet bundles for new residents.",
  ),
  task(
    "tdu_nol",
    "Get a NOL card for the Metro",
    "Buy a NOL Silver card for Metro, tram, and bus travel. It's the cheapest way around Dubai.",
    "first-30-days",
    "transport",
    10,
    1,
    "Load a monthly pass if you commute daily — unlimited Metro is great value.",
  ),
  task(
    "tdu_ejari",
    "Register your tenancy contract with Ejari",
    "Ejari registration is mandatory for all rental contracts in Dubai and is required for DEWA, visas, and school registration. Your landlord/agent usually handles it.",
    "first-30-days",
    "housing",
    14,
    5,
    "Keep the Ejari certificate — you'll need it for DEWA and Emirates ID renewal.",
  ),
  task(
    "tdu_dewa",
    "Connect DEWA utilities",
    "Register with DEWA (Dubai Electricity & Water Authority) for your apartment — do it online with your Ejari and Emirates ID; deposits vary by property size.",
    "first-30-days",
    "utilities",
    14,
    3,
    "DEWA also issues the 'tenancy' proof some banks ask for.",
  ),
  task(
    "tdu_bank_activate",
    "Activate bank account with Emirates ID",
    "Visit your bank with Emirates ID + proof of residence to activate the account and set up salary transfer. You'll need it for cheques (rent) and credit cards.",
    "first-30-days",
    "banking",
    21,
    7,
    "Request a cheque book — Dubai rent is often paid by post-dated cheques.",
  ),
  task(
    "tdu_license",
    "Convert your driving licence",
    "Drivers from many countries can convert their licence without a test (via RTA). Bring your original licence + Emirates ID to an RTA customer service centre.",
    "settling-in",
    "transport",
    45,
    14,
    "If your country isn't on the exchange list, you'll take driving school classes and a test.",
    [{ label: "RTA licence conversion", url: "https://www.rta.ae" }],
  ),
  task(
    "tdu_maid",
    "Set up maid/nanny visa sponsorship (if applicable)",
    "If you're bringing a domestic worker, you must sponsor their visa through a Tasheel centre — it requires your Emirates ID, salary certificate, and accommodation proof.",
    "settling-in",
    "visa",
    60,
    30,
    "Budget AED 7,000–12,000 for the full sponsorship package including insurance and fees.",
  ),
  task(
    "tdu_community",
    "Join Dubai expat communities",
    "Join Global Mobilis Dubai groups, Dubai Expats forums, and neighbourhood WhatsApp groups. Friday brunches are the classic networking entry point.",
    "settling-in",
    "community",
    60,
    30,
    "Use the summer (hot season) to build your network — everything social ramps up in winter.",
  ),
];

const LISBON_TASKS: TimelineTask[] = [
  task(
    "tli_visa",
    "Apply for your D8 (digital nomad) or D7 (passive income) visa",
    "Apply at the Portuguese consulate in your home country. D8 requires remote-work income proof; D7 is for passive income. Processing can take 2–4 months.",
    "before-you-go",
    "visa",
    -90,
    75,
    "The consulate wants 3 months of payslips AND bank statements — format them exactly as requested.",
  ),
  task(
    "tli_nif",
    "Apply for your NIF (tax number) at Finanças",
    "The NIF is the key to everything in Portugal — bank accounts, rent, SIM, utilities. You can apply remotely with a fiscal representative before you land.",
    "before-you-go",
    "legal",
    -80,
    14,
    "Landlords and banks will refuse to deal with you without a NIF. Get it first.",
  ),
  task(
    "tli_lang",
    "Start Portuguese language basics",
    "Learn survival Portuguese (olá, obrigado, quanto custa). It's genuinely appreciated and unlocks everyday life. Apps + a tutor are enough for A1.",
    "before-you-go",
    "education",
    -70,
    90,
    "European Portuguese differs from Brazilian — stick to EU-PT resources.",
  ),
  task(
    "tli_areas",
    "Research neighbourhoods & budget",
    "Compare Alfama, Príncipe Real, Campo de Ourique, and Campolide. Lisbon rents have risen fast — a T1 in a central area is typically €1,100–1,600/month.",
    "before-you-go",
    "housing",
    -60,
    30,
    "Check the 'Golden Visa' knock-on: popular expat zones are priciest. Consider Alcântara or Marvila for value.",
  ),
  task(
    "tli_bank",
    "Open a Portuguese bank account (ActivoBank / Millennium)",
    "ActivoBank (free) and Millennium offer easy onboarding with your NIF and passport. Some allow remote opening with a fiscal rep.",
    "before-you-go",
    "banking",
    -50,
    14,
    "Portugal uses MB Way for nearly all payments — set it up after opening.",
  ),
  task(
    "tli_docs",
    "Gather income proof & rental documents",
    "For the D8/D7 you need a lease (or proof of accommodation intent), 3 months income evidence, and a cover letter. Have everything translated to Portuguese.",
    "getting-ready",
    "legal",
    -45,
    21,
    "A 12-month lease rather than 6 months strengthens the application significantly.",
  ),
  task(
    "tli_health",
    "Research SNS registration & private insurance",
    "Portugal's SNS is free at point of use but has waiting times; most expats keep private insurance (~€40–60/month). Plan your mix before arrival.",
    "getting-ready",
    "healthcare",
    -30,
    14,
    "Private insurers require a NIF and often a local address to quote.",
  ),
  task(
    "tli_shipping",
    "Arrange shipment of belongings",
    "Sea freight takes 4–8 weeks and door-to-door costs vary. Many expats ship a small container or just bring luggage and buy locally.",
    "final-countdown",
    "transport",
    -21,
    21,
    "Check duties for large electronics — VAT applies on new goods.",
  ),
  task(
    "tli_cancel",
    "Cancel subscriptions & notify home institutions",
    "Cancel home subscriptions, notify your bank/landlord, and forward mail. Keep digital copies of everything.",
    "final-countdown",
    "utilities",
    -7,
    5,
    "Portugal digitalizes bureaucracy well — store documents in a cloud folder.",
  ),
  task(
    "tli_aima",
    "Book your AIMA residence permit appointment",
    "AIMA (formerly SEF) handles residence permits — book the appointment as soon as you land; slots can be months away. Your D8 visa covers you meanwhile.",
    "arrival-week",
    "visa",
    3,
    5,
    "Many use a lawyer for AIMA — it's worth the money to avoid delays.",
  ),
  task(
    "tli_sns",
    "Register with SNS (health system)",
    "Register with the Serviço Nacional de Saúde using your NIF and residence proof. You'll get a user number (número de utente) for GP registration.",
    "first-30-days",
    "healthcare",
    7,
    7,
    "Pick a 'centro de saúde' near your address — your utente number is tied to it.",
  ),
  task(
    "tli_niss",
    "Apply for your NISS (social security number)",
    "Your NISS is needed for employment, invoices (recibos verdes), and some services. Apply at Segurança Social with your NIF and passport.",
    "first-30-days",
    "legal",
    10,
    7,
    "Freelancers register as trabalhador independente — set a reminder to file quarterly VAT.",
  ),
  task(
    "tli_rent",
    "Sign rental contract & register it (NIF receipts)",
    "Sign your lease with your NIF, ensure the landlord issues an electronic receipt (recibo), and the contract is registered. This is your residency proof.",
    "first-30-days",
    "housing",
    10,
    7,
    "Ask for the contract with 'duração' fixed — some landlords prefer 1-year terms.",
  ),
  task(
    "tli_utilities",
    "Set up utilities (EDP electricity & water)",
    "Contact EDP for electricity and the municipal water service with your NIF and lease. Also check fibre internet providers (NOS, MEO, Vodafone).",
    "first-30-days",
    "utilities",
    14,
    7,
    "EDP has an app; opt for 'tarifa simples' for cheaper standard rates.",
  ),
  task(
    "tli_bank_activate",
    "Activate bank & set up MB Way",
    "Finalize your bank account with residence proof and activate MB Way — Portugal's ubiquitous instant-payment system.",
    "first-30-days",
    "banking",
    21,
    5,
    "Some landlords ask for rent via MB Way or standing order — set it up.",
  ),
  task(
    "tli_viva",
    "Get a Viva Viagem card / Navegante pass",
    "Lisbon's Metro and Carris buses run on the Viva Viagem card. Monthly Navegante passes cover unlimited Metro/bus/train in the Lisbon region.",
    "first-30-days",
    "transport",
    30,
    2,
    "The Navegante municipal pass (~€40) is one of Europe's best transport deals.",
  ),
  task(
    "tli_nhr",
    "Apply for NHR (Non-Habitual Resident) tax regime",
    "The NHR regime offers big income-tax breaks for new residents — but it's time-sensitive and application windows change. Apply as soon as you're tax-resident.",
    "settling-in",
    "legal",
    45,
    30,
    "Rules have tightened recently — confirm current eligibility with a Portuguese accountant.",
  ),
  task(
    "tli_langcourse",
    "Enrol in a Portuguese language course",
    "Level up from apps to a structured course (in-person or online). B1 opens doors to residency applications and deeper social life.",
    "settling-in",
    "education",
    45,
    90,
    "The Portuguese government funds free courses for migrants — check your local school.",
  ),
  task(
    "tli_community",
    "Join Lisbon expat communities",
    "Join Global Mobilis Lisbon groups and expat meetups. Lisbon has a huge, welcoming nomad community — networking here is easy.",
    "settling-in",
    "community",
    60,
    30,
    "Look for 'Vida em Lisboa' style Facebook groups for practical local advice.",
  ),
];

const LONDON_TASKS: TimelineTask[] = [
  task(
    "tlo_visa",
    "Apply for your UK visa (Skilled Worker / spouse)",
    "Apply for the Skilled Worker visa (with Certificate of Sponsorship from your employer) or spouse/partner visa. Priority processing takes ~3 weeks.",
    "before-you-go",
    "visa",
    -90,
    45,
    "Keep your Certificate of Sponsorship number — you'll need it for the BRP/ eVisa and banking.",
  ),
  task(
    "tlo_bank",
    "Open a UK bank account (Monzo / HSBC)",
    "Monzo, Starling, and HSBC offer newcomer accounts. A UK address or BRP letter is usually required — some allow pre-arrival opening with your visa vignette.",
    "before-you-go",
    "banking",
    -70,
    21,
    "Open a Monzo or Revolut first for instant onboarding, then a high-street account for salaries.",
  ),
  task(
    "tlo_areas",
    "Research areas & budget (Zone 2/3)",
    "Compare Clapham, Hackney, Greenwich, and Fulham for family life, or Shoreditch/Old Street for nightlife. Budget: 35% of net income for rent is the norm.",
    "before-you-go",
    "housing",
    -60,
    30,
    "Use Rightmove/Zoopla to get a feel for prices — and check the commute on Citymapper.",
  ),
  task(
    "tlo_docs",
    "Gather your document pack",
    "Collect passport, visa vignette, employment contract, and proof of address. For rentals you'll also need a right-to-rent share code.",
    "getting-ready",
    "legal",
    -45,
    14,
    "Get a share code from gov.uk for the right-to-rent check — landlords require it.",
  ),
  task(
    "tlo_school",
    "Check school catchments (if bringing children)",
    "London primary/secondary admissions are catchment-based. Check school finder maps and the admissions timetable for your borough.",
    "getting-ready",
    "education",
    -45,
    21,
    "Popular schools fill fast — apply as early as the system allows.",
  ),
  task(
    "tlo_shipping",
    "Arrange shipment of belongings",
    "Door-to-door sea freight takes 3–6 weeks. Many expats ship a small amount and buy furniture here (IKEA/Argos are cheap).",
    "getting-ready",
    "transport",
    -30,
    21,
    "Check the UK import allowance and VAT on new goods.",
  ),
  task(
    "tlo_mail",
    "Cancel subscriptions & set up mail forwarding",
    "Cancel home subscriptions and set up mail forwarding. If you have UK ties, Royal Mail redirect is straightforward.",
    "final-countdown",
    "utilities",
    -14,
    7,
    "Digitise your documents — the UK government is digital-first.",
  ),
  task(
    "tlo_brp",
    "Get your BRP / eVisa access details",
    "The UK is moving to eVisas. Follow your BRP letter or eVisa instructions: collect your BRP from the post office or link your passport to your UKVI account.",
    "final-countdown",
    "visa",
    -7,
    7,
    "Screenshot your eVisa share code — you'll use it for rent, work, and banking.",
  ),
  task(
    "tlo_keys",
    "Collect keys & complete right-to-rent check",
    "Collect your flat keys and complete the right-to-rent check with your landlord/agent (share code + passport). Move in and register for council tax.",
    "arrival-week",
    "housing",
    3,
    3,
    "Take meter readings and photos of the flat on day one — disputes are common.",
  ),
  task(
    "tlo_ni",
    "Apply for your National Insurance number",
    "Call HMRC to apply for an NI number, or apply online if you have biometric residence status. It's required for work and tax.",
    "first-30-days",
    "legal",
    7,
    14,
    "You can start work without it — your employer uses a temporary number.",
    [{ label: "Apply for an NI number", url: "https://www.gov.uk/apply-national-insurance-number" }],
  ),
  task(
    "tlo_oyster",
    "Get an Oyster card / set up contactless",
    "TfL runs on Oyster or contactless (a contactless bank card is cheapest — it caps fares automatically). Get an Oyster if you want a Railcard discount.",
    "first-30-days",
    "transport",
    7,
    2,
    "Use the same contactless card for every journey to benefit from daily/weekly capping.",
  ),
  task(
    "tlo_gp",
    "Register with a local GP (NHS)",
    "Find your nearest NHS GP and register — you don't need to be fully settled, just live in the area. Bring your BRP and proof of address.",
    "first-30-days",
    "healthcare",
    10,
    7,
    "Register even if you're healthy — GP lists close and emergency care is harder without one.",
  ),
  task(
    "tlo_council",
    "Register for council tax",
    "Register with your local council for council tax (billing band + single-person discount if applicable). Fines apply for late registration.",
    "first-30-days",
    "legal",
    14,
    7,
    "Ask for a 'single person discount' (25%) if you live alone.",
  ),
  task(
    "tlo_tvlicence",
    "Get a TV licence",
    "You need a TV licence (~£169/year) to watch live TV or BBC iPlayer. Apply online once you have an address.",
    "settling-in",
    "utilities",
    30,
    3,
    "No licence needed if you only watch streaming services (Netflix etc.) — but not iPlayer.",
    [{ label: "TV Licence", url: "https://www.tvlicensing.co.uk" }],
  ),
  task(
    "tlo_deposit",
    "Ensure your tenancy deposit is protected",
    "By law, your landlord must protect your deposit in a government scheme (DPS/TDS/mydeposits) within 30 days. Check — unprotected deposits are a legal breach.",
    "settling-in",
    "housing",
    30,
    5,
    "Keep the deposit certificate — you'll need it to get your money back.",
  ),
  task(
    "tlo_private_health",
    "Consider private health / dental insurance",
    "NHS covers most care free, but dentistry and some treatments are private. Many expats add private insurance or a dental plan.",
    "settling-in",
    "healthcare",
    45,
    14,
    "Bupa and Vitality offer expat plans; dental-only policies are cheaper.",
  ),
  task(
    "tlo_hmrc",
    "Register for HMRC self-assessment (if applicable)",
    "If you're self-employed, a high earner, or have foreign income, register for self-assessment by 5 October. HMRC will send you a tax return.",
    "settling-in",
    "legal",
    45,
    14,
    "Non-UK income may be taxable in the UK after you become resident — check the residence rules.",
  ),
  task(
    "tlo_vote",
    "Register to vote",
    "UK, Irish, and qualifying Commonwealth citizens can register to vote in local and general elections. Do it online in 5 minutes.",
    "settling-in",
    "legal",
    60,
    5,
    "Voting rights vary by nationality — check gov.uk eligibility.",
  ),
  task(
    "tlo_community",
    "Join London expat & local communities",
    "Join Global Mobilis London groups, Meetup, and neighbourhood forums. London is huge — pick one or two communities to commit to.",
    "settling-in",
    "community",
    60,
    30,
    "Try a 'London Social' group or your local pub quiz to meet people fast.",
  ),
];

const SYDNEY_TASKS: TimelineTask[] = [
  task(
    "tsy_visa",
    "Apply for your Australian visa",
    "Apply for the right visa (Skilled/Employer-sponsored/Working Holiday). Offshore processing takes 4–12 weeks for skilled visas.",
    "before-you-go",
    "visa",
    -90,
    60,
    "Use a registered migration agent if your case is complex — errors are costly.",
  ),
  task(
    "tsy_bank",
    "Open an Australian bank account remotely (CommBank / NAB)",
    "Commonwealth Bank, NAB, and Westpac let you open a bank account before arrival — you'll get your BSB/account number to transfer funds and receive salary.",
    "before-you-go",
    "banking",
    -70,
    14,
    "Bring your tax file number application (TFN) when you visit a branch to activate.",
  ),
  task(
    "tsy_suburbs",
    "Research suburbs & budget",
    "Compare the inner west (Newtown, Marrickville), northern beaches, and eastern suburbs. Sydney rents are among the world's highest — budget accordingly.",
    "before-you-go",
    "housing",
    -60,
    30,
    "Rent is usually quoted per week in Sydney ($600–$1,000/wk for a 1–2 bed).",
  ),
  task(
    "tsy_healthins",
    "Arrange private health insurance (avoid LHC loading)",
    "If you're over 30 and earning above the threshold, private hospital cover avoids the Medicare Levy Surcharge and Lifetime Health Cover loading — arrange within 12 months of residency.",
    "before-you-go",
    "healthcare",
    -60,
    14,
    "Compare funds on the government's privatehealth.gov.au tool.",
  ),
  task(
    "tsy_schools",
    "Check school catchments (NSW school finder)",
    "If bringing kids, check the current NSW public school catchment map. Popular schools enforce zones hard — you need to live inside before enrolment.",
    "before-you-go",
    "education",
    -60,
    21,
    "Catchment boundaries change yearly — always check the current map, not last year's.",
  ),
  task(
    "tsy_docs",
    "Gather documents & translations",
    "Prepare birth certificates, degrees, and marriage certificates (translated if not in English). You'll need them for schools, licensing, and some banks.",
    "getting-ready",
    "legal",
    -45,
    14,
    "Digital copies are accepted for most things — keep a secure cloud folder.",
  ),
  task(
    "tsy_shipping",
    "Arrange shipment of belongings",
    "Sea freight to Sydney takes 6–10 weeks. A 20ft container is ~$4,000–6,000; a few cubic metres via groupage is cheaper. Pets need quarantine arrangements.",
    "getting-ready",
    "transport",
    -30,
    45,
    "Australia has strict biosecurity — declare everything honestly or face heavy fines.",
  ),
  task(
    "tsy_stay",
    "Book temporary accommodation & shortlist rentals",
    "Book an Airbnb/serviced apartment for your first 2–4 weeks and start rental inspections (Domain/Realestate.com.au). Sydney rentals require proof of income and references.",
    "getting-ready",
    "housing",
    -14,
    30,
    "Attend inspections in person if possible — applications are competitive.",
  ),
  task(
    "tsy_cancel",
    "Cancel subscriptions & forward mail",
    "Cancel home subscriptions, notify banks, and set up mail forwarding. Pack a folder with your visa grant notice and passport.",
    "final-countdown",
    "utilities",
    -7,
    5,
    "Print your visa grant notification — airlines and rental agents ask for it.",
  ),
  task(
    "tsy_tfn",
    "Apply for your TFN (Tax File Number)",
    "Apply for a TFN at the ATO (free, online, ~2 weeks). You need it for work, superannuation, and bank interest.",
    "arrival-week",
    "legal",
    3,
    14,
    "Without a TFN, banks and employers withhold tax at 47% — apply immediately.",
    [{ label: "Apply for TFN", url: "https://www.ato.gov.au/individuals/tax-file-number" }],
  ),
  task(
    "tsy_medicare",
    "Enrol in Medicare",
    "If you're eligible (PR, some visa holders, or reciprocal health care agreement), enrol in Medicare at a Services Australia office with your visa grant and passport.",
    "first-30-days",
    "healthcare",
    7,
    7,
    "Brits and Kiwis get reciprocal cover — check eligibility before paying for private.",
  ),
  task(
    "tsy_bank_activate",
    "Activate bank account & set up superannuation",
    "Visit your bank with your TFN and activate the account. Choose a superannuation fund (or use your employer's default) — super is compulsory for employees.",
    "first-30-days",
    "banking",
    10,
    7,
    "If you're moving on temporarily, you can claim super back when you leave (DASP).",
  ),
  task(
    "tsy_opal",
    "Get an Opal card",
    "The Opal card covers trains, buses, ferries, and light rail across Sydney with automatic daily/weekly caps. Use contactless bank cards too.",
    "first-30-days",
    "transport",
    10,
    2,
    "Tap on and off the same way every trip to get the fare caps.",
  ),
  task(
    "tsy_bond",
    "Lodge your rental bond with NSW RBO",
    "Your landlord must lodge your bond (usually 4 weeks' rent) with the NSW Rental Bonds Online system. Check it's lodged — it protects your deposit.",
    "first-30-days",
    "housing",
    14,
    5,
    "Never pay a bond into a personal account — it must go to the official RBO.",
  ),
  task(
    "tsy_super",
    "Finalise superannuation fund setup",
    "If your employer uses a default fund, you can still choose your own (e.g. Hostplus, AustralianSuper). Complete the Choice of Fund form to control fees and insurance.",
    "first-30-days",
    "banking",
    21,
    7,
    "Consolidate old funds to avoid multiple fee drains.",
  ),
  task(
    "tsy_license",
    "Convert your driver's licence (Service NSW)",
    "Licences from recognised countries can be converted at Service NSW (knowledge test may be required). You must convert after 3 months of residency.",
    "settling-in",
    "transport",
    45,
    14,
    "Book the knowledge test early — Service NSW slots go fast.",
  ),
  task(
    "tsy_pet",
    "Register your pet with the local council",
    "Dogs and cats must be registered (microchipped) with your local council in NSW. Fees are annual and low.",
    "settling-in",
    "legal",
    45,
    7,
    "Desexed pets get discounted registration.",
  ),
  task(
    "tsy_ambulance",
    "Consider ambulance cover",
    "Medicare does NOT cover ambulance in NSW — a ride can cost $400+. Add ambulance cover to your private policy or pay the annual subscription.",
    "settling-in",
    "healthcare",
    60,
    7,
    "The Ambulance Service of NSW membership is ~$60/year for an individual.",
  ),
  task(
    "tsy_beach",
    "Beach safety orientation & join the community",
    "Do a beach-safety orientation (flags, rips) — lifesavers.org.au has free courses. Join Global Mobilis Sydney groups and local communities.",
    "settling-in",
    "community",
    60,
    14,
    "Swim only between the red-and-yellow flags — rips take lives every year.",
  ),
];

const GENERIC_TASKS: TimelineTask[] = [
  task(
    "tge_visa",
    "Research & apply for the right visa / permit",
    "Identify the visa or residence permit for your situation (work, study, digital nomad, family, retirement) and apply with enough lead time — many take months.",
    "before-you-go",
    "visa",
    -90,
    60,
    "Book consulate appointments early — slots fill up weeks or months ahead.",
  ),
  task(
    "tge_docs",
    "Get documents translated & apostilled",
    "Translate and apostille (or legalize) your key documents: birth certificate, marriage certificate, degrees, and police clearance.",
    "before-you-go",
    "legal",
    -75,
    30,
    "Some countries accept scanned copies; others need originals — check before shipping.",
  ),
  task(
    "tge_lang",
    "Start learning the local language",
    "Learn survival phrases and the alphabet basics. Even A1-level effort transforms daily life and bureaucracy.",
    "before-you-go",
    "education",
    -60,
    90,
    "Use a language app daily + a tutor weekly for speaking practice.",
  ),
  task(
    "tge_housing",
    "Research the housing market & costs",
    "Understand rent levels, deposit requirements, and whether leases are 1-year or month-to-month. Budget 3 months of living costs as a buffer.",
    "before-you-go",
    "housing",
    -60,
    30,
    "Check expat forums for the real (not advertised) cost of rent and deposits.",
  ),
  task(
    "tge_bank",
    "Research banks & pre-open an account",
    "Find out which banks welcome newcomers, whether you can open remotely, and what documents they need (passport, visa, proof of address).",
    "getting-ready",
    "banking",
    -45,
    14,
    "Ask your employer or school which bank they use — payroll integration makes life easier.",
  ),
  task(
    "tge_health",
    "Research the health system & insurance",
    "Understand whether healthcare is public, private, or mandatory-insurance — and what coverage you need for the gap between arrival and enrolment.",
    "getting-ready",
    "healthcare",
    -45,
    14,
    "Check if your home country has reciprocal health agreements with your destination.",
  ),
  task(
    "tge_shipping",
    "Arrange shipping of belongings",
    "Decide what to ship vs. buy locally. Get quotes early; sea freight is slow, so time it against your move date.",
    "getting-ready",
    "transport",
    -30,
    30,
    "Most expats regret shipping furniture — sell it and buy local.",
  ),
  task(
    "tge_digitise",
    "Digitise all documents & share with family",
    "Scan every document (passport, visa, lease, degrees, insurance) into one secure cloud folder and share access with a family member.",
    "final-countdown",
    "legal",
    -14,
    5,
    "Also save offline copies — you'll be asked for documents repeatedly.",
  ),
  task(
    "tge_cancel",
    "Cancel subscriptions & notify your institutions",
    "Cancel or pause subscriptions, notify banks and your landlord, and set up mail forwarding. Get a prepaid card or credit line for the first weeks.",
    "final-countdown",
    "utilities",
    -7,
    5,
    "Keep one international card with no foreign-transaction fees as a backup.",
  ),
  task(
    "tge_sim",
    "Get a local SIM card",
    "Buy a local SIM or eSIM within the first days. Many countries require ID (passport) for SIM registration.",
    "arrival-week",
    "utilities",
    3,
    1,
    "An eSIM activated before you fly means data the moment you land.",
  ),
  task(
    "tge_authorities",
    "Register with local authorities / get your tax ID",
    "Find out what registration is required (address registration, tax number, alien registration) and do it early — everything else depends on it.",
    "arrival-week",
    "legal",
    5,
    7,
    "This is usually the single most important admin task in any country.",
  ),
  task(
    "tge_bank_local",
    "Open a local bank account",
    "Open your local account with your ID and registration documents. Set up salary/transfer arrangements and any local payment apps.",
    "first-30-days",
    "banking",
    14,
    7,
    "Bank accounts + local SIM unlock almost everything else (rent, phone contracts, salary).",
  ),
  task(
    "tge_health_local",
    "Enrol in the local health system",
    "Complete health-system enrolment (GP registration, insurance, or public health number) — even if you don't need care yet.",
    "first-30-days",
    "healthcare",
    21,
    7,
    "Register before you need it — appointments and paperwork take weeks.",
  ),
  task(
    "tge_transport",
    "Learn the transport system & get a pass",
    "Understand the local transit system (metro, bus, bike share) and buy the monthly pass or travel card that suits your commute.",
    "settling-in",
    "transport",
    30,
    7,
    "A monthly pass usually pays for itself in 10–15 trips.",
  ),
  task(
    "tge_housing_long",
    "Secure long-term housing",
    "Move from temporary accommodation into a long-term rental. Confirm the lease terms, deposit protection, and utilities are all in your name.",
    "settling-in",
    "housing",
    45,
    30,
    "Give yourself 2–4 weeks overlap between temp housing and the lease start.",
  ),
  task(
    "tge_community",
    "Connect with the expat community",
    "Join Global Mobilis groups for your destination, plus local meetups and community events. Your network is your safety net.",
    "settling-in",
    "community",
    45,
    30,
    "Accept the first few social invitations even if you're tired — it compounds.",
  ),
  task(
    "tge_laws",
    "Learn local laws & save emergency numbers",
    "Read up on key local laws (driving, alcohol, work rights, data/privacy) and save the local emergency numbers (police, ambulance, fire).",
    "settling-in",
    "legal",
    60,
    7,
    "Save the local equivalent of 911 plus your embassy's emergency line.",
  ),
];

const TEMPLATES: Record<string, TimelineTask[]> = {
  Toronto: TORONTO_TASKS,
  Berlin: BERLIN_TASKS,
  Dubai: DUBAI_TASKS,
  Lisbon: LISBON_TASKS,
  London: LONDON_TASKS,
  Sydney: SYDNEY_TASKS,
  Generic: GENERIC_TASKS,
};

/** Case-insensitive template lookup with "Generic" fallback. */
export function resolveTemplate(destination: string): {
  name: string;
  tasks: TimelineTask[];
} {
  const match = Object.keys(TEMPLATES).find(
    (name) => name.toLowerCase() === destination.trim().toLowerCase(),
  );
  if (match) return { name: match, tasks: TEMPLATES[match] };
  return { name: "Generic", tasks: TEMPLATES.Generic };
}

// =============================================================================
// JSON file persistence (dynamic node imports — see header note)
// =============================================================================

async function readTimelines(): Promise<UserTimeline[]> {
  const { join } = await import("node:path");
  const { existsSync, readFileSync } = await import("node:fs");
  const file = join(process.cwd(), "data", "timelines.json");
  try {
    if (existsSync(file)) {
      const parsed = JSON.parse(readFileSync(file, "utf-8"));
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("timeline: failed to read timelines.json", err);
  }
  return [];
}

async function writeTimelines(timelines: UserTimeline[]): Promise<void> {
  const { join } = await import("node:path");
  const { mkdirSync, writeFileSync } = await import("node:fs");
  const dir = join(process.cwd(), "data");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "timelines.json"), JSON.stringify(timelines, null, 2));
}

// =============================================================================
// Helpers
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

function computeProgress(tasks: TimelineTaskView[]): TimelineProgress {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  return {
    total,
    completed,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

function toTimelineDetail(timeline: UserTimeline): TimelineDetail {
  const { name, tasks: template } = resolveTemplate(timeline.destination);
  const taskById = new Map(template.map((t) => [t.id, t]));
  const views: TimelineTaskView[] = timeline.tasks.map((ut) => {
    const base = taskById.get(ut.taskId);
    return {
      ...(base ?? {
        id: ut.taskId,
        title: ut.taskId,
        description: "",
        phase: "settling-in" as TimelinePhase,
        category: "legal" as TimelineCategory,
        daysBeforeMove: 0,
        durationDays: 1,
        externalLinks: [],
        tips: "",
      }),
      completed: ut.completed,
      completedAt: ut.completedAt,
      notes: ut.notes,
    };
  });
  views.sort((a, b) => a.daysBeforeMove - b.daysBeforeMove);
  return {
    destination: name,
    destinationFlag: DESTINATION_FLAGS[name] ?? "🌍",
    moveDate: timeline.moveDate,
    createdAt: timeline.createdAt,
    tasks: views,
    progress: computeProgress(views),
  };
}

function isValidDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime());
}

// =============================================================================
// Server Functions
// =============================================================================

/** Everything the timeline page needs in one round-trip. */
export const getTimelineData = createServerFn({ method: "GET" }).handler(
  async (): Promise<TimelineData> => {
    const user = await getCurrentUser();
    if (!user) return { currentUser: null, timeline: null };

    const timelines = await readTimelines();
    const mine = timelines.find((t) => t.userId === user.userId);
    return {
      currentUser: { id: user.userId, name: user.name },
      timeline: mine ? toTimelineDetail(mine) : null,
    };
  },
);

/** The current user's active timeline (or null). */
export const getMyTimeline = createServerFn({ method: "GET" }).handler(
  async (): Promise<TimelineDetail | null> => {
    const user = await getCurrentUser();
    if (!user) return null;
    const timelines = await readTimelines();
    const mine = timelines.find((t) => t.userId === user.userId);
    return mine ? toTimelineDetail(mine) : null;
  },
);

/** Generate a fresh timeline for the given destination + move date. */
export const generateTimeline = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<TimelineActionResult> => {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "You must be signed in to do that." };
    }

    // NOTE: browsers send POST args as FormData (the framework's seroval
    // envelope can't be parsed by this server build, so we avoid JSON args).
    const destination = getStrField(data, "destination");
    const moveDate = getStrField(data, "moveDate");
    if (!destination || !destination.trim()) {
      return { success: false, error: "Please choose a destination." };
    }
    if (!moveDate || !isValidDate(moveDate)) {
      return { success: false, error: "Please choose a valid move date." };
    }

    const { name, tasks: template } = resolveTemplate(destination);

    const timeline: UserTimeline = {
      userId: user.userId,
      destination: name,
      moveDate,
      tasks: template.map((t) => ({
        taskId: t.id,
        completed: false,
      })),
      createdAt: new Date().toISOString(),
    };

    const timelines = await readTimelines();
    const idx = timelines.findIndex((t) => t.userId === user.userId);
    if (idx >= 0) timelines[idx] = timeline;
    else timelines.push(timeline);
    await writeTimelines(timelines);

    return { success: true, timeline: toTimelineDetail(timeline) };
  },
);

/** Toggle/update a single task in the user's timeline. */
export const updateTask = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<TimelineActionResult> => {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "You must be signed in to do that." };
    }

    const taskId = getStrField(data, "taskId");
    const completed = getStrField(data, "completed") === "true";
    const notes = getStrField(data, "notes");
    if (!taskId) return { success: false, error: "Task is required." };

    const timelines = await readTimelines();
    const mine = timelines.find((t) => t.userId === user.userId);
    if (!mine) {
      return { success: false, error: "You don't have a timeline yet." };
    }

    const ut = mine.tasks.find((t) => t.taskId === taskId);
    if (!ut) return { success: false, error: "Task not found in your timeline." };

    if (typeof completed === "boolean") {
      ut.completed = completed;
      ut.completedAt = completed
        ? new Date().toISOString()
        : undefined;
    }
    if (typeof notes === "string") {
      ut.notes = notes.trim() ? notes.trim() : undefined;
    }

    await writeTimelines(timelines);
    return { success: true, timeline: toTimelineDetail(mine) };
  },
);

/** Progress summary for the dashboard widget. */
export const getTimelineProgress = createServerFn({ method: "GET" }).handler(
  async (): Promise<TimelineProgress | null> => {
    const user = await getCurrentUser();
    if (!user) return null;
    const timelines = await readTimelines();
    const mine = timelines.find((t) => t.userId === user.userId);
    if (!mine) return null;
    return toTimelineDetail(mine).progress;
  },
);

/** Delete/reset the current user's timeline. */
export const deleteTimeline = createServerFn({ method: "POST" }).handler(
  async (): Promise<TimelineActionResult> => {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "You must be signed in to do that." };
    }
    const timelines = await readTimelines();
    const remaining = timelines.filter((t) => t.userId !== user.userId);
    await writeTimelines(remaining);
    return { success: true, timeline: null };
  },
);
