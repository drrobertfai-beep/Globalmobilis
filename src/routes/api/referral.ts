import { createFileRoute } from "@tanstack/react-router";
import {
  getOrCreateReferralCode,
  recordReferralClick,
  getReferralProgress,
} from "~/lib/referral";
import { verifySessionToken, parseCookies, SESSION_COOKIE } from "~/lib/auth";

export const Route = createFileRoute("/api/referral")({
  server: {
    handlers: {
      // GET: get the current user's referral code and progress
      GET: async ({ request }) => {
        const cookieHeader = request.headers.get("cookie");
        const cookies = parseCookies(cookieHeader);
        const token = cookies[SESSION_COOKIE];
        if (!token) return json({ error: "Not authenticated" }, 401);

        const session = await verifySessionToken(token);
        if (!session) return json({ error: "Invalid session" }, 401);

        const code = getOrCreateReferralCode({
          id: session.userId,
          name: session.name,
          email: session.email,
        });
        const progress = getReferralProgress(session.userId);

        return json({
          code: code.code,
          clicks: code.clicks,
          signups: code.signups,
          progress: {
            count: progress.count,
            needed: progress.needed,
            completed: progress.completed,
          },
          referralUrl: `/r/${code.code}`,
        });
      },

      // POST: record a click on a referral code (from landing page)
      POST: async ({ request }) => {
        try {
          const { code } = await request.json();
          if (!code) return json({ error: "Code required" }, 400);
          recordReferralClick(code);
          return json({ success: true });
        } catch {
          return json({ error: "Invalid request" }, 400);
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
