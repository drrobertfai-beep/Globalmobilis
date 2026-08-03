import Stripe from "stripe";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { SESSION_COOKIE, verifySessionToken } from "~/lib/auth";

const PRICE_IDS: Record<string, string> = {
  monthly: process.env.STRIPE_PRICE_MONTHLY || "",
  yearly: process.env.STRIPE_PRICE_YEARLY || "",
};

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2025-02-24" as any });
};

/** Coerce a FormData value to string (or undefined). */
function str(v: FormDataEntryValue | null): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}
/**
 * Extract string fields from a server-fn payload, tolerant of every shape the
 * framework can deliver: a raw FormData, `{ data: FormData, context, method }`,
 * `{ data: { ...fields } }`, or a bare `{ ...fields }` object. (POST args are
 * sent as FormData because this server build can't parse the seroval JSON
 * envelope the client's createServerFn serialization produces.)
 */
function getStrField(data: unknown, key: string): string | undefined {
  if (data instanceof FormData) return str(data.get(key));
  const obj = (data ?? {}) as Record<string, unknown>;
  const inner = obj.data;
  if (inner instanceof FormData) return str(inner.get(key));
  const src = (inner && typeof inner === "object" ? inner : obj) as Record<string, unknown>;
  return typeof src[key] === "string" ? (src[key] as string) : undefined;
}

export const createCheckoutSession = createServerFn({ method: "POST" }).handler(
  async (data: unknown) => {
    const planId = getStrField(data, "planId");
    const cancelUrl = getStrField(data, "cancelUrl");
    const successUrl = getStrField(data, "successUrl");

    const stripe = getStripe();
    if (!stripe) {
      return {
        success: false,
        url: null,
        error: "Stripe is not configured — add STRIPE_SECRET_KEY to environment.",
      };
    }

    // Resolve the price from env (STRIPE_PRICE_MONTHLY / STRIPE_PRICE_YEARLY).
    const priceId = planId === "yearly" ? PRICE_IDS.yearly : PRICE_IDS.monthly;
    if (!priceId) {
      return {
        success: false,
        url: null,
        error: "Stripe price IDs are not configured — add STRIPE_PRICE_MONTHLY / STRIPE_PRICE_YEARLY.",
      };
    }

    // Resolve the logged-in user from the session cookie so the webhook can
    // attribute the upgrade (metadata.userId).
    const token = getCookie(SESSION_COOKIE);
    let userId: string | undefined;
    if (token) {
      const session = await verifySessionToken(token);
      userId = session?.userId;
    }

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: undefined,
        metadata: { userId: userId || "anonymous" },
        success_url: successUrl || `${process.env.SITE_URL || "https://globalmobilis.com"}/premium?checkout=success`,
        cancel_url: cancelUrl || `${process.env.SITE_URL || "https://globalmobilis.com"}/premium?checkout=cancelled`,
      });

      return { success: true, url: session.url, error: null };
    } catch (err: any) {
      console.error("Stripe checkout error:", err);
      return { success: false, url: null, error: err.message || "Failed to create checkout session" };
    }
  },
);

export const premiumPlans = [
  {
    id: "monthly",
    name: "Premium Monthly",
    price: 9.99,
    period: "/month",
    description: "Perfect for active expats and globetrotters",
    priceId: PRICE_IDS.monthly || "price_monthly_placeholder",
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
    priceId: PRICE_IDS.yearly || "price_yearly_placeholder",
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
