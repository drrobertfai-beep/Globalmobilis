import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BottomNav } from "~/components/BottomNav";
import { FEATURED_CITIES, listMentors, ratingStars, type MentorCardView } from "~/lib/mentors";

export const Route = createFileRoute("/mentors/")({
  head: () => ({
    meta: [
      { title: "Mentors — Global Mobilis" },
      {
        name: "description",
        content:
          "Book a 1:1 video consultation with verified local mentors — immigration lawyers, recruiters, visa experts and more in your destination city.",
      },
    ],
  }),
  component: MentorsPage,
});

const CITY_OPTIONS = ["All", ...FEATURED_CITIES] as const;

function MentorsPage() {
  const [mentors, setMentors] = useState<MentorCardView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [city, setCity] = useState<string>("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    const fd = new FormData();
    if (city !== "All") fd.set("city", city);
    listMentors(city === "All" ? undefined : fd)
      .then((result) => {
        if (!cancelled) setMentors(result as unknown as MentorCardView[]);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load mentors. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [city]);

  const q = query.trim().toLowerCase();
  // Client-side filtering by city + search (12 mentors; server list is the
  // single source fetched on mount — avoids extra server round-trips).
  const filtered = mentors.filter(
    (m) =>
      (city === "All" || m.city === city) &&
      (!q ||
        m.name.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.expertise.some((e) => e.toLowerCase().includes(q))),
  );

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white px-4 pb-3 pt-6 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold text-neutral-700">Mentors</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Book a 1:1 video call with a verified local expert in your destination city.
          </p>
        </div>
      </div>

      {/* City filter + search */}
      <div className="sticky top-14 z-10 border-b border-neutral-100 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto max-w-6xl space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CITY_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  city === c
                    ? "bg-brand-primary-700 text-white"
                    : "bg-brand-primary-50 text-brand-primary-700 hover:bg-brand-primary-100"
                }`}
              >
                {c === "All" ? "🌍 All" : c}
              </button>
            ))}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, title or expertise…"
            className="w-full rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-brand-primary-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Mentor grid */}
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        {error && (
          <p className="rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">{error}</p>
        )}
        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-56 animate-pulse bg-neutral-100" />
            ))}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="card flex flex-col items-center gap-2 p-10 text-center">
            <span className="text-4xl">🔍</span>
            <p className="font-semibold text-neutral-700">No mentors match your search</p>
            <p className="text-sm text-neutral-500">
              Try a different city or search term.
            </p>
          </div>
        )}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <Link
                key={m.id}
                to="/mentors/$mentorId"
                params={{ mentorId: m.id }}
                className="card flex flex-col gap-3 p-5 transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${m.avatarColor}`}
                  >
                    {m.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-bold text-neutral-800">{m.name}</h3>
                    <p className="truncate text-xs text-neutral-500">{m.title}</p>
                    <p className="mt-0.5 text-xs text-neutral-400">
                      {m.flag} {m.city}, {m.country}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-brand-primary-700">
                    ${m.hourlyRate}
                    <span className="text-xs font-normal text-neutral-400">/hr</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-sm">
                  <span className="tracking-tight text-brand-gold-500">
                    {ratingStars(m.rating).join("")}
                  </span>
                  <span className="ml-1 text-xs font-semibold text-neutral-700">{m.rating}</span>
                  <span className="text-xs text-neutral-400">({m.reviewCount} reviews)</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {m.expertise.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-brand-primary-50 px-2.5 py-0.5 text-xs font-medium text-brand-primary-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-brand-secondary-500 hover:text-brand-secondary-700">
                  Book a Session →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <BottomNav currentTab="explore" />
    </div>
  );
}
