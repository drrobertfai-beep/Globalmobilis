import { createFileRoute } from "@tanstack/react-router";
import { handleStripeWebhookEvent } from "~/lib/premium";

/**
 * Stripe webhook endpoint — auto-upgrades users to premium after a successful
 * subscription checkout (`checkout.session.completed`).
 *
 * POST /api/stripe-webhook
 *
 * Production: Stripe signs every request with `Stripe-Signature`; verify it with
 * the STRIPE_WEBHOOK_SECRET env var (set it in the Stripe dashboard → Webhooks →
 * your endpoint → "Signing secret"). Without the secret set (dev/preview), the
 * raw JSON body is processed directly — fine for testing, do not rely on it in
 * production.
 */
export const Route = createFileRoute("/api/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const signature = request.headers.get("stripe-signature") ?? "";

        // Verify signature when the webhook secret is configured.
        if (process.env.STRIPE_WEBHOOK_SECRET) {
          try {
            const { Stripe } = await import("stripe");
            const key = process.env.STRIPE_SECRET_KEY;
            if (!key) {
              return json(
                { received: false, error: "STRIPE_SECRET_KEY not configured" },
                500,
              );
            }
            const stripe = new Stripe(key, { apiVersion: "2025-02-24" as any });
            const event = stripe.webhooks.constructEvent(
              raw,
              signature,
              process.env.STRIPE_WEBHOOK_SECRET,
            );
            const result = await handleStripeWebhookEvent(event as unknown as Record<string, unknown>);
            return json({ received: true, handled: result.handled, upgraded: result.upgraded });
          } catch (err: any) {
            console.error("Stripe webhook signature verification failed:", err.message);
            return json({ received: false, error: "Invalid signature" }, 400);
          }
        }

        // No secret configured — trust the body (dev/preview mode).
        try {
          const payload = JSON.parse(raw);
          const result = await handleStripeWebhookEvent(payload);
          return json({
            received: true,
            handled: result.handled,
            upgraded: result.upgraded,
            reason: result.reason,
          });
        } catch (err: any) {
          console.error("Stripe webhook parse error:", err.message);
          return json({ received: false, error: "Invalid JSON body" }, 400);
        }
      },
      /** Quick GET to verify the endpoint is reachable (Stripe will not call this). */
      GET: async () => {
        return json({
          ok: true,
          endpoint: "stripe-webhook",
          instructions:
            "POST checkout.session.completed events here to upgrade users to premium. Set STRIPE_WEBHOOK_SECRET to verify signatures.",
        });
      },
    },
  },
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
