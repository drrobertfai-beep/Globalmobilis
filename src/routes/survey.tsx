import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/survey")({
  component: SurveyPage,
});

const QUESTIONS = {
  frustration: "What's your single biggest frustration with your upcoming move?",
  premiumFeatures: "Which premium features would you value most? (select all that apply)",
  maxPayment: "What's the most you'd pay per month for premium relocation tools?",
  paymentPref: "Would you prefer a subscription or one-time payment?",
  mentorLikelihood: "How likely are you to pay for 1-on-1 video consultations with local experts?",
};

const PREMIUM_OPTIONS = [
  "Interactive relocation timeline & checklist",
  "Real-time translation in messages & calls",
  "1-on-1 video consultations with local mentors",
  "Customizable cost-of-living calculator",
  "Visa & document preparation guides",
  "Housing search & booking tools",
  "Expat community forums & events",
];

const PAYMENT_OPTIONS = ["Free only", "$4.99/mo", "$9.99/mo", "$14.99/mo", "$19.99+"];
const PAYMENT_PREFS = [
  { value: "subscription", label: "Monthly subscription" },
  { value: "one_time", label: "One-time relocation pass" },
  { value: "not_sure", label: "Not sure yet" },
];

function SurveyPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [destination, setDestination] = useState("");
  const [frustration, setFrustration] = useState("");
  const [premiumFeatures, setPremiumFeatures] = useState<string[]>([]);
  const [maxPayment, setMaxPayment] = useState("");
  const [paymentPref, setPaymentPref] = useState("");
  const [mentorLikelihood, setMentorLikelihood] = useState(0);

  const totalSteps = 5;

  function toggleFeature(f: string) {
    setPremiumFeatures((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }

  async function handleSubmit() {
    if (!email.trim()) {
      setError("Please enter your email so we can follow up.");
      return;
    }
    if (!frustration.trim()) {
      setError("Please tell us your biggest frustration — it helps us build the right thing.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          destination_interest: destination.trim() || undefined,
          biggest_frustration: frustration.trim(),
          premium_features: premiumFeatures,
          max_monthly_payment: maxPayment,
          payment_preference: paymentPref || "not_sure",
          mentor_consultation_likelihood: mentorLikelihood,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Something went wrong");
      }
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="flex min-h-[80dvh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mb-4 text-6xl">🎉</div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Thank you!</h1>
          <p className="mb-6 text-gray-600">
            Your feedback will directly shape what we build next. We'll be in touch with early access opportunities.
          </p>
          <Link
            to="/dashboard"
            className="inline-block rounded-full bg-[#0E4F8B] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1B7A9B]"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-8 sm:px-6">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
          <span>Step {step + 1} of {totalSteps}</span>
          <span>{Math.round(((step + 1) / totalSteps) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0E4F8B] to-[#0FA3A3] transition-all duration-300"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 0: Email & Destination */}
      {step === 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Let's get to know you</h2>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Email address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-[#0E4F8B] focus:outline-none focus:ring-2 focus:ring-[#0E4F8B]/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Which destination are you most interested in? (optional)
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Toronto, Berlin, Tokyo..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-[#0E4F8B] focus:outline-none focus:ring-2 focus:ring-[#0E4F8B]/20"
            />
          </div>
        </div>
      )}

      {/* Step 1: Biggest frustration */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">{QUESTIONS.frustration}</h2>
          <textarea
            value={frustration}
            onChange={(e) => setFrustration(e.target.value)}
            rows={4}
            placeholder="Tell us what stresses you out most about relocating..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-[#0E4F8B] focus:outline-none focus:ring-2 focus:ring-[#0E4F8B]/20"
          />
        </div>
      )}

      {/* Step 2: Premium features */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">{QUESTIONS.premiumFeatures}</h2>
          <div className="space-y-3">
            {PREMIUM_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggleFeature(opt)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                  premiumFeatures.includes(opt)
                    ? "border-[#0E4F8B] bg-[#0E4F8B]/5 text-[#0E4F8B] font-medium"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {premiumFeatures.includes(opt) && <span className="mr-2">✓</span>}
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Max payment */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">{QUESTIONS.maxPayment}</h2>
          <div className="space-y-3">
            {PAYMENT_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setMaxPayment(opt)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                  maxPayment === opt
                    ? "border-[#0E4F8B] bg-[#0E4F8B]/5 text-[#0E4F8B] font-medium"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">{QUESTIONS.paymentPref}</h3>
            <div className="space-y-3">
              {PAYMENT_PREFS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPaymentPref(p.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                    paymentPref === p.value
                      ? "border-[#0E4F8B] bg-[#0E4F8B]/5 text-[#0E4F8B] font-medium"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Mentor likelihood */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">{QUESTIONS.mentorLikelihood}</h2>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setMentorLikelihood(n)}
                className={`flex h-16 w-16 items-center justify-center rounded-xl text-2xl transition-all ${
                  mentorLikelihood >= n
                    ? "bg-[#0E4F8B] text-white shadow-lg scale-105"
                    : "border border-gray-200 bg-white text-gray-400 hover:border-gray-300"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            {mentorLikelihood === 0
              ? "Tap a number to rate"
              : mentorLikelihood <= 2
                ? "Not likely"
                : mentorLikelihood === 3
                  ? "Maybe"
                  : "Very likely"}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
            step === 0
              ? "invisible"
              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Back
        </button>

        {step < totalSteps - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
            className="rounded-full bg-[#0E4F8B] px-8 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#1B7A9B]"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-full bg-gradient-to-r from-[#0E4F8B] to-[#0FA3A3] px-8 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        )}
      </div>

      {/* Skip link */}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => (window.location.href = "/dashboard")}
          className="text-sm text-gray-400 underline hover:text-gray-600"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
