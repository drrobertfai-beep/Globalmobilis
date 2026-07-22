import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SEED_DESTINATIONS } from "~/lib/destinations";
import type { Destination } from "~/db.types";

export const Route = createFileRoute("/destinations/compare")({
  component: CompareDestinationsPage,
});

interface ComparisonRow {
  label: string;
  key: keyof Destination;
  format?: "score" | "currency" | "number" | "text";
  highlight?: "higher" | "lower";
}

const COMPARISON_ROWS: { category: string; rows: ComparisonRow[] }[] = [
  {
    category: "General",
    rows: [
      { label: "Continent", key: "continent", format: "text" },
      { label: "Country", key: "country", format: "text" },
      { label: "Languages", key: "languages", format: "text" },
      { label: "Currency", key: "currency", format: "text" },
    ],
  },
  {
    category: "Scores",
    rows: [
      { label: "Job Score", key: "job_score", format: "score", highlight: "higher" },
      { label: "Education Score", key: "education_score", format: "score", highlight: "higher" },
      { label: "Business Score", key: "business_score", format: "score", highlight: "higher" },
      { label: "Tourism Score", key: "tourism_score", format: "score", highlight: "higher" },
      { label: "Quality of Life", key: "quality_of_life_score", format: "score", highlight: "higher" },
      { label: "Safety Score", key: "safety_score", format: "score", highlight: "higher" },
    ],
  },
  {
    category: "Cost of Living",
    rows: [
      { label: "Cost Index", key: "cost_of_living_index", format: "number", highlight: "lower" },
      { label: "Rent (1BR)", key: "avg_rent_1br", format: "currency", highlight: "lower" },
      { label: "Rent (3BR)", key: "avg_rent_3br", format: "currency", highlight: "lower" },
      { label: "Utilities/mo", key: "avg_monthly_utilities", format: "currency", highlight: "lower" },
      { label: "Groceries/mo", key: "avg_monthly_groceries", format: "currency", highlight: "lower" },
      { label: "Transport/mo", key: "avg_monthly_transport", format: "currency", highlight: "lower" },
    ],
  },
];

function getBest(values: number[], higherIsBetter: boolean): number[] {
  if (values.length === 0) return [];
  const best = higherIsBetter ? Math.max(...values) : Math.min(...values);
  return values.map((v) => (v === best ? 1 : 0));
}

function formatValue(value: unknown, format?: string): string {
  if (value === undefined || value === null) return "—";
  if (Array.isArray(value)) return value.join(", ");
  if (format === "currency") return `$${(value as number).toLocaleString()}`;
  if (format === "score") return String(value);
  if (format === "number") return String(value);
  return String(value);
}

function ScoreCell({ value, isBest }: { value: number; isBest: boolean }) {
  const color = value >= 80 ? "bg-green-500" : value >= 60 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`text-sm font-bold tabular-nums ${isBest ? "text-brand-secondary-500" : "text-neutral-700"}`}>
        {value}
      </span>
    </div>
  );
}

