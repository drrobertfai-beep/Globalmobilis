import { Link } from "@tanstack/react-router";

/**
 * Global Mobilis — Shared Bottom Navigation
 *
 * Single source of truth for the app's bottom tab bar, used by every page
 * that previously inlined its own copy (dashboard, community, forums,
 * messages, profile, premium, timeline).
 *
 * Tab set (5 tabs):
 *   Home 🏠 /dashboard · Explore 🔍 /destinations · Timeline 📋 /timeline
 *   · Connect 👥 /community · Profile 👤 /profile
 *
 * Special cases:
 *   - `premium`: the middle tab becomes ⭐ Premium → /premium (active), so the
 *     paywall page keeps its own entry point without adding a 6th tab.
 *   - `messages`: the Messages tab was removed from the nav (not a priority
 *     feature) — the standard 5 tabs render with none highlighted.
 *
 * z-40 keeps the bar under full-screen modals (z-50) that some pages render
 * (e.g. "New thread", "Create group").
 */

export type BottomTab =
  | "home"
  | "explore"
  | "timeline"
  | "connect"
  | "profile"
  | "premium"
  | "messages";

interface TabDef {
  id: BottomTab;
  icon: string;
  label: string;
  href: string;
}

export function BottomNav({ currentTab }: { currentTab: BottomTab }) {
  const isPremium = currentTab === "premium";

  const tabs: TabDef[] = [
    { id: "home", icon: "🏠", label: "Home", href: "/dashboard" },
    { id: "explore", icon: "🔍", label: "Explore", href: "/destinations" },
    isPremium
      ? { id: "premium", icon: "⭐", label: "Premium", href: "/premium" }
      : { id: "timeline", icon: "📋", label: "Timeline", href: "/timeline" },
    { id: "connect", icon: "👥", label: "Connect", href: "/community" },
    { id: "profile", icon: "👤", label: "Profile", href: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={tab.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
              currentTab === tab.id
                ? "text-brand-secondary-500"
                : "text-neutral-500"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
