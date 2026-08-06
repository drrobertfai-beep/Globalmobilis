import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BottomNav } from "~/components/BottomNav";
import { DifficultyBadge } from "~/components/DifficultyBadge";
import { checklistStorageKey, VISA_GUIDES, type VisaStep } from "~/lib/visa-guides";

export const Route = createFileRoute("/visa-guides/$guideId")({
  loader: ({ params }) => ({
    guide: VISA_GUIDES.find((g) => g.id === params.guideId) ?? null,
  }),
  head: ({ loaderData }) => {
    const g = loaderData?.guide ?? null;
    return {
      meta: [
        {
          title: g ? `${g.visaType} — ${g.city} Visa Guide | Global Mobilis` : "Visa Guide — Global Mobilis",
        },
        {
          name: "description",
          content: g
            ? `Step-by-step ${g.visaType} guide for ${g.city}, ${g.country}: ${g.steps.length} steps, ${g.totalTimeframe}, ${g.totalCost}. Document checklist, timelines and official links.`
            : "Visa step-by-step guide with document checklists, timelines and costs.",
        },
        {
          property: "og:title",
          content: g ? `${g.visaType} — ${g.city} Visa Guide | Global Mobilis` : "Visa Guide — Global Mobilis",
        },
        {
          property: "og:description",
          content: g
            ? `Step-by-step ${g.visaType} guide for ${g.city}, ${g.country}: document checklists, timelines, costs and official links.`
            : "Visa step-by-step guide with document checklists, timelines and costs.",
        },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: VisaGuideDetailPage,
});

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-medium text-brand-primary-600 transition-colors hover:text-brand-primary-700 hover:underline"
    >
      {children}
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    </a>
  );
}


/** Collect every document across all steps into an ordered, de-duplicated list. */
function allDocuments(guide: { steps: VisaStep[] }): { stepIndex: number; doc: string }[] {
  const seen = new Set<string>();
  const out: { stepIndex: number; doc: string }[] = [];
  guide.steps.forEach((s, i) => {
    s.documents.forEach((d) => {
      if (!seen.has(d)) {
        seen.add(d);
        out.push({ stepIndex: i, doc: d });
      }
    });
  });
  return out;
}

function VisaGuideDetailPage() {
  const { guideId } = Route.useParams();
  const guide = useMemo(() => VISA_GUIDES.find((g) => g.id === guideId) ?? null, [guideId]);

  const [openSteps, setOpenSteps] = useState<Set<number>>(() => new Set([1]));
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expandedDocs, setExpandedDocs] = useState(false);

  const docs = useMemo(() => (guide ? allDocuments(guide) : []), [guide]);

  // Persist checklist to localStorage per guide
  useEffect(() => {
    if (!guide) return;
    try {
      const raw = localStorage.getItem(checklistStorageKey(guide.id));
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
  }, [guide]);

  useEffect(() => {
    if (!guide) return;
    try {
      localStorage.setItem(checklistStorageKey(guide.id), JSON.stringify(checked));
    } catch {
      /* storage unavailable (private mode) */
    }
  }, [checked, guide]);

  if (!guide) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="mx-auto max-w-2xl px-4 pt-16 text-center">
          <div className="mb-3 text-5xl">🛂</div>
          <h1 className="text-2xl font-bold text-gray-900">Guide not found</h1>
          <p className="mt-2 text-sm text-gray-600">This visa guide doesn't exist or was moved.</p>
          <Link to="/visa-guides" className="mt-4 inline-block font-medium text-brand-primary-500">
            ← All visa guides
          </Link>
        </div>
        <BottomNav currentTab="explore" />
      </div>
    );
  }

  const checkedCount = docs.filter((d) => checked[d.doc]).length;
  const progress = docs.length ? Math.round((checkedCount / docs.length) * 100) : 0;

  const toggleStep = (n: number) => {
    setOpenSteps((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  };

  const toggleDoc = (doc: string) => setChecked((prev) => ({ ...prev, [doc]: !prev[doc] }));
  const resetDocs = () => setChecked({});

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="mx-auto max-w-2xl px-4 pt-8">
        {/* Back link */}
        <Link to="/visa-guides" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-brand-primary-600">
          ← All visa guides
        </Link>

        {/* Header */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{guide.flag}</span>
              <div>
                <p className="text-sm text-gray-500">
                  {guide.city}, {guide.country}
                </p>
                <h1 className="text-xl font-bold leading-tight text-gray-900 sm:text-2xl">{guide.visaType}</h1>
              </div>
            </div>
            <DifficultyBadge difficulty={guide.difficulty} />
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <span className="text-gray-400">⏱️</span> {guide.totalTimeframe}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="text-gray-400">💰</span> {guide.totalCost}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="text-gray-400">🗓️</span> Updated {guide.lastUpdated}
            </span>
          </div>
        </div>

        {/* Overview */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="mb-2 text-lg font-bold text-gray-900">Overview</h2>
          <p className="text-sm leading-relaxed text-gray-600">{guide.overview}</p>
          <h3 className="mb-2 mt-4 text-sm font-semibold text-gray-700">Eligibility</h3>
          <ul className="space-y-2">
            {guide.eligibility.map((e) => (
              <li key={e} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-0.5 text-brand-primary-500">✓</span>
                {e}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <h2 className="mb-3 text-lg font-bold text-gray-900">Step-by-step</h2>
        <div className="relative mb-6 space-y-3">
          {/* connector line */}
          <div className="absolute bottom-6 left-[21px] top-6 w-px bg-brand-primary-200" />
          {guide.steps.map((s) => {
            const open = openSteps.has(s.stepNumber);
            return (
              <div key={s.stepNumber} className="relative rounded-2xl border border-gray-100 bg-white transition-all">
                <button
                  onClick={() => toggleStep(s.stepNumber)}
                  className="flex w-full items-start gap-3 p-4 text-left"
                  aria-expanded={open}
                  aria-controls={`step-panel-${s.stepNumber}`}
                >
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary-500 text-sm font-bold text-white shadow-sm">
                    {s.stepNumber}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900">{s.title}</h3>
                      <span className={`text-sm text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">⏱️ {s.timeframe}</span>
                      <span className="inline-flex items-center gap-1">💰 {s.cost}</span>
                    </div>
                  </div>
                </button>
                {open && (
                  <div id={`step-panel-${s.stepNumber}`} className="px-4 pb-4 pl-[52px]">
                    <p className="mb-3 text-sm leading-relaxed text-gray-600">{s.description}</p>
                    <div className="mb-3">
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Documents needed
                      </p>
                      <ul className="space-y-1">
                        {s.documents.map((d) => (
                          <li key={d} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-gray-400">📄</span> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {s.tips && (
                      <div className="mb-3 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
                        <span className="font-semibold">💡 Tip:</span> {s.tips}
                      </div>
                    )}
                    <ExternalLink href={s.officialUrl}>Official source</ExternalLink>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Document checklist */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-900">📋 Document checklist</h2>
            {checkedCount > 0 && (
              <button onClick={resetDocs} className="text-xs font-medium text-gray-400 hover:text-gray-600">
                Reset
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
              <span>
                {checkedCount} of {docs.length} documents gathered
              </span>
              <span className="font-semibold text-brand-primary-500">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg, #0E4F8B, #0FA3A3)" }}
              />
            </div>
          </div>

          <ul className="space-y-1">
            {(expandedDocs ? docs : docs.slice(0, 6)).map(({ stepIndex, doc }) => {
              const isChecked = !!checked[doc];
              return (
                <li key={doc}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleDoc(doc)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-primary-500 focus:ring-brand-primary-300"
                    />
                    <span className={`text-sm transition-all ${isChecked ? "text-gray-400 line-through" : "text-gray-700"}`}>
                      {doc}
                    </span>
                    <span className="ml-auto shrink-0 text-xs text-gray-400">Step {stepIndex + 1}</span>
                  </label>
                </li>
              );
            })}
          </ul>
          {docs.length > 6 && (
            <button
              onClick={() => setExpandedDocs((v) => !v)}
              className="mt-2 w-full rounded-lg py-2 text-center text-sm font-medium text-brand-primary-500 hover:bg-brand-primary-50"
            >
              {expandedDocs ? "Show fewer" : "Show all documents"}
            </button>
          )}
        </div>

        {/* Official resources */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="mb-3 text-lg font-bold text-gray-900">🔗 Official resources</h2>
          <ul className="space-y-2">
            {guide.steps.map((s) => (
              <li key={s.stepNumber}>
                <ExternalLink href={s.officialUrl}>
                  Step {s.stepNumber}: {s.title}
                </ExternalLink>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-gray-400">
          Visa rules change frequently. Verify all fees, thresholds and timelines on the official government sites
          above before you apply.
        </p>
      </div>
      <BottomNav currentTab="explore" />
    </div>
  );
}
