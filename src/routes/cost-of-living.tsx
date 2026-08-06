import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BottomNav } from "~/components/BottomNav";
import { SEED_DESTINATIONS } from "~/lib/destinations";
import {
  COST_CATEGORIES,
  PRESETS,
  buildComparison,
  compareCostOfLiving,
  formatDelta,
  formatMoney,
  type CategoryDef,
  type CostBreakdown,
  type CostCategory,
  type PresetKey,
} from "~/lib/cost-calculator";

export const Route = createFileRoute("/cost-of-living")({
  validateSearch: (search: Record<string, unknown>) => ({
    from: (search.from as string) || "",
    to: (search.to as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Cost of Living Calculator — Global Mobilis" },
      {
        name: "description",
        content:
          "Compare monthly living expenses between any two cities worldwide — rent, utilities, groceries, transport, dining and more.",
      },
    ],
  }),
  component: CostOfLivingPage,
});

const DEFAULT_FROM = "1"; // Toronto
const DEFAULT_TO = "2"; // Vancouver

function CostOfLivingPage() {
  const search = Route.useSearch();
  const [fromId, setFromId] = useState<string>(search.from || DEFAULT_FROM);
  const [toId, setToId] = useState<string>(search.to || DEFAULT_TO);
  const [preset, setPreset] = useState<PresetKey>("single");
  const [custom, setCustom] = useState<Partial<CostBreakdown>>({});
  const [serverResult, setServerResult] = useState<Awaited<ReturnType<typeof compareCostOfLiving>>>(null);

  // Server fn (POST + FormData) — source of truth on city/preset change.
  useEffect(() => {
    const fd = new FormData();
    fd.set("fromCityId", fromId);
    fd.set("toCityId", toId);
    fd.set("preset", preset);
    compareCostOfLiving({ data: fd })
      .then((r) => setServerResult(r))
      .catch(() => {
        /* keep previous result */
      });
  }, [fromId, toId, preset]);

  // Client-side recompute so sliders update totals live (same pure logic as server).
  const liveResult = useMemo(
    () =>
      buildComparison(
        fromId,
        toId,
        preset,
        Object.keys(custom).length > 0 ? custom : undefined,
      ),
    [fromId, toId, preset, custom],
  );
  const result = liveResult ?? serverResult;

  const fromDest = SEED_DESTINATIONS.find((d) => d.id === fromId);
  const toDest = SEED_DESTINATIONS.find((d) => d.id === toId);

  const pickCity = (value: string, side: "from" | "to") => {
    if (SEED_DESTINATIONS.some((d) => d.id === value)) {
      if (side === "from") setFromId(value);
      else setToId(value);
    }
  };

  const choosePreset = (p: PresetKey) => {
    setPreset(p);
    setCustom({});
  };

  const setCategory = (key: CostCategory, value: number) => {
    setCustom((prev) => ({ ...prev, [key]: value }));
    if (preset !== "custom") setPreset("custom");
  };

  const resetCategory = (key: CostCategory) => {
    setCustom((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const sameCity = fromId === toId;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="mx-auto max-w-5xl px-4 pt-8">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-brand-primary-900 sm:text-3xl">
              🧮 Cost of Living Calculator
            </h1>
            <p className="mt-1 text-sm text-gray-600 sm:text-base">
              Compare estimated monthly expenses between any two cities — rent,
              utilities, groceries, transport and more across{" "}
              <span className="font-semibold text-brand-primary-700">
                {SEED_DESTINATIONS.length} destinations
              </span>
              .
            </p>
          </div>
          <ShareButton
            fromId={fromId}
            toId={toId}
            disabled={!fromDest || !toDest || sameCity}
          />
        </header>

        {/* City pickers */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <CitySelect
              label="From"
              value={fromId}
              onChange={(v) => pickCity(v, "from")}
            />
            <div className="hidden pb-3 text-xl font-bold text-gray-400 sm:block">
              →
            </div>
            <CitySelect
              label="To"
              value={toId}
              onChange={(v) => pickCity(v, "to")}
            />
            <button
              onClick={() => {
                const f = fromId;
                setFromId(toId);
                setToId(f);
              }}
              className="rounded-xl border border-brand-primary-100 bg-brand-primary-50 px-4 py-3 text-sm font-semibold text-brand-primary-700 transition hover:bg-brand-primary-100 sm:mb-0"
            >
              ⇄ Swap
            </button>
          </div>

          {/* Presets */}
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Scenario
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => {
                const active = preset === p.key;
                return (
                  <button
                    key={p.key}
                    onClick={() => choosePreset(p.key)}
                    title={p.description}
                    className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-brand-primary-700 text-white shadow-sm"
                        : "border border-gray-200 bg-white text-gray-700 hover:border-brand-primary-500 hover:bg-brand-primary-50"
                    }`}
                  >
                    {p.icon} {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Result */}
        {result && !sameCity ? (
          <>
            {/* Banner */}
            <section className="mt-5">
              {result.difference === 0 ? (
                <div className="rounded-2xl bg-gray-100 px-4 py-4 text-center text-sm font-medium text-gray-700">
                  {result.to.flag} {result.to.city} costs about the same as{" "}
                  {result.from.flag} {result.from.city} —{" "}
                  {formatMoney(result.from.total)}/mo for this lifestyle.
                </div>
              ) : result.savings ? (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-center">
                  <p className="text-sm font-semibold text-green-700">
                    💚 Save {formatMoney(-result.difference)}/month (
                    {Math.abs(result.percentDiff).toFixed(0)}% less) living in{" "}
                    {result.to.flag} {result.to.city} vs {result.from.flag}{" "}
                    {result.from.city}
                  </p>
                  <p className="mt-0.5 text-xs text-green-600">
                    {formatMoney(result.from.total)}/mo →{" "}
                    {formatMoney(result.to.total)}/mo for the same lifestyle
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-center">
                  <p className="text-sm font-semibold text-red-700">
                    🔴 {result.to.flag} {result.to.city} is{" "}
                    {formatMoney(result.difference)}/month (
                    {result.percentDiff.toFixed(0)}%) more expensive than{" "}
                    {result.from.flag} {result.from.city}
                  </p>
                  <p className="mt-0.5 text-xs text-red-600">
                    {formatMoney(result.from.total)}/mo →{" "}
                    {formatMoney(result.to.total)}/mo for the same lifestyle
                  </p>
                </div>
              )}
            </section>

            {/* Totals side-by-side */}
            <section className="mt-5 grid gap-4 sm:grid-cols-2">
              <TotalCard
                accent="primary"
                flag={result.from.flag}
                city={result.from.city}
                country={result.from.country}
                total={result.from.total}
                index={result.from.costOfLivingIndex}
                label="Current city"
              />
              <TotalCard
                accent="secondary"
                flag={result.to.flag}
                city={result.to.city}
                country={result.to.country}
                total={result.to.total}
                index={result.to.costOfLivingIndex}
                label="Destination"
              />
            </section>
          </>
        ) : (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
            {sameCity
              ? "Pick two different cities to compare."
              : "Select two cities to see the comparison."}
          </div>
        )}

        {/* Sliders */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-brand-primary-900">
            Adjust your spending
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Drag any slider to fine-tune a category — the other city scales to
            the same lifestyle. Resets restore the {preset !== "custom" ? `${preset.replace(/-/g, " ")}` : "default"} estimate.
          </p>
          <div className="mt-4 space-y-5">
            {COST_CATEGORIES.map((cat) => (
              <SliderRow
                key={cat.key}
                cat={cat}
                value={custom[cat.key] ?? result?.from.breakdown[cat.key] ?? 0}
                isCustom={typeof custom[cat.key] === "number"}
                onChange={(v) => setCategory(cat.key, v)}
                onReset={() => resetCategory(cat.key)}
              />
            ))}
          </div>
        </section>

        {/* Per-category comparison */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-brand-primary-900">
            Category breakdown
          </h2>
          {result && !sameCity ? (
            <div className="mt-4 space-y-5">
              {result.perCategory.map((pc) => (
                <CategoryBar key={pc.category} {...pc} fromCity={result.from.city} toCity={result.to.city} />
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">
              Select two cities to see the full breakdown.
            </p>
          )}
        </section>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Estimates are derived from Global Mobilis destination data and are
          indicative only — actual costs vary by neighborhood and lifestyle.
        </p>
      </div>

      <BottomNav currentTab="explore" />
    </div>
  );
}

function ShareButton({
  fromId,
  toId,
  disabled,
}: {
  fromId: string;
  toId: string;
  disabled: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = `${window.location.origin}/cost-of-living?from=${encodeURIComponent(fromId)}&to=${encodeURIComponent(toId)}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={share}
      disabled={disabled}
      title="Copy a link to this comparison"
      className="rounded-xl border border-brand-primary-100 bg-brand-primary-50 px-3.5 py-2 text-sm font-semibold text-brand-primary-700 transition hover:bg-brand-primary-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {copied ? "✓ Link copied" : "🔗 Share"}
    </button>
  );
}

function CitySelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block flex-1">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm font-medium text-gray-800 focus:border-brand-primary-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-100"
      >
        {SEED_DESTINATIONS.map((d) => (
          <option key={d.id} value={d.id}>
            {d.flag_emoji} {d.city}, {d.country}
          </option>
        ))}
      </select>
    </label>
  );
}

function TotalCard({
  accent,
  flag,
  city,
  country,
  total,
  index,
  label,
}: {
  accent: "primary" | "secondary";
  flag: string;
  city: string;
  country: string;
  total: number;
  index: number;
  label: string;
}) {
  const ring =
    accent === "primary"
      ? "border-brand-primary-100 bg-brand-primary-50/50"
      : "border-brand-secondary-300 bg-brand-secondary-100/50";
  const badge =
    accent === "primary"
      ? "bg-brand-primary-700 text-white"
      : "bg-brand-secondary-700 text-white";
  const value =
    accent === "primary" ? "text-brand-primary-900" : "text-brand-secondary-700";
  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${ring}`}>
      <div className="flex items-center justify-between">
        <span className="text-3xl">{flag}</span>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge}`}>
          {label}
        </span>
      </div>
      <p className="mt-2 text-sm font-bold text-gray-800">{city}</p>
      <p className="text-xs text-gray-500">{country}</p>
      <p className={`mt-3 text-2xl font-extrabold ${value}`}>
        {formatMoney(total)}
        <span className="ml-1 text-xs font-medium text-gray-500">/month</span>
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Cost of living index: {index}
      </p>
    </div>
  );
}

