import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getFeaturedDestinations, searchDestinations } from "~/lib/destinations";
import { LogoIcon } from "~/components/Logo";
import type { Destination } from "~/db.types";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedDestinations().then((data) => {
      setDestinations(data as unknown as Destination[]);
      setLoading(false);
    });
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
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          {[
            { icon: "🏠", label: "Home", href: "/dashboard", active: true },
            { icon: "🔍", label: "Explore", href: "/destinations", active: false },
            { icon: "👥", label: "Connect", href: "/community", active: false },
            { icon: "💬", label: "Messages", href: "/messages", active: false },
            { icon: "👤", label: "Profile", href: "/profile", active: false },
          ].map((tab) => (
            <Link
              key={tab.label}
              to={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
                tab.active ? "text-brand-secondary-500" : "text-neutral-500"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}