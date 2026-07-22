import Stripe from "stripe";
import { createServerFn } from "@tanstack/react-start";

const PRICE_IDS: Record<string, string> = {
  monthly: process.env.STRIPE_PRICE_MONTHLY || "",
  yearly: process.env.STRIPE_PRICE_YEARLY || "",
};

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2025-02-24" as any });
};

export const createCheckoutSession = createServerFn({ method: "POST" }).handler(
  async (data: unknown) => {
    const { priceId, userId, cancelUrl, successUrl } = data as {
      priceId: string;
      userId?: string;
      cancelUrl?: string;
      successUrl?: string;
    };

    const stripe = getStripe();
    if (!stripe) {
      return {
        success: false,
        url: null,
        error: "Stripe is not configured — add STRIPE_SECRET_KEY to environment.",
      };
    }

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: undefined,
        metadata: { userId: userId || "anonymous" },
        success_url: successUrl || `${process.env.SITE_URL || "https://globalmobilis.com"}/dashboard?checkout=success`,
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