function SliderRow({
  cat,
  value,
  isCustom,
  onChange,
  onReset,
}: {
  cat: CategoryDef;
  value: number;
  isCustom: boolean;
  onChange: (v: number) => void;
  onReset: () => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-800">
          {cat.icon} {cat.label}
        </span>
        <span className="flex items-center gap-2">
          <span className="text-sm font-bold text-brand-primary-900">
            {formatMoney(value)}
          </span>
          {isCustom && (
            <button
              onClick={onReset}
              title={`Reset ${cat.label}`}
              className="rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-brand-coral-700 transition hover:bg-brand-coral-100"
            >
              ↺ reset
            </button>
          )}
        </span>
      </div>
      <input
        type="range"
        min={cat.min}
        max={cat.max}
        step={cat.step}
        value={Math.min(Math.max(value, cat.min), cat.max)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-brand-primary-100 accent-brand-primary-700"
      />
      <div className="mt-0.5 flex justify-between text-[10px] text-gray-400">
        <span>{formatMoney(cat.min)}</span>
        <span>{formatMoney(cat.max)}</span>
      </div>
    </div>
  );
}

function CategoryBar({
  icon,
  label,
  from,
  to,
  delta,
  fromCity,
  toCity,
}: {
  icon: string;
  label: string;
  from: number;
  to: number;
  delta: number;
  fromCity: string;
  toCity: string;
}) {
  const max = Math.max(from, to, 1);
  const fromPct = Math.round((from / max) * 100);
  const toPct = Math.round((to / max) * 100);
  const deltaColor =
    delta === 0
      ? "bg-gray-400 text-gray-600"
      : delta > 0
        ? "bg-red-50 text-red-600 border border-red-200"
        : "bg-green-50 text-green-700 border border-green-200";
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-800">
          {icon} {label}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${deltaColor}`}>
          {formatDelta(delta)}
        </span>
      </div>
      <div className="space-y-1.5">
        <div>
          <div className="mb-0.5 flex justify-between text-[11px] text-gray-500">
            <span>
              {fromCity} · {formatMoney(from)}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-brand-primary-700"
              style={{ width: `${Math.max(fromPct, 2)}%` }}
            />
          </div>
        </div>
        <div>
          <div className="mb-0.5 flex justify-between text-[11px] text-gray-500">
            <span>
              {toCity} · {formatMoney(to)}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-brand-secondary-700"
              style={{ width: `${Math.max(toPct, 2)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
