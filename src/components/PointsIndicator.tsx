import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMyPoints } from "~/lib/points";

/**
 * Header points chip — shows the signed-in user's point balance (💎 N) and
 * links to /rewards. Renders nothing for signed-out users or while loading.
 */
export function PointsIndicator() {
  const [points, setPoints] = useState<number | null>(null);
  useEffect(() => {
    let mounted = true;
    getMyPoints().then((p) => {
      if (mounted) setPoints(p ? p.points : null);
    });
    return () => {
      mounted = false;
    };
  }, []);
  if (points === null) return null;
  return (
    <Link
      to="/rewards"
      title={`${points} points — redeem for premium access`}
      className="inline-flex items-center gap-1 rounded-full border border-[#F4B860]/50 bg-[#FFF8ED] px-3 py-1 text-[11px] font-bold text-[#B8860B] shadow-sm transition-transform hover:scale-105"
    >
      <span aria-hidden>💎</span> {points}
    </Link>
  );
}
