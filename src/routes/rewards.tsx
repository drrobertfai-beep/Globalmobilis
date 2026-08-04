import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BottomNav } from "~/components/BottomNav";
import {
  getMyRedemptions,
  getRewards,
  redeemReward,
  REWARDS,
  type Reward,
  type UserRedemption,
} from "~/lib/redemption";
import { getMyPoints, type UserPoints } from "~/lib/points";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards — Global Mobilis" },
      {
        name: "description",
        content:
          "Spend your community points on rewards — badges, premium access, and perks — with Global Mobilis.",
      },
    ],
  }),
  component: RewardsPage,
});

const TIER_STYLES: Record<Reward["tier"], string> = {
  bronze: "bg-amber-100 text-amber-700",
  silver: "bg-neutral-100 text-neutral-600",
  gold: "bg-brand-gold-100 text-brand-gold-700",
};
const TIER_LABELS: Record<Reward["tier"], string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
};

function RewardsPage() {
  const [points, setPoints] = useState<number | null>(null);
  const [pointsLoaded, setPointsLoaded] = useState(false);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<UserRedemption | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    getMyPoints().then((p) => {
      if (!mounted) return;
      setPoints(p ? (p as UserPoints).points : null);
      setPointsLoaded(true);
    });
    getRewards().then((r) => mounted && setRewards(r));
    getMyRedemptions().then((r) => mounted && setRedemptions(r));
    return () => {
      mounted = false;
    };
  }, []);

  const signedOut = pointsLoaded && points === null;
  const redeemedIds = new Set(redemptions?.redeemed.map((r) => r.rewardId) ?? []);

  const doRedeem = async (reward: Reward) => {
    setBusyId(reward.id);
    setMessage(null);
    const res = await redeemReward(reward.id);
    if (res.success) {
      setPoints(res.points);
      setRedemptions((prev) => ({
        userId: prev?.userId ?? "",
        redeemed: [
          ...(prev?.redeemed ?? []),
          { rewardId: reward.id, redeemedAt: new Date().toISOString() },
        ],
      }));
      setMessage({ kind: "ok", text: `🎉 Redeemed ${reward.name} for ${reward.pointCost} pts!` });
    } else {
      if (res.points !== null) setPoints(res.points);
      setMessage({ kind: "err", text: res.error });
    }
    setBusyId(null);
  };

  return (
    <div className="min-h-screen bg-[var(--gm-bg)] pb-24">
      <div className="mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="pt-8 text-center">
          <div className="eyebrow">Points Redemption</div>
          <h1 className="mt-2 text-3xl font-bold text-neutral-700">
            Rewards <span className="text-brand-gold-500">Store</span>
          </h1>
          {signedOut ? (
            <p className="mx-auto mt-3 max-w-sm text-sm text-neutral-500">
              Sign in to see your points balance and redeem rewards.
            </p>
          ) : (
            <p className="mx-auto mt-3 max-w-sm text-sm text-neutral-500">
              Spend your community points on badges, premium access, and perks.
            </p>
          )}
        </div>

        {/* Signed out prompt */}
        {signedOut ? (
          <div className="card mt-8 p-10 text-center">
            <div className="text-4xl">🪙</div>
            <h2 className="mt-3 text-lg font-bold text-neutral-700">Sign in to redeem rewards</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">
              Join the forums, earn points, and unlock rewards like premium access and badges.
            </p>
            <Link to="/login" className="btn-primary mt-5 inline-block">
              Sign In
            </Link>
          </div>
        ) : (
          <>
            {/* Points balance */}
            <div className="card mt-8 flex items-center justify-between p-5">
              <div>
                <div className="text-3xl font-bold text-brand-gold-700">
                  🪙 {points ?? "—"}
                </div>
                <div className="text-xs text-neutral-500">Your points balance</div>
              </div>
              <Link
                to="/community/forums"
                className="text-sm font-medium text-brand-primary-600 hover:text-brand-primary-700 hover:underline"
              >
                Earn more in forums →
              </Link>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
                  message.kind === "ok"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Reward grid */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {rewards.map((reward) => {
                const redeemed = redeemedIds.has(reward.id);
                const affordable = (points ?? 0) >= reward.pointCost;
                return (
                  <div key={reward.id} className="card flex flex-col p-4">
                    <div className="flex items-start justify-between">
                      <div className="text-3xl">{reward.icon}</div>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TIER_STYLES[reward.tier]}`}
                      >
                        {TIER_LABELS[reward.tier]}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-neutral-700">{reward.name}</h3>
                    <p className="mt-1 flex-1 text-xs leading-relaxed text-neutral-500">
                      {reward.description}
                    </p>
                    <div className="mt-3 text-sm font-semibold text-brand-gold-700">
                      🪙 {reward.pointCost} pts
                    </div>
                    <button
                      disabled={redeemed || !affordable || busyId === reward.id}
                      onClick={() => doRedeem(reward)}
                      className={`mt-3 w-full rounded-xl py-2 text-sm font-semibold transition-colors ${
                        redeemed
                          ? "cursor-default bg-neutral-100 text-neutral-400"
                          : affordable
                            ? "btn-primary"
                            : "cursor-not-allowed bg-neutral-100 text-neutral-400"
                      }`}
                    >
                      {busyId === reward.id
                        ? "Redeeming…"
                        : redeemed
                          ? "Redeemed ✓"
                          : affordable
                            ? "Redeem"
                            : "Not enough points"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Redemption history */}
            {redemptions && redemptions.redeemed.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-3 text-lg font-bold text-neutral-700">Redemption history</h2>
                <div className="card divide-y divide-neutral-100 p-2">
                  {[...redemptions.redeemed]
                    .reverse()
                    .map((redemption, idx) => {
                      const reward =
                        rewards.find((r) => r.id === redemption.rewardId) ??
                        REWARDS.find((r) => r.id === redemption.rewardId);
                      return (
                        <div key={`${redemption.rewardId}-${idx}`} className="flex items-center gap-3 px-3 py-3">
                          <div className="text-2xl">{reward?.icon ?? "🎁"}</div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-neutral-700">
                              {reward?.name ?? redemption.rewardId}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {new Date(redemption.redeemedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-brand-gold-700">
                            -{reward?.pointCost ?? "?"} pts
                          </span>
                        </div>
                      );
                    })}
                </div>
              </section>
            )}
          </>
        )}
      </div>
      <BottomNav currentTab="profile" />
    </div>
  );
}
