// Referral system — unique codes, click tracking, and signup attribution.

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), ".data");
const REFERRALS_FILE = join(DATA_DIR, "referrals.json");
const REFERRED_BY_FILE = join(DATA_DIR, "referred-by.json");

export interface ReferralCode {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  code: string;
  clicks: number;
  signups: number;
  created_at: string;
}

export interface ReferralLink {
  referrer_id: string;
  referrer_code: string;
  new_user_id: string;
  new_user_email: string;
  signed_up_at: string;
}

// ── Load / Save ──────────────────────────────────────

function loadRefs(): ReferralCode[] {
  try { if (existsSync(REFERRALS_FILE)) return JSON.parse(readFileSync(REFERRALS_FILE, "utf-8")); } catch {}
  return [];
}

function saveRefs(refs: ReferralCode[]): void {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(REFERRALS_FILE, JSON.stringify(refs, null, 2));
}

function loadReferredBy(): ReferralLink[] {
  try { if (existsSync(REFERRED_BY_FILE)) return JSON.parse(readFileSync(REFERRED_BY_FILE, "utf-8")); } catch {}
  return [];
}

function saveReferredBy(links: ReferralLink[]): void {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(REFERRED_BY_FILE, JSON.stringify(links, null, 2));
}

// ── Code Generation ──────────────────────────────────

function generateCode(userId: string): string {
  const hash = userId.replace(/[^a-zA-Z0-9]/g, "").slice(-6);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `gm_${hash}${suffix}`.toLowerCase();
}

// ── Public API ───────────────────────────────────────

/** Get or create a referral code for a user */
export function getOrCreateReferralCode(user: {
  id: string;
  name: string;
  email: string;
}): ReferralCode {
  const refs = loadRefs();
  const existing = refs.find((r) => r.user_id === user.id);
  if (existing) return existing;

  const code = generateCode(user.id);
  const entry: ReferralCode = {
    id: `ref_${Date.now()}`,
    user_id: user.id,
    user_name: user.name,
    user_email: user.email,
    code,
    clicks: 0,
    signups: 0,
    created_at: new Date().toISOString(),
  };
  refs.push(entry);
  saveRefs(refs);
  return entry;
}

/** Get a referral code by its code string */
export function getReferralByCode(code: string): ReferralCode | null {
  return loadRefs().find((r) => r.code === code.toLowerCase()) || null;
}

/** Record a click on a referral link */
export function recordReferralClick(code: string): void {
  const refs = loadRefs();
  const ref = refs.find((r) => r.code === code.toLowerCase());
  if (ref) {
    ref.clicks += 1;
    saveRefs(refs);
  }
}

/** Record a signup attributed to a referral code. Returns the referrer info or null. */
export function recordReferralSignup(
  code: string,
  newUserId: string,
  newUserEmail: string,
): ReferralCode | null {
  const refs = loadRefs();
  const ref = refs.find((r) => r.code === code.toLowerCase());
  if (!ref) return null;

  ref.signups += 1;
  saveRefs(refs);

  const links = loadReferredBy();
  links.push({
    referrer_id: ref.user_id,
    referrer_code: code,
    new_user_id: newUserId,
    new_user_email: newUserEmail,
    signed_up_at: new Date().toISOString(),
  });
  saveReferredBy(links);

  return ref;
}

/** Get the referral progress for a user */
export function getReferralProgress(userId: string): {
  code: ReferralCode | null;
  count: number;
  needed: number;
  completed: boolean;
} {
  const refs = loadRefs();
  const code = refs.find((r) => r.user_id === userId) || null;
  const count = code?.signups || 0;
  return {
    code,
    count,
    needed: 3,
    completed: count >= 3,
  };
}

/** Get who referred a specific user */
export function getReferredBy(userId: string): ReferralLink | null {
  return loadReferredBy().find((l) => l.new_user_id === userId) || null;
}
