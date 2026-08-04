import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BottomNav } from "~/components/BottomNav";
import { DIFFICULTY_LABELS, DIFFICULTY_STYLES, VISA_GUIDES } from "~/lib/visa-guides";

export const Route = createFileRoute("/visa-guides/")({
  head: () => ({
    meta: [
      { title: "Visa Step-by-Step Guides — Global Mobilis" },
      {
        name: "description",
        content:
          "Step-by-step visa application guides for Toronto, Berlin, Dubai, Lisbon, London and Sydney — with document checklists, timelines, costs and official links.",
      },
      { property: "og:title", content: "Visa Step-by-Step Guides — Global Mobilis" },
      { property: "og:description", content: "Real visa pathways broken into actionable steps: documents, timelines, costs and official government links." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: VisaGuidesPage,
});

const FILTERS = [
  { key: "all", label: "All" },
  { key: "1", label: "🇨🇦 Toronto" },
  { key: "4", label: "🇩🇪 Berlin" },
  { key: "8", label: "🇦🇪 Dubai" },
  { key: "15", label: "🇵🇹 Lisbon" },
  { key: "3", label: "🇬🇧 London" },
  { key: "6", label: "🇦🇺 Sydney" },
] as const;

function DifficultyBadge({ difficulty }: { difficulty: "easy" | "moderate" | "hard" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${DIFFICULTY_STYLES[difficulty]}`}
    >
      {difficulty === "easy" ? "●" : difficulty === "moderate" ? "◐" : "●"}
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}

function VisaGuidesPage() {
  const [filter, setFilter] = useState<string>("all");
  const guides = filter === "all" ? VISA_GUIDES : VISA_GUIDES.filter((g) => g.destinationId === filter);
  const general = VISA_GUIDES.filter((g) => g.destinationId === "");

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="mx-auto max-w-3xl px-4 pt-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-2 text-5xl">🛂</div>
          <h1 className="text-3xl font-bold text-gray-900">Visa Step-by-Step Guides</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
            Real visa pathways broken down into actionable steps — document checklists, timelines, costs in local
            currency, and official government links.
          </p>
        </div>

        {/* Filter chips */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-brand-primary-500 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-brand-primary-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Guide cards */}
        <div className="space-y-4">
          {guides.map((g) => (
            <Link
              key={g.id}
              to="/visa-guides/$guideId"
              params={{ guideId: g.id }}
              className="block rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-brand-primary-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{g.flag}</span>
                  <div>
                    <h2 className="font-bold text-gray-900">{g.visaType}</h2>
                    <p className="text-sm text-gray-500">
                      {g.city}, {g.country}
                    </p>
                  </div>
                </div>
                <DifficultyBadge difficulty={g.difficulty} />
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600">{g.overview}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <span className="text-gray-400">🧾</span> {g.steps.length} steps
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="text-gray-400">⏱️</span> {g.totalTimeframe}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="text-gray-400">💰</span> {g.totalCost}
                </span>
                <span className="ml-auto inline-flex items-center gap-1 font-medium text-brand-primary-500">
                  Open guide →
                </span>
              </div>
            </Link>
          ))}
          {filter === "all" &&
            general.map((g) => (
              <Link
                key={g.id}
                to="/visa-guides/$guideId"
                params={{ guideId: g.id }}
                className="block rounded-2xl border border-dashed border-gray-200 bg-white/60 p-5 transition-all hover:border-brand-primary-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{g.flag}</span>
                    <div>
                      <h2 className="font-bold text-gray-900">{g.visaType}</h2>
                      <p className="text-sm text-gray-500">Applies broadly to any destination</p>
                    </div>
                  </div>
                  <DifficultyBadge difficulty={g.difficulty} />
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600">{g.overview}</p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <span className="text-gray-400">🧾</span> {g.steps.length} steps
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 font-medium text-brand-primary-500">
                    Open guide →
                  </span>
                </div>
              </Link>
            ))}
        </div>

        {guides.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-500">No guides for this destination yet.</p>
        )}

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs leading-relaxed text-gray-400">
          Fees, timelines and thresholds change regularly. Always confirm current requirements on the official
          government websites linked in each guide before applying.
        </p>
      </div>
      <BottomNav currentTab="explore" />
    </div>
  );
}
