import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { getPremiumStatus } from "~/lib/premium";
import type { PremiumStatus } from "~/lib/premium";

/**
 * PremiumGate — wraps premium-only content. Free users see an upgrade prompt
 * instead of the protected UI; subscribed users see the children as-is.
 *
 * Usage:
 *   <PremiumGate>
 *     <PremiumContent />
 *   </PremiumGate>
 */
export function PremiumGate({ children }: { children: React.ReactNode }) {
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

  // Loading state — brief skeleton so subscribed users don't see a flash.
  if (!status) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (status.subscribed) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-secondary-500 to-brand-primary-600 text-2xl">
          ⭐
        </div>
        <h2 className="mt-4 text-xl font-bold text-neutral-700">
          This feature is Premium
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          Unlock side-by-side destination comparisons, expert consultations,
          enhanced translation, and detailed market &amp; cost-of-living reports
          with a Premium subscription.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link
            to="/premium"
            className="btn rounded-xl bg-gradient-to-r from-brand-primary-600 to-brand-secondary-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
          >
            See Premium Plans
          </Link>
          {!status.loggedIn && (
            <Link
              to="/login"
              className="rounded-xl px-6 py-2.5 text-sm font-semibold text-brand-primary-600 hover:bg-brand-primary-50"
            >
              Sign in to your account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
