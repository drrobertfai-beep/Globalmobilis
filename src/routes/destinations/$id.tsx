import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SEED_DESTINATIONS } from "~/lib/destinations";
import { getDestinationResources, type School, type CommunityLink, type JobBoard, type HousingSite } from "~/lib/destination-resources";

export const Route = createFileRoute("/destinations/$id")({
  loader: ({ params }) => ({
    dest: SEED_DESTINATIONS.find((d) => d.id === params.id) ?? null,
  }),
  head: ({ loaderData }) => {
    const dest = loaderData.dest;
    const cityCountry = dest ? `${dest.city}, ${dest.country}` : "Destination";
    const year = new Date().getFullYear();
    const desc =
      dest?.short_description ??
      "Compare quality of life, jobs, cost of living, visas, and more across 36 cities worldwide with Global Mobilis.";
    return {
      meta: [
        { title: `${cityCountry} (${year}) — Global Mobilis` },
        { name: "description", content: desc },
        { property: "og:title", content: `Move to ${cityCountry} — Global Mobilis` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: `${cityCountry} — Global Mobilis` },
        { name: "twitter:description", content: desc },
      ],
    };
  },
  component: DestinationDetailPage,
});

const TABS = ["Overview", "Jobs", "Housing", "Education", "Community"] as const;
type Tab = (typeof TABS)[number];

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-neutral-700">{label}</span>
        <span className="text-neutral-500">{value}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ── Platform badge colors ──────────────────────────
const platformColors: Record<string, string> = {
  facebook: "bg-blue-100 text-blue-700",
  discord: "bg-indigo-100 text-indigo-700",
  whatsapp: "bg-green-100 text-green-700",
  meetup: "bg-red-100 text-red-700",
  reddit: "bg-orange-100 text-orange-700",
  telegram: "bg-sky-100 text-sky-700",
  other: "bg-gray-100 text-gray-700",
};

const focusColors: Record<string, string> = {
  general: "bg-gray-100 text-gray-700",
  tech: "bg-purple-100 text-purple-700",
  remote: "bg-teal-100 text-teal-700",
  startup: "bg-amber-100 text-amber-700",
  finance: "bg-emerald-100 text-emerald-700",
  healthcare: "bg-rose-100 text-rose-700",
  education: "bg-blue-100 text-blue-700",
  trades: "bg-orange-100 text-orange-700",
  other: "bg-gray-100 text-gray-700",
};

const schoolTypeLabel: Record<string, string> = {
  university: "University",
  college: "College / Polytechnic",
  high_school: "High School",
  primary: "Primary School",
  language: "Language School",
  other: "Other",
};

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand-primary-600 hover:text-brand-primary-700 hover:underline inline-flex items-center gap-1 font-medium transition-colors"
    >
      {children}
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    </a>
  );
}

