import { createFileRoute } from "@tanstack/react-router";
import { submitSurveyResponse } from "~/lib/survey";

export const Route = createFileRoute("/api/survey")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { email, destination_interest, biggest_frustration, premium_features, max_monthly_payment, payment_preference, mentor_consultation_likelihood } = body;

          if (!email || !biggest_frustration) {
            return json({ error: "Email and biggest_frustration are required." }, 400);
          }

          const entry = submitSurveyResponse({
            email,
            destination_interest: destination_interest || undefined,
            biggest_frustration,
            premium_features: premium_features || [],
            max_monthly_payment: max_monthly_payment || "",
            payment_preference: payment_preference || "not_sure",
            mentor_consultation_likelihood: mentor_consultation_likelihood || 0,
          });

          return json({ success: true, id: entry.id });
        } catch (err: any) {
          return json({ error: err.message || "Internal error" }, 500);
        }
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
