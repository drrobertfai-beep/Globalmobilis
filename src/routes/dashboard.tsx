import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getFeaturedDestinations, searchDestinations } from "~/lib/destinations";
import { LogoIcon } from "~/components/Logo";
import { BottomNav } from "~/components/BottomNav";
import { getMyTimeline, type TimelineDetail } from "~/lib/timeline";
import type { Destination } from "~/db.types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Global Mobilis — Your Global Journey Starts Here" },
      {
        name: "description",
        content:
          "Your personalized Global Mobilis dashboard — relocation timelines, destination insights, and expat community in one place.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [referral, setReferral] = useState<any>(null);
  const [timeline, setTimeline] = useState<TimelineDetail | null>(null);

  useEffect(() => {
    getFeaturedDestinations().then((data) => {
      setDestinations(data as unknown as Destination[]);
      setLoading(false);
    });

    // Fetch referral progress
    fetch("/api/referral")
      .then((r) => r.json())
      .then((data) => {
        if (data.code) setReferral(data);
      })
      .catch(() => {});

    // Fetch relocation timeline (if any)
    getMyTimeline()
      .then((tl) => setTimeline(tl as unknown as TimelineDetail | null))
      .catch(() => {});
  }, []);

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white px-4 pb-4 pt-6 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-700">
                Where to next?
              </h1>
              <p className="text-sm text-neutral-500">
                Your global journey starts here
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary-100 text-lg font-bold text-brand-primary-700">
              A
            </div>
          </div>

          {/* Search pill */}
          <Link
            to="/destinations"
            className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-5 py-3.5 shadow-sm transition-all hover:border-brand-primary-500"
          >
            <svg className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-neutral-500">Search destinations...</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Destinations", value: "200+", color: "text-brand-primary-700" },
            { label: "Community", value: "50K+", color: "text-brand-secondary-500" },
            { label: "Free to Join", value: "100%", color: "text-brand-gold-500" },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-neutral-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Survey CTA */}
        <Link
          to="/survey"
          className="flex items-center gap-4 rounded-2xl border-2 border-[#F4B860]/40 bg-gradient-to-r from-[#FFF8ED] to-[#FFF3DC] p-5 transition-all hover:shadow-md"
        >
          <span className="text-3xl">📋</span>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">Help shape Global Mobilis</h3>
            <p className="text-sm text-gray-600">Take our 2-minute survey — tell us what you need most and get early access to premium features.</p>
          </div>
          <span className="rounded-full bg-[#F4B860] px-4 py-1.5 text-sm font-semibold text-[#0A1F3F]">Start →</span>
        </Link>

        {/* Referral progress */}
        {referral && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">🎁 Invite Friends</h3>
              {referral.progress.completed ? (
                <span className="rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">Unlocked!</span>
              ) : (
                <span className="text-sm text-gray-500">{referral.progress.count}/{referral.progress.needed}</span>
              )}
            </div>
            <p className="mb-3 text-sm text-gray-600">
              {referral.progress.completed
                ? "You've earned premium early access! Share your link to help more friends."
                : `Invite ${referral.progress.needed - referral.progress.count} more friend${referral.progress.needed - referral.progress.count !== 1 ? "s" : ""} to unlock premium early access.`}
            </p>
            <div className="mb-3 h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0FA3A3] to-[#F4B860] transition-all"
                style={{ width: `${Math.min(100, (referral.progress.count / referral.progress.needed) * 100)}%` }}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`https://globalmobilis.com/r/${referral.code}`}
                className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600"
              />
              <button
                type="button"
                onClick={() => {
                  const url = `https://globalmobilis.com/r/${referral.code}`;
                  navigator.clipboard.writeText(url).then(() => {
                    const btn = document.activeElement as HTMLElement;
                    if (btn) { btn.textContent = "✓"; setTimeout(() => { btn.textContent = "Copy"; }, 1500); }
                  });
                }}
                className="rounded-lg bg-[#0E4F8B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1B7A9B]"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Relocation timeline widget */}
        {timeline ? (
          <Link
            to="/timeline"
            className="block rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">
                📋 Your Relocation Timeline
              </h3>
              <span className="rounded-full bg-brand-primary-50 px-3 py-0.5 text-xs font-semibold text-brand-primary-700">
                {timeline.destinationFlag} {timeline.destination}
              </span>
            </div>
            <p className="mb-3 text-sm text-gray-600">
              {(() => {
                const diff = Math.round(
                  (new Date(`${timeline.moveDate}T00:00:00Z`).getTime() -
                    Date.now()) /
                    86_400_000,
                );
                return diff > 0
                  ? `${diff} day${diff !== 1 ? "s" : ""} until your move`
                  : diff === 0
                    ? "Moving today!"
                    : `Moved ${-diff} day${-diff !== 1 ? "s" : ""} ago`;
              })()}
            </p>
            <div className="mb-3 h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0FA3A3] to-[#F4B860] transition-all"
                style={{ width: `${timeline.progress.percentage}%` }}
              />
            </div>
            <p className="mb-2 text-xs font-semibold text-gray-500">
              Up next
            </p>
            <div className="space-y-1.5">
              {timeline.tasks
                .filter((t) => !t.completed)
                .slice(0, 3)
                .map((t) => (
                  <div key={t.id} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-secondary-500" />
                    <span className="truncate">{t.title}</span>
                  </div>
                ))}
              {timeline.progress.completed === timeline.progress.total && (
                <p className="text-xs text-green-600">
                  🎉 All {timeline.progress.total} tasks complete — you're ready!
                </p>
              )}
            </div>
            <span className="mt-3 inline-block text-sm font-medium text-brand-primary-500 hover:text-brand-primary-700">
              View full timeline →
            </span>
          </Link>
        ) : (
          <Link
            to="/timeline"
            className="flex items-center gap-4 rounded-2xl border-2 border-brand-secondary-500/30 bg-gradient-to-r from-[#F0FBFA] to-[#E6F7F5] p-5 transition-all hover:shadow-md"
          >
            <span className="text-3xl">📋</span>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Plan your move</h3>
              <p className="text-sm text-gray-600">
                Get a personalized relocation checklist for your destination.
              </p>
            </div>
            <span className="rounded-full bg-brand-secondary-500 px-4 py-1.5 text-sm font-semibold text-white">
              Plan your move →
            </span>
          </Link>
        )}

        {/* Cost of living calculator link */}
        <Link
          to="/cost-of-living"
          className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md"
        >
          <span className="text-2xl">🧮</span>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">Cost of living calculator</h3>
            <p className="text-xs text-gray-500">
              Compare monthly expenses between two cities.
            </p>
          </div>
          <span className="text-sm font-medium text-brand-primary-500">Compare →</span>
        </Link>
        {/* Visa preparation card */}
        <Link
          to="/visa-guides"
          className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md"
        >
          <span className="text-2xl">🛂</span>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">Visa Preparation</h3>
            <p className="text-xs text-gray-500">
              Step-by-step guides with document checklists, timelines and costs.
            </p>
          </div>
          <span className="text-sm font-medium text-brand-primary-500">Guides →</span>
        </Link>
        {/* Featured destination hero */}
        {!loading && destinations.length > 0 && (
          <Link
            to="/destinations/$id"
            params={{ id: destinations[0].id }}
            className="block overflow-hidden rounded-2xl"
            style={{ background: "var(--gm-gradient-brand)" }}
          >
            <div className="flex items-center gap-6 p-6 text-white">
              <span className="text-5xl">{destinations[0].flag_emoji}</span>
              <div>
                <div className="text-sm font-medium text-white/70">Featured</div>
                <h2 className="text-2xl font-bold">{destinations[0].city}</h2>
                <p className="text-sm text-white/80">{destinations[0].country}</p>
                <div className="mt-2 flex gap-2 text-xs text-white/70">
                  <span>💼 Job {destinations[0].job_score}</span>
                  <span>🏠 Life {destinations[0].quality_of_life_score}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Recommended for you */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-700">Recommended for you</h2>
            <Link to="/destinations" className="text-sm font-medium text-brand-primary-500 hover:text-brand-primary-700">
              See all
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {loading ? (
              [1, 2, 3].map((i) => <div key={i} className="h-36 w-52 shrink-0 animate-pulse rounded-2xl bg-neutral-100" />)
            ) : (
              destinations.slice(0, 5).map((dest) => (
                <Link
                  key={dest.id}
                  to="/destinations/$id"
                  params={{ id: dest.id }}
                  className="card w-52 shrink-0"
                >
                  <span className="mb-2 block text-2xl">{dest.flag_emoji}</span>
                  <h3 className="font-bold text-neutral-700">{dest.city}</h3>
                  <p className="text-xs text-neutral-500">{dest.country}</p>
                  <div className="mt-2 flex gap-1.5">
                    <span className="rounded-full bg-brand-primary-50 px-2 py-0.5 text-xs text-brand-primary-700">
                      {dest.job_score}
                    </span>
                    <span className="rounded-full bg-brand-secondary-100 px-2 py-0.5 text-xs text-brand-secondary-700">
                      {dest.quality_of_life_score}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Community activity */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-neutral-700">Your community</h2>
          <div className="space-y-3">
            {[
              { name: "Ana Silva", action: "joined Toronto Tech Expats", time: "2h ago", color: "bg-brand-coral-500" },
              { name: "Marcus Chen", action: "posted in Berlin Creatives", time: "5h ago", color: "bg-brand-secondary-500" },
              { name: "Priya Patel", action: "RSVPed to Global Meetup", time: "1d ago", color: "bg-brand-gold-500" },
            ].map((item) => (
              <div key={item.name} className="card flex items-center gap-3 p-4">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${item.color}`}>
                  {item.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-neutral-700">
                    <strong>{item.name}</strong> {item.action}
                  </p>
                  <p className="text-xs text-neutral-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Not logged in notice */}
        <div className="rounded-2xl p-6 text-white" style={{ background: "var(--gm-gradient-brand)" }}>
          <h3 className="mb-1 text-lg font-bold">Your Global Journey Starts Here</h3>
          <p className="mb-4 text-sm text-white/80">Sign in to save favorites, connect with communities, and track your move.</p>
          <div className="flex gap-3">
            <Link to="/login" className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-brand-primary-700">
              Sign In
            </Link>
            <Link to="/signup" className="rounded-full border border-white/30 px-6 py-2 text-sm font-semibold text-white">
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom tab bar */}
      <BottomNav currentTab="home" />
    </div>
  );
}