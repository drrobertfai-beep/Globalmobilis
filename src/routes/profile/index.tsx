import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { BottomNav } from "~/components/BottomNav";
import { getMyPoints, type UserPoints } from "~/lib/points";
import { getMyRedemptions, REWARDS, type Reward, type UserRedemption } from "~/lib/redemption";
export const Route = createFileRoute("/profile/")({
  component: ProfilePage,
});

const journeyStops = [
  { city: "São Paulo", country: "Brazil", flag: "🇧🇷", year: "1995–2023", color: "bg-brand-coral-500", desc: "Born and raised" },
  { city: "Toronto", country: "Canada", flag: "🇨🇦", year: "2023–2024", color: "bg-brand-secondary-500", desc: "Moved for work — tech startup" },
  { city: "Berlin", country: "Germany", flag: "🇩🇪", year: "2024–Present", color: "bg-brand-gold-500", desc: "Current home — loving it!" },
];

const interests = ["Remote Work", "Photography", "Hiking", "Languages", "Cuisine", "Startups", "Yoga", "Travel"];

function ProfilePage() {
  const [pointsData, setPointsData] = useState<UserPoints | null>(null);
  const [pointsLoaded, setPointsLoaded] = useState(false);
  const [redemptions, setRedemptions] = useState<UserRedemption | null>(null);

  useEffect(() => {
    getMyPoints()
      .then((result) => setPointsData(result as UserPoints | null))
      .catch(() => setPointsData(null))
      .finally(() => setPointsLoaded(true));
    getMyRedemptions().then((r) => setRedemptions(r as UserRedemption | null));
  }, []);
  const redeemedRewards: Reward[] = (redemptions?.redeemed ?? [])
    .map((r) => REWARDS.find((x) => x.id === r.rewardId))
    .filter((x): x is Reward => !!x);

  const showPoints = pointsLoaded && pointsData !== null;

  return (
    <div className="pb-24">
      {/* Cover */}
      <div className="h-40" style={{ background: "var(--gm-gradient-brand)" }} />

      {/* Avatar */}
      <div className="relative mx-auto max-w-2xl px-4">
        <div className="-mt-12 mb-4 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-brand-coral-100 text-3xl font-bold text-brand-coral-700 shadow-lg">
            AS
          </div>
        </div>

        {/* Name & Bio */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-700">Alex Silva</h1>
          <p className="text-sm text-neutral-500">@alexsilva</p>
          <div className="mt-3 flex justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary-50 px-3 py-1 text-xs font-medium text-brand-primary-700">
              🇧🇷 São Paulo
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-secondary-100 px-3 py-1 text-xs font-medium text-brand-secondary-700">
              🇩🇪 Berlin
            </span>
          </div>
          <p className="mt-3 text-sm text-neutral-500 leading-relaxed max-w-md mx-auto">
            Product designer turned digital nomad. Helping people move across borders with confidence. 🌍
          </p>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border border-neutral-200 bg-white p-4">
          {[
            { label: "Connections", value: "342" },
            { label: "Posts", value: "28" },
            { label: "Groups", value: "6" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-lg font-bold text-neutral-700">{stat.value}</div>
              <div className="text-xs text-neutral-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Edit Profile */}
        <div className="mt-4">
          <button className="btn-secondary w-full">Edit Profile</button>
        </div>

        {/* Community Points */}
        {showPoints && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-bold text-neutral-700">Community Points</h2>
            {pointsData!.points === 0 ? (
              <div className="card p-6 text-center">
                <div className="text-3xl">🏅</div>
                <p className="mt-2 font-medium text-neutral-700">No points yet</p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-neutral-500">
                  Join the forums — start threads, answer questions, and get upvoted to earn points and badges.
                </p>
                <Link to="/community/forums" className="btn-primary mt-4 inline-block">
                  Explore Forums
                </Link>
              </div>
            ) : (
              <div className="card p-5">
                {/* Total points */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-brand-primary-700">{pointsData!.points}</div>
                    <div className="text-xs text-neutral-500">Total points</div>
                  </div>
                  <Link
                    to="/rewards"
                    className="text-sm font-semibold text-brand-gold-700 hover:text-brand-gold-500 hover:underline"
                  >
                    Redeem rewards →
                  </Link>
                </div>

                {/* Badges */}
                {pointsData!.badges.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Badges</div>
                    <div className="flex flex-wrap gap-2">
                      {pointsData!.badges.map((badge) => (
                        <span
                          key={badge}
                          className="inline-flex items-center gap-1 rounded-full bg-brand-gold-100 px-3 py-1 text-xs font-medium text-brand-gold-700"
                        >
                          🏅 {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Active rewards (redeemed) */}
                {redeemedRewards.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Active rewards</div>
                    <div className="flex flex-wrap gap-2">
                      {redeemedRewards.map((reward) => (
                        <span
                          key={reward.id}
                          className="inline-flex items-center gap-1 rounded-full bg-brand-gold-100 px-3 py-1 text-xs font-medium text-brand-gold-700"
                        >
                          {reward.icon} {reward.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Threads started", value: pointsData!.stats.threadsCreated },
                    { label: "Replies posted", value: pointsData!.stats.repliesPosted },
                    { label: "Upvotes received", value: pointsData!.stats.upvotesReceived },
                    { label: "Upvotes given", value: pointsData!.stats.upvotesGiven },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-neutral-100 p-3 text-center">
                      <div className="text-lg font-bold text-neutral-700">{stat.value}</div>
                      <div className="text-xs text-neutral-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Interests */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-neutral-700">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span key={interest} className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700">
                {interest}
              </span>
            ))}
          </div>
        </section>

        {/* My Journey */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-neutral-700">My Journey</h2>
          <div className="space-y-0">
            {journeyStops.map((stop, i) => (
              <div key={stop.city} className="relative flex gap-4 pb-6">
                {/* Timeline line */}
                {i < journeyStops.length - 1 && (
                  <div className="absolute left-[11px] top-6 h-full w-0.5 bg-neutral-200" />
                )}
                {/* Dot */}
                <div className={`relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${stop.color}`}>
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
                {/* Content */}
                <div className="card flex-1 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{stop.flag}</span>
                    <div>
                      <h3 className="font-bold text-neutral-700">{stop.city}</h3>
                      <p className="text-xs text-neutral-500">{stop.country}</p>
                    </div>
                    <span className="ml-auto text-xs text-neutral-500">{stop.year}</span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">{stop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom tab bar */}
      <BottomNav currentTab="profile" />
    </div>
  );
}
