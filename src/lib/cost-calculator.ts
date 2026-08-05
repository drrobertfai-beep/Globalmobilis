/**
 * Global Mobilis — Cost of Living Calculator
 * Compare estimated monthly expenses between any two destinations.
 * Pure comparison logic is shared between client (live slider updates)
 * and server (compareCostOfLiving POST server fn, FormData-safe).
 */
import { createServerFn } from "@tanstack/react-start";
import { SEED_DESTINATIONS } from "./destinations";
import type { Destination } from "~/db.types";

// =============================================================================
// Types
// =============================================================================
export interface CostBreakdown {
  rent: number;
  utilities: number;
  groceries: number;
  transport: number;
  dining: number;
  entertainment: number;
  healthcare: number;
  childcare: number;
  misc: number;
}

export type CostCategory = keyof CostBreakdown;

export interface CategoryDef {
  key: CostCategory;
  label: string;
  icon: string;
  min: number;
  max: number;
  step: number;
}

export type PresetKey = "single" | "family" | "student" | "custom";

export interface Preset {
  key: PresetKey;
  label: string;
  icon: string;
  description: string;
}

export interface CityCostView {
  id: string;
  city: string;
  country: string;
  flag: string;
  currency: string;
  costOfLivingIndex: number;
  breakdown: CostBreakdown;
  total: number;
}

export interface PerCategoryDelta {
  category: CostCategory;
  label: string;
  icon: string;
  from: number;
  to: number;
  delta: number; // to - from
}

export interface ComparisonResult {
  from: CityCostView;
  to: CityCostView;
  difference: number; // to.total - from.total (negative = to is cheaper)
  percentDiff: number;
  savings: boolean; // true when destination "to" is cheaper than "from"
  perCategory: PerCategoryDelta[];
}

// =============================================================================
// Category definitions (slider ranges)
// =============================================================================
export const COST_CATEGORIES: CategoryDef[] = [
  { key: "rent", label: "Rent", icon: "🏠", min: 0, max: 8000, step: 50 },
  { key: "utilities", label: "Utilities", icon: "💡", min: 0, max: 800, step: 10 },
  { key: "groceries", label: "Groceries", icon: "🛒", min: 0, max: 2000, step: 25 },
  { key: "transport", label: "Transport", icon: "🚇", min: 0, max: 800, step: 10 },
  { key: "dining", label: "Dining out", icon: "🍽️", min: 0, max: 1500, step: 25 },
  { key: "entertainment", label: "Entertainment", icon: "🎬", min: 0, max: 1000, step: 25 },
  { key: "healthcare", label: "Healthcare", icon: "🏥", min: 0, max: 1500, step: 25 },
  { key: "childcare", label: "Childcare", icon: "👶", min: 0, max: 2500, step: 50 },
  { key: "misc", label: "Miscellaneous", icon: "🧾", min: 0, max: 1500, step: 25 },
];

// =============================================================================
// Presets
// =============================================================================
export const PRESETS: Preset[] = [
  { key: "single", label: "Single professional", icon: "💼", description: "One person renting a 1-bedroom apartment" },
  { key: "family", label: "Family of four", icon: "👨‍👩‍👧‍👦", description: "Two adults + two children in a 3-bedroom home" },
  { key: "student", label: "Student / budget", icon: "🎓", description: "Budget living, minimal discretionary spend" },
  { key: "custom", label: "Custom", icon: "🎛️", description: "Adjust each category with the sliders below" },
];

type BasePreset = Exclude<PresetKey, "custom">;

const PRESET_FACTORS: Record<
  BasePreset,
  {
    rent: "1br" | "3br";
    scale: number; // discretionary multiplier (dining, entertainment, misc)
    childcare: boolean;
    utilities?: number;
    groceries?: number;
    transport?: number;
    healthcare?: number;
  }
> = {
  single: { rent: "1br", scale: 1, childcare: false },
  family: {
    rent: "3br",
    scale: 1.35,
    childcare: true,
    utilities: 1.4,
    groceries: 1.8,
    transport: 1.5,
    healthcare: 2.2,
  },
  student: {
    rent: "1br",
    scale: 0.6,
    childcare: false,
    groceries: 0.75,
    transport: 0.8,
    healthcare: 0.8,
  },
};

function round(n: number): number {
  return Math.round(n);
}

/** Snap a value to its category's slider step so knob, label and totals agree. */
function snap(n: number, key: CostCategory): number {
  const step = COST_CATEGORIES.find((c) => c.key === key)?.step ?? 25;
  return Math.round(n / step) * step;
}

// =============================================================================
// Pure comparison logic (client + server safe)
// =============================================================================
export function baseCosts(dest: Destination, preset: BasePreset): CostBreakdown {
  const f = PRESET_FACTORS[preset];
  const groceries = snap(round(dest.avg_monthly_groceries * (f.groceries ?? 1)), "groceries");
  const idx = dest.cost_of_living_index;
  return {
    rent: snap(round(f.rent === "3br" ? dest.avg_rent_3br : dest.avg_rent_1br), "rent"),
    utilities: snap(round(dest.avg_monthly_utilities * (f.utilities ?? 1)), "utilities"),
    groceries,
    transport: snap(round(dest.avg_monthly_transport * (f.transport ?? 1)), "transport"),
    dining: snap(round(groceries * 0.55 * f.scale), "dining"),
    entertainment: snap(round(idx * 6 * f.scale), "entertainment"),
    healthcare: snap(round(idx * 5 * (f.healthcare ?? 1)), "healthcare"),
    childcare: f.childcare ? snap(round(idx * 22), "childcare") : 0,
    misc: snap(round(groceries * 0.35 * f.scale), "misc"),
  };
}

