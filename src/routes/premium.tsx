import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/premium")({
  component: PremiumPage,
});

const STRIPE_MONTHLY = "https://buy.stripe.com/5kQ00j2hOcfx3k8aI09EI00";
const STRIPE_YEARLY = "https://buy.stripe.com/3cI6oH8GcgvN07WdUc9EI01";

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
                <a
                  href={plan.stripeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn w-full text-center inline-block ${
                    plan.highlighted ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  Subscribe — ${plan.price}{plan.period}
                </a>
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
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          {[
            { icon: "🏠", label: "Home", href: "/dashboard", active: false },
            { icon: "🔍", label: "Explore", href: "/destinations", active: false },
            { icon: "⭐", label: "Premium", href: "/premium", active: true },
            { icon: "💬", label: "Messages", href: "/messages", active: false },
            { icon: "👤", label: "Profile", href: "/profile", active: false },
          ].map((tab) => (
            <Link
              key={tab.label}
              to={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 ${tab.active ? "text-brand-secondary-500" : "text-neutral-500"}`}
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