function CompareDestinationsPage() {
  const [selected, setSelected] = useState<string[]>(["", "", ""]);
  const destinations = useMemo(
    () => selected.map((id) => SEED_DESTINATIONS.find((d) => d.id === id) || null),
    [selected],
  );

  const available = SEED_DESTINATIONS.filter(
    (d) => !selected.includes(d.id) || selected.filter((s) => s === d.id).length <= 1,
  );

  const setSlot = (index: number, id: string) => {
    const next = [...selected];
    next[index] = id;
    setSelected(next);
  };

  const clearAll = () => setSelected(["", "", ""]);

  const validDestinations = destinations.filter(Boolean) as Destination[];
  const hasSelection = validDestinations.length >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white pb-24">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <Link
            to="/destinations"
            className="mb-3 inline-flex items-center gap-1 text-sm text-brand-primary-500 hover:underline"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Destinations
          </Link>
          <h1 className="text-2xl font-bold text-neutral-700 sm:text-3xl">
            Compare Destinations
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Select 2–3 destinations to compare side by side
          </p>
        </div>
      </div>

      {/* Selector Row */}
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <label className="mb-1 block text-xs font-medium text-neutral-500">
                Destination {i + 1}
              </label>
              <select
                value={selected[i]}
                onChange={(e) => setSlot(i, e.target.value)}
                className="input w-full text-sm"
              >
                <option value="">— Select —</option>
                {available.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.flag_emoji} {d.city}, {d.country}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        {selected.some((s) => s) && (
          <button
            onClick={clearAll}
            className="mt-3 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Comparison Table */}
      {hasSelection ? (
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              {/* Header with city names */}
              <thead>
                <tr className="border-b border-neutral-200 bg-gradient-to-r from-brand-primary-50 to-brand-secondary-50">
                  <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 w-32">
                    Metric
                  </th>
                  {validDestinations.map((dest) => (
                    <th key={dest.id} className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl">{dest.flag_emoji}</span>
                        <span className="font-bold text-neutral-700">{dest.city}</span>
                        <span className="text-xs text-neutral-500">{dest.country}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              {COMPARISON_ROWS.map(({ category, rows }) => (
                <tbody key={category}>
                  {/* Category header */}
                  <tr>
                    <td
                      colSpan={validDestinations.length + 1}
                      className="bg-neutral-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500"
                    >
                      {category}
                    </td>
                  </tr>
                  {rows.map((row) => {
                    const values = validDestinations.map((d) => {
                      const val = d[row.key];
                      return typeof val === "number" ? val : 0;
                    });
                    const isScore = row.format === "score";
                    const isCurrency = row.format === "currency";
                    const isNumber = row.format === "number" || isCurrency;
                    const higherIsBetter = row.highlight !== "lower";
                    const bestIdx = getBest(values, higherIsBetter);

                    return (
                      <tr
                        key={row.key}
                        className="border-b border-neutral-100 transition-colors hover:bg-neutral-50/50"
                      >
                        <td className="px-4 py-3 text-xs font-medium text-neutral-500 whitespace-nowrap">
                          {row.label}
                        </td>
                        {validDestinations.map((dest, i) => {
                          const raw = dest[row.key];
                          const val = typeof raw === "number" ? raw : 0;
                          const isBest = bestIdx[i] === 1 && validDestinations.length > 1;

                          return (
                            <td key={dest.id} className="px-4 py-3 text-center">
                              {isScore ? (
                                <ScoreCell value={val} isBest={isBest} />
                              ) : isNumber ? (
                                <span
                                  className={`font-bold tabular-nums ${
                                    isBest
                                      ? "text-brand-secondary-500"
                                      : "text-neutral-700"
                                  }`}
                                >
                                  {isCurrency ? `$${val.toLocaleString()}` : val}
                                </span>
                              ) : (
                                <span className="text-neutral-700">{formatValue(raw, row.format)}</span>
                              )}
                              {isBest && (
                                <span className="ml-1 text-xs text-brand-secondary-500">★</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              ))}
            </table>
          </div>

          {/* Summary bar */}
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 p-5 text-white">
            <h3 className="font-bold text-lg">Quick Summary</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {validDestinations.map((dest) => {
                const scores = [
                  dest.job_score, dest.education_score, dest.business_score,
                  dest.tourism_score, dest.quality_of_life_score, dest.safety_score,
                ];
                const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
                return (
                  <div key={dest.id} className="rounded-xl bg-white/10 backdrop-blur-sm p-3 text-center">
                    <div className="text-lg">{dest.flag_emoji}</div>
                    <div className="font-bold">{dest.city}</div>
                    <div className="mt-1 flex items-center justify-center gap-1">
                      <span className="text-2xl font-bold">{avg}</span>
                      <span className="text-xs text-white/70">/100 avg</span>
                    </div>
                    <div className="mt-1 text-xs text-white/70">
                      {dest.cost_of_living_index} cost index • ${dest.avg_rent_1br}/mo rent
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <span className="text-5xl">⚖️</span>
          <h2 className="mt-4 text-lg font-bold text-neutral-700">Select destinations to compare</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Pick 2-3 destinations above to see a detailed side-by-side comparison.
          </p>
        </div>
      )}
    </div>
  );
}