function DestinationDetailPage() {
  const { id } = Route.useParams();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const dest = SEED_DESTINATIONS.find((d) => d.id === id);
  const resources = getDestinationResources(id);

  if (!dest) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="mb-2 text-2xl font-bold text-neutral-700">Destination not found</h1>
        <Link to="/destinations" className="text-brand-primary-500 hover:underline">Browse all destinations</Link>
      </div>
    );
  }

  const stats = [
    { label: "Cost of Living", value: dest.cost_of_living_index, color: "#0E4F8B" },
    { label: "Job Market", value: dest.job_score, color: "#1B7A9B" },
    { label: "Education", value: dest.education_score, color: "#0FA3A3" },
    { label: "Safety", value: dest.safety_score, color: "#F4B860" },
  ];

  return (
    <div className="pb-24">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0A1F3F] via-[#0E4F8B] to-[#0FA3A3]">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-24 sm:px-6 sm:pt-32">
          <Link to="/destinations" className="mb-6 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors">
            ←
          </Link>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{dest.flag_emoji}</span>
              <div>
                <h1 className="text-3xl font-bold text-white sm:text-4xl">{dest.city}</h1>
                <p className="text-base text-white/70">{dest.country} · {dest.continent}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-white/15 px-3 py-1 text-white backdrop-blur">
                {dest.languages?.join(", ") || "—"}
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-white backdrop-blur">
                {dest.currency || "—"}
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-white backdrop-blur">
                Rent 1BR: ${dest.avg_rent_1br}/mo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="sticky top-16 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <nav className="flex gap-0 overflow-x-auto" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-[#0E4F8B] text-[#0E4F8B]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* ── OVERVIEW ── */}
        {activeTab === "Overview" && (
          <div className="space-y-10">
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-900">About {dest.city}</h2>
              <p className="text-base leading-relaxed text-gray-600">{dest.description}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Quality of Life</h3>
                {stats.map((s) => (
                  <ScoreBar key={s.label} label={s.label} value={s.value} color={s.color} />
                ))}
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Monthly Costs (avg)</h3>
                <div className="space-y-3">
                  {[
                    { label: "Rent (1BR)", value: `$${dest.avg_rent_1br}` },
                    { label: "Utilities", value: `$${dest.avg_monthly_utilities}` },
                    { label: "Groceries", value: `$${dest.avg_monthly_groceries}` },
                    { label: "Transport", value: `$${dest.avg_monthly_transport}` },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-semibold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visa info */}
            {resources?.visaInfo && (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🛂</span>
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-gray-900">Visa Information</h3>
                    <p className="mb-3 text-sm leading-relaxed text-gray-600">{resources.visaInfo.description}</p>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {resources.visaInfo.commonVisaTypes.map((v) => (
                        <span key={v} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">{v}</span>
                      ))}
                    </div>
                    <ExternalLink href={resources.visaInfo.officialUrl}>Official immigration website</ExternalLink>
                  </div>
                </div>
              </div>
            )}

            {/* Healthcare */}
            {resources?.healthcare && (
              <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏥</span>
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-gray-900">Healthcare</h3>
                    <p className="mb-2 text-sm leading-relaxed text-gray-600">{resources.healthcare.description}</p>
                    <p className="mb-3 text-sm text-gray-700">
                      <span className="font-medium">Public system:</span> {resources.healthcare.publicSystem}
                    </p>
                    {resources.healthcare.insuranceUrl && (
                      <ExternalLink href={resources.healthcare.insuranceUrl}>Learn about health coverage</ExternalLink>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── JOBS ── */}
        {activeTab === "Jobs" && (
          <div className="space-y-8">
            <div>
              <h2 className="mb-2 text-xl font-bold text-gray-900">Job Market in {dest.city}</h2>
              <p className="text-sm leading-relaxed text-gray-600">
                Job market score: <span className="font-bold text-[#1B7A9B]">{dest.job_score}/100</span>.
                Business environment score: <span className="font-bold text-[#0FA3A3]">{dest.business_score}/100</span>.
              </p>
            </div>

            {resources?.jobBoards && resources.jobBoards.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {resources.jobBoards.map((jb: JobBoard) => (
                  <div key={jb.name} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">{jb.name}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${focusColors[jb.focus] || focusColors.other}`}>
                        {jb.focus}
                      </span>
                    </div>
                    {jb.description && <p className="mb-3 text-sm text-gray-500">{jb.description}</p>}
                    <ExternalLink href={jb.url}>Browse jobs →</ExternalLink>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
                <p className="text-sm text-gray-400">Job board data coming soon for {dest.city}.</p>
              </div>
            )}
          </div>
        )}

        {/* ── HOUSING ── */}
        {activeTab === "Housing" && (
          <div className="space-y-8">
            <div>
              <h2 className="mb-2 text-xl font-bold text-gray-900">Housing in {dest.city}</h2>
              <p className="text-sm leading-relaxed text-gray-600">
                Average 1-bedroom rent: <span className="font-bold text-[#0E4F8B]">${dest.avg_rent_1br}/mo</span>.
                Average 3-bedroom rent: <span className="font-bold text-[#0E4F8B]">${dest.avg_rent_3br}/mo</span>.
              </p>
            </div>

            {resources?.housingSites && resources.housingSites.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {resources.housingSites.map((hs: HousingSite) => (
                  <div key={hs.name} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">{hs.name}</h3>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 capitalize">{hs.type}</span>
                    </div>
                    {hs.description && <p className="mb-3 text-sm text-gray-500">{hs.description}</p>}
                    <ExternalLink href={hs.url}>Visit site →</ExternalLink>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
                <p className="text-sm text-gray-400">Housing resources coming soon for {dest.city}.</p>
              </div>
            )}
          </div>
        )}

        {/* ── EDUCATION ── */}
        {activeTab === "Education" && (
          <div className="space-y-8">
            <div>
              <h2 className="mb-2 text-xl font-bold text-gray-900">Education in {dest.city}</h2>
              <p className="text-sm leading-relaxed text-gray-600">
                Education score: <span className="font-bold text-[#0FA3A3]">{dest.education_score}/100</span>.
              </p>
            </div>

            {resources?.schools && resources.schools.length > 0 ? (
              <div className="space-y-4">
                {resources.schools.map((school: School) => (
                  <div key={school.name} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0FA3A3]/10 text-lg">
                      🎓
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{school.name}</h3>
                        <span className="rounded-full bg-[#0FA3A3]/10 px-2 py-0.5 text-xs font-medium text-[#0FA3A3]">
                          {schoolTypeLabel[school.type] || school.type}
                        </span>
                      </div>
                      {school.description && <p className="mb-2 text-sm text-gray-500">{school.description}</p>}
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">🌐 {school.language}</span>
                        <ExternalLink href={school.website}>Visit website →</ExternalLink>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
                <p className="text-sm text-gray-400">School data coming soon for {dest.city}.</p>
              </div>
            )}
          </div>
        )}

        {/* ── COMMUNITY ── */}
        {activeTab === "Community" && (
          <div className="space-y-8">
            <div>
              <h2 className="mb-2 text-xl font-bold text-gray-900">Expat & Local Communities in {dest.city}</h2>
              <p className="text-sm leading-relaxed text-gray-600">
                Connect with people who've already made the move. Join these active groups to ask questions, find housing, and make friends.
              </p>
            </div>

            {resources?.communityLinks && resources.communityLinks.length > 0 ? (
              <div className="space-y-4">
                {resources.communityLinks.map((cl: CommunityLink) => (
                  <div key={cl.name} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                      cl.platform === "facebook" ? "bg-blue-50" :
                      cl.platform === "discord" ? "bg-indigo-50" :
                      cl.platform === "whatsapp" ? "bg-green-50" :
                      cl.platform === "meetup" ? "bg-red-50" :
                      cl.platform === "reddit" ? "bg-orange-50" :
                      "bg-gray-50"
                    }`}>
                      {cl.platform === "facebook" ? "👥" :
                       cl.platform === "discord" ? "💬" :
                       cl.platform === "whatsapp" ? "📱" :
                       cl.platform === "meetup" ? "🎉" :
                       cl.platform === "reddit" ? "🤖" :
                       "🔗"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{cl.name}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${platformColors[cl.platform] || platformColors.other}`}>
                          {cl.platform}
                        </span>
                        {cl.memberCount && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            {cl.memberCount} members
                          </span>
                        )}
                      </div>
                      {cl.description && <p className="mb-2 text-sm text-gray-500">{cl.description}</p>}
                      <ExternalLink href={cl.url}>Join community →</ExternalLink>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
                <p className="text-sm text-gray-400">Community links coming soon for {dest.city}.</p>
              </div>
            )}

            {/* CTA for missing cities */}
            <div className="rounded-2xl bg-gradient-to-r from-[#0E4F8B] to-[#0FA3A3] p-6 text-center text-white">
              <h3 className="mb-2 text-lg font-bold">Know a great {dest.city} community?</h3>
              <p className="mb-4 text-sm text-white/80">Help fellow expats by suggesting a group, event, or resource.</p>
              <button className="rounded-full bg-white/20 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/30 transition-colors">
                Suggest a Resource
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
