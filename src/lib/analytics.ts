/**
 * Global Mobilis — Analytics
 *
 * Privacy-friendly analytics via Simple Analytics.
 * Tracks page views automatically and key business events.
 */

// ── Script injection (called once in root layout) ────

export function AnalyticsScript() {
  return (
    <script async src="https://scripts.simpleanalyticscdn.com/latest.js" />
  );
}

// ── Event tracking ───────────────────────────────────

declare global {
  interface Window {
    sa_event?: (name: string, meta?: Record<string, unknown>) => void;
  }
}

export function trackEvent(name: string, meta?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.sa_event) {
    window.sa_event(name, meta);
  }
}

// ── Business events ──────────────────────────────────

export const Analytics = {
  signup() {
    trackEvent("signup");
  },
  login() {
    trackEvent("login");
  },
  premiumView() {
    trackEvent("premium_page_view");
  },
  premiumClick(plan: "monthly" | "yearly") {
    trackEvent("premium_click", { plan });
  },
  destinationView(city: string, country: string) {
    trackEvent("destination_view", { city, country });
  },
  compareView() {
    trackEvent("compare_view");
  },
  reviewSubmitted(destinationId: string) {
    trackEvent("review_submitted", { destinationId });
  },
  groupJoined(groupId: string) {
    trackEvent("group_joined", { groupId });
  },
  eventRsvp(eventId: string) {
    trackEvent("event_rsvp", { eventId });
  },
  messageSent() {
    trackEvent("message_sent");
  },
  waitlistSignup() {
    trackEvent("waitlist_signup");
  },
};
