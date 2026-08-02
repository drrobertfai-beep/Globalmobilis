import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { getPremiumStatus } from "~/lib/premium";
import type { PremiumStatus } from "~/lib/premium";

/**
 * PremiumBadge — small ⭐ badge shown next to the nav/auth area for
 * subscribed users. Renders nothing until the (fast) status check resolves,
 * and renders nothing at all for free users / guests.
 */
export function PremiumBadge() {
  const [status, setStatus] = useState<PremiumStatus | null>(null);

  useEffect(() => {
    let mounted = true;
    getPremiumStatus().then((s) => {
      if (mounted) setStatus(s);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!status?.subscribed) return null;

  return (
    <Link
      to="/premium"
      title="You're a Premium member"
      className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-[11px] font-bold text-white shadow-sm transition-transform hover:scale-105"
    >
      <span aria-hidden>⭐</span> Premium
    </Link>
  );
}
