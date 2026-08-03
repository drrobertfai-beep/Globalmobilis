import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createCheckoutSession } from "~/lib/stripe";
import {
  activatePremium,
  getPremiumStatus,
} from "~/lib/premium";




import type { PremiumStatus } from "~/lib/premium";

import { BottomNav } from "~/components/BottomNav";
export const Route = createFileRoute("/premium")({
  component: PremiumPage,
});

// Stripe payment links — used as the fallback when the Stripe API keys aren't
// configured yet (createCheckoutSession returns an error) or for guests.
const STRIPE_MONTHLY = "https://buy.stripe.com/00weVd3lS0wPg6U7vO9EI02";
const STRIPE_YEARLY = "https://buy.stripe.com/9B6cN53lS0wP3k8bM49EI03";
const plans = [
  {
    id: "monthly",
    name: "Premium Monthly",
    price: 9.99,
    period: "/month",
    description: "Perfect for active expats and globetrotters",
    stripeUrl: STRIPE_MONTHLY,
    features: [
      "Advanced destination comparisons",
      "Direct expert consultations",
      "Enhanced translation (50/mo)",
      "Priority support",
      "Detailed market reports",
      "Cost of living breakdowns",
      "Community mentorship access",
      "Ad-free experience",
    ],
    highlighted: false,
  },
  {
    id: "yearly",
    name: "Premium Yearly",
    price: 79.99,
    period: "/year",
    description: "Best value — save 33% over monthly",
    stripeUrl: STRIPE_YEARLY,
    features: [
      "Everything in Monthly",
      "Unlimited translations",
      "VIP expert consultations",
      "Exclusive expat events",
      "Premium destination data",
      "Early access to new features",
      "Custom relocation checklist",
      "Personalized job alerts",
    ],
    highlighted: true,
  },
];

