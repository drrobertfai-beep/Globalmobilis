import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/$id")({
  component: PublicProfilePage,
});

interface PublicProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  color: string;
  bio: string;
  home: { city: string; flag: string };
  current: { city: string; flag: string };
  connections: number;
  interests: string[];
  journey: { city: string; country: string; flag: string; year: string; color: string; desc: string }[];
}

const mockProfiles: Record<string, PublicProfile> = {
  "ana-silva": {
    id: "ana-silva", name: "Ana Silva", username: "@anasilva", avatar: "AS", color: "bg-brand-coral-500",
    bio: "Software engineer turned expat. Helping others navigate the move to Canada. 🇨🇦",
    home: { city: "São Paulo", flag: "🇧🇷" },
    current: { city: "Toronto", flag: "🇨🇦" },
    connections: 287,
    interests: ["Tech", "Hiking", "Photography", "Coffee", "Startups"],
    journey: [
      { city: "São Paulo", country: "Brazil", flag: "🇧🇷", year: "1995–2023", color: "bg-brand-coral-500", desc: "Born and raised" },
      { city: "Toronto", country: "Canada", flag: "🇨🇦", year: "2023–Present", color: "bg-brand-secondary-500", desc: "Moved for work — loving it!" },
    ],
  },
  "marcus-chen": {
    id: "marcus-chen", name: "Marcus Chen", username: "@marcuschen", avatar: "MC", color: "bg-brand-secondary-500",
    bio: "Product designer. Berlin via Singapore. Ask me about the visa process! 🇩🇪",
    home: { city: "Singapore", flag: "🇸🇬" },
    current: { city: "Berlin", flag: "🇩🇪" },
    connections: 412,
    interests: ["Design", "Music", "Languages", "Cycling"],
    journey: [
      { city: "Singapore", country: "Singapore", flag: "🇸🇬", year: "1992–2021", color: "bg-brand-primary-500", desc: "Grew up in the Lion City" },
      { city: "Berlin", country: "Germany", flag: "🇩🇪", year: "2021–Present", color: "bg-brand-gold-500", desc: "Living the Berlin life" },
    ],
  },
};

function PublicProfilePage() {
  const { id } = Route.useParams();
  const profile = mockProfiles[id];

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-neutral-700">Profile not found</h1>
          <Link to="/community" className="text-brand-primary-500 hover:underline">Back to community</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Cover */}
      <div className="h-40" style={{ background: "var(--gm-gradient-brand)" }} />

      <div className="relative mx-auto max-w-2xl px-4">
        {/* Avatar */}
        <div className="-mt-12 mb-4 flex justify-center">
          <div className={`flex h-24 w-24 items-center justify-center rounded-full border-4 border-white text-3xl font-bold text-white shadow-lg ${profile.color}`}>
            {profile.avatar}
          </div>
        </div>

        {/* Name & Bio */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-700">{profile.name}</h1>
          <p className="text-sm text-neutral-500">{profile.username}</p>
          <div className="mt-3 flex justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary-50 px-3 py-1 text-xs font-medium text-brand-primary-700">
              {profile.home.flag} {profile.home.city}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-secondary-100 px-3 py-1 text-xs font-medium text-brand-secondary-700">
              {profile.current.flag} {profile.current.city}
            </span>
          </div>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
            {profile.bio}
          </p>
        </div>

        {/* Message button */}
        <div className="mt-4">
          <Link
            to="/messages/$id"
            params={{ id: "new" }}
            className="btn-primary w-full"
          >
            Message {profile.name.split(" ")[0]}
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="text-center">
            <div className="text-lg font-bold text-neutral-700">{profile.connections}</div>
            <div className="text-xs text-neutral-500">Connections</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-neutral-700">15</div>
            <div className="text-xs text-neutral-500">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-neutral-700">4</div>
            <div className="text-xs text-neutral-500">Groups</div>
          </div>
        </div>

        {/* Interests */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-neutral-700">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span key={interest} className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700">
                {interest}
              </span>
            ))}
          </div>
        </section>

        {/* Journey */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-neutral-700">My Journey</h2>
          <div className="space-y-0">
            {profile.journey.map((stop, i) => (
              <div key={stop.city} className="relative flex gap-4 pb-6">
                {i < profile.journey.length - 1 && (
                  <div className="absolute left-[11px] top-6 h-full w-0.5 bg-neutral-200" />
                )}
                <div className={`relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${stop.color}`}>
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
                <div className="card flex-1 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{stop.flag}</span>
                    <div>
                      <h3 className="font-bold text-neutral-700">{stop.city}</h3>
                      <p className="text-xs text-neutral-500">{stop.country}</p>
                    </div>
                    <span className="ml-auto text-xs text-neutral-500">{stop.year}</span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">{stop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          {[
            { icon: "🏠", label: "Home", href: "/dashboard", active: false },
            { icon: "🔍", label: "Explore", href: "/destinations", active: false },
            { icon: "👥", label: "Connect", href: "/community", active: false },
            { icon: "💬", label: "Messages", href: "/messages", active: false },
            { icon: "👤", label: "Profile", href: "/profile", active: true },
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