export function totalCost(b: CostBreakdown): number {
  return COST_CATEGORIES.reduce((sum, c) => sum + b[c.key], 0);
}

/**
 * Apply custom slider overrides on top of a base breakdown.
 * Categories not present in `custom` keep their base value.
 */
export function applyCustom(base: CostBreakdown, custom: Partial<CostBreakdown>): CostBreakdown {
  const out: CostBreakdown = { ...base };
  for (const c of COST_CATEGORIES) {
    const v = custom[c.key];
    if (typeof v === "number" && !Number.isNaN(v)) out[c.key] = v;
  }
  return out;
}

export function buildComparison(
  fromCityId: string,
  toCityId: string,
  preset: PresetKey = "single",
  custom?: Partial<CostBreakdown>,
): ComparisonResult | null {
  const from = SEED_DESTINATIONS.find((d) => d.id === fromCityId);
  const to = SEED_DESTINATIONS.find((d) => d.id === toCityId);
  if (!from || !to) return null;

  const basePreset: BasePreset = preset !== "custom" && preset in PRESET_FACTORS ? (preset as BasePreset) : "single";
  const fromBase = baseCosts(from, basePreset);
  const toBase = baseCosts(to, basePreset);

  const fromB = custom ? applyCustom(fromBase, custom) : fromBase;
  const toB: CostBreakdown = { ...toBase };
  for (const c of COST_CATEGORIES) {
    const cv = custom?.[c.key];
    if (typeof cv === "number") {
      // Scale the custom value to the destination's relative price level,
      // so both cities represent the same lifestyle.
      toB[c.key] = fromBase[c.key] > 0 ? round(cv * (toBase[c.key] / fromBase[c.key])) : cv;
    }
  }

  const fromTotal = totalCost(fromB);
  const toTotal = totalCost(toB);
  const difference = toTotal - fromTotal;
  const percentDiff = fromTotal > 0 ? (difference / fromTotal) * 100 : 0;

  const perCategory: PerCategoryDelta[] = COST_CATEGORIES.map((c) => ({
    category: c.key,
    label: c.label,
    icon: c.icon,
    from: fromB[c.key],
    to: toB[c.key],
    delta: toB[c.key] - fromB[c.key],
  }));

  return {
    from: {
      id: from.id,
      city: from.city,
      country: from.country,
      flag: from.flag_emoji,
      currency: from.currency,
      costOfLivingIndex: from.cost_of_living_index,
      breakdown: fromB,
      total: fromTotal,
    },
    to: {
      id: to.id,
      city: to.city,
      country: to.country,
      flag: to.flag_emoji,
      currency: to.currency,
      costOfLivingIndex: to.cost_of_living_index,
      breakdown: toB,
      total: toTotal,
    },
    difference,
    percentDiff,
    savings: toTotal < fromTotal,
    perCategory,
  };
}

// =============================================================================
// FormData-tolerant field reader (all envelopes: raw FormData, {data: FormData},
// {data:{...}}, bare {...}) — avoids seroval bug with plain-object args.
// =============================================================================
function getStrField(data: unknown, key: string): string | undefined {
  if (data instanceof FormData) {
    const v = data.get(key);
    return typeof v === "string" ? v : undefined;
  }
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (d.data instanceof FormData) {
      const v = d.data.get(key);
      return typeof v === "string" ? v : undefined;
    }
    if (d.data && typeof d.data === "object") {
      const v = (d.data as Record<string, unknown>)[key];
      return typeof v === "string" ? v : undefined;
    }
    const v = d[key];
    return typeof v === "string" ? v : undefined;
  }
  return undefined;
}

// =============================================================================
// Server function — POST + FormData
// =============================================================================
export const compareCostOfLiving = createServerFn({ method: "POST" }).handler(async (data) => {
  const fromCityId = getStrField(data, "fromCityId");
  const toCityId = getStrField(data, "toCityId");
  const preset = (getStrField(data, "preset") ?? "single") as PresetKey;
  const customRaw = getStrField(data, "custom");
  let custom: Partial<CostBreakdown> | undefined;
  if (customRaw) {
    try {
      custom = JSON.parse(customRaw) as Partial<CostBreakdown>;
    } catch {
      custom = undefined;
    }
  }
  if (!fromCityId || !toCityId) return null;
  return buildComparison(fromCityId, toCityId, preset, custom);
});

// Shared display helpers
export function formatMoney(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function formatDelta(n: number): string {
  return n === 0 ? "Same" : `${n > 0 ? "+" : "−"}${formatMoney(Math.abs(n))}`;
}