function PremiumPage() {
  const [status, setStatus] = useState<PremiumStatus | null>(null);
  const [busyPlan, setBusyPlan] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);

  const search = Route.useSearch() as { checkout?: string };
  const checkoutParam = search.checkout;

  useEffect(() => {
    let mounted = true;
    getPremiumStatus().then((s) => {
      if (mounted) setStatus(s);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const startCheckout = async (plan: (typeof plans)[number]) => {
    setBusyPlan(plan.id);
    setCheckoutError(null);

    // Guests: send them to sign in first so their purchase can be linked.
    if (!status?.loggedIn) {
      window.location.href = `/login?next=/premium`;
      return;
    }

    const base = `${window.location.origin}`;
    const fd = new FormData();
    fd.set("planId", plan.id);
    fd.set("cancelUrl", `${base}/premium?checkout=cancelled`);
    fd.set("successUrl", `${base}/premium?checkout=success`);
    const res = await createCheckoutSession(fd);

    if (res.success && res.url) {
      window.location.href = res.url;
    } else {
      // Stripe API keys not configured — fall back to the hosted payment link.
      window.location.href = plan.stripeUrl;
    }
  };

  const completeActivation = async () => {
    setActivating(true);
    const res = await activatePremium();
    setActivating(false);
    if (res.success) {
      setActivated(true);
      setStatus(res.status);
    } else {
      setCheckoutError(res.error ?? "Activation failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gm-bg)] pb-24">
      {/* Header */}
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <div className="eyebrow">Pricing</div>
          <h1 className="mt-3 text-4xl font-bold text-neutral-700">
            Go <span className="text-brand-secondary-500">Premium</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-neutral-500">
            Unlock the full power of Global Mobilis. Compare destinations side-by-side,
            get expert advice, translate anything, and connect with a global community.
          </p>
        </div>
      </div>

      {/* Subscription status */}
      <div className="mx-auto mt-8 max-w-4xl px-4">
        {status?.subscribed ? (
          <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-sm font-bold text-neutral-700">
                  You're {activated ? "now" : ""} a Premium member{status.planLabel ? ` — ${status.planLabel}` : ""} 🎉
                </p>
                <p className="text-xs text-neutral-500">
                  All premium features are unlocked for {status.name || "your account"}.
                </p>
              </div>
            </div>
            <Link
              to="/destinations/compare"
              className="rounded-xl bg-gradient-to-r from-brand-primary-600 to-brand-secondary-600 px-5 py-2.5 text-sm font-bold text-white shadow hover:opacity-95"
            >
              Try Compare Tool
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-6 py-4">
            <span className="text-xl">🔓</span>
            <div>
              <p className="text-sm font-semibold text-neutral-700">
                You're on the Free plan
              </p>
              <p className="text-xs text-neutral-500">
                {status?.loggedIn
                  ? "Upgrade to unlock advanced comparisons, expert consultations, and more."
                  : "Sign in and upgrade to unlock advanced comparisons, expert consultations, and more."}
              </p>
            </div>
          </div>
        )}

        {/* Post-checkout banner */}
        {(checkoutParam === "success" || activated) && (
          <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-6 py-4">
            <p className="text-sm font-semibold text-green-800">
              ✅ Payment received{activated ? " and premium activated" : ""}!
            </p>
            <p className="mt-1 text-xs text-green-700">
              {status?.subscribed
                ? "Your account is fully upgraded. Enjoy premium!"
                : "Your payment went through. Activate premium on your account to unlock everything."}
            </p>
            {!status?.subscribed && (
              <button
                onClick={completeActivation}
                disabled={activating}
                className="mt-3 rounded-xl bg-green-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
              >
                {activating ? "Activating…" : "Activate Premium on my account"}
              </button>
            )}
          </div>
        )}
        {checkoutParam === "cancelled" && !activated && (
          <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-4 text-sm text-neutral-600">
            Checkout was cancelled — no charge was made. You can try again anytime.
          </div>
        )}
        {checkoutError && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-6 py-3 text-sm font-medium text-red-700">
            {checkoutError}
          </div>
        )}
      </div>

      {/* Plans grid */}
      <div className="mx-auto mt-8 max-w-4xl px-4">
        <div className="grid gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`card relative overflow-hidden transition-all ${
                plan.highlighted ? "ring-2 ring-brand-secondary-500 shadow-lg" : ""
              }`}
            >
              {plan.highlighted && (
                <div className="absolute right-0 top-0 rounded-bl-xl bg-brand-secondary-500 px-3 py-1 text-[10px] font-bold text-white">
                  BEST VALUE
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-bold text-neutral-700">{plan.name}</h3>
                <p className="mt-1 text-sm text-neutral-500">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-neutral-700">${plan.price}</span>
                  <span className="text-sm text-neutral-500">{plan.period}</span>
                </div>
                <div className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-brand-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-neutral-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-neutral-100 bg-neutral-50/50 px-6 py-4">
                {status?.subscribed ? (
                  <button
                    disabled
                    className="btn w-full cursor-default text-center inline-block bg-green-100 text-green-800"
                  >
                    ✓ Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => startCheckout(plan)}
                    disabled={busyPlan === plan.id}
                    className={`btn w-full text-center inline-block ${
                      plan.highlighted ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {busyPlan === plan.id
                      ? "Redirecting…"
                      : `Subscribe — $${plan.price}${plan.period}`}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Free tier comparison */}
        <section className="mt-16">
          <h2 className="mb-6 text-center text-xl font-bold text-neutral-700">
            Compare Plans
          </h2>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-6 py-4 font-semibold text-neutral-700">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-neutral-500">Free</th>
                  <th className="px-6 py-4 text-center font-semibold text-brand-secondary-700">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {[
                  { name: "Destination info", free: "✅", premium: "✅" },
                  { name: "Basic messaging", free: "✅", premium: "✅" },
                  { name: "Community access", free: "✅", premium: "✅" },
                  { name: "Advanced comparisons", free: "—", premium: "✅" },
                  { name: "Expert consultations", free: "—", premium: "✅" },
                  { name: "Translations per month", free: "5", premium: "Unlimited" },
                  { name: "Priority support", free: "—", premium: "✅" },
                  { name: "Detailed market reports", free: "—", premium: "✅" },
                  { name: "Ad-free", free: "—", premium: "✅" },
                  { name: "Exclusive events", free: "—", premium: "✅" },
                ].map((row) => (
                  <tr key={row.name}>
                    <td className="px-6 py-3 font-medium text-neutral-700">{row.name}</td>
                    <td className="px-6 py-3 text-center text-neutral-500">{row.free}</td>
                    <td className="px-6 py-3 text-center font-medium text-brand-secondary-700">{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="mb-6 text-center text-xl font-bold text-neutral-700">FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "Can I switch plans later?", a: "Yes! You can upgrade or downgrade anytime. Changes take effect on your next billing cycle." },
              { q: "Is there a free trial?", a: "We offer a 14-day free trial on Premium Monthly. Cancel anytime before the trial ends." },
              { q: "What payment methods do you accept?", a: "All major credit cards, PayPal, and Apple Pay via Stripe." },
              { q: "Can I get a refund?", a: "Absolutely. We offer a 30-day money-back guarantee — no questions asked." },
            ].map((faq) => (
              <details key={faq.q} className="card group">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-semibold text-neutral-700">
                  {faq.q}
                  <svg className="h-4 w-4 text-neutral-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="border-t border-neutral-100 px-6 py-4 text-sm text-neutral-500">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-brand-primary-600 to-brand-secondary-600 px-8 py-12 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to go global?</h2>
          <p className="mt-2 text-white/80">Join thousands of expats who've made the move with Global Mobilis.</p>
          <Link to="/signup" className="btn mt-6 inline-block rounded-xl bg-white px-8 py-3 text-sm font-bold text-brand-primary-700 hover:bg-neutral-100">
            Start Your Journey
          </Link>
        </div>
      </div>

      {/* Footer nav */}
      <BottomNav currentTab="premium" />
    </div>
  );
}
