import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

const journeyStops = [
  { city: "São Paulo", country: "Brazil", flag: "🇧🇷", year: "1995–2023", color: "bg-brand-coral-500", desc: "Born and raised" },
  { city: "Toronto", country: "Canada", flag: "🇨🇦", year: "2023–2024", color: "bg-brand-secondary-500", desc: "Moved for work — tech startup" },
  { city: "Berlin", country: "Germany", flag: "🇩🇪", year: "2024–Present", color: "bg-brand-gold-500", desc: "Current home — loving it!" },
];

const interests = ["Remote Work", "Photography", "Hiking", "Languages", "Cuisine", "Startups", "Yoga", "Travel"];

function ProfilePage() {
  return (
    <div className="pb-24">
      {/* Cover */}
      <div className="h-40" style={{ background: "var(--gm-gradient-brand)" }} />

      {/* Avatar */}
      <div className="relative mx-auto max-w-2xl px-4">
        <div className="-mt-12 mb-4 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-brand-coral-100 text-3xl font-bold text-brand-coral-700 shadow-lg">
            AS
          </div>
        </div>

        {/* Name & Bio */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-700">Alex Silva</h1>
          <p className="text-sm text-neutral-500">@alexsilva</p>
          <div className="mt-3 flex justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary-50 px-3 py-1 text-xs font-medium text-brand-primary-700">
              🇧🇷 São Paulo
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-secondary-100 px-3 py-1 text-xs font-medium text-brand-secondary-700">
              🇩🇪 Berlin
            </span>
          </div>
          <p className="mt-3 text-sm text-neutral-500 leading-relaxed max-w-md mx-auto">
            Product designer turned digital nomad. Helping people move across borders with confidence. 🌍
          </p>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border border-neutral-200 bg-white p-4">
          {[
            { label: "Connections", value: "342" },
            { label: "Posts", value: "28" },
            { label: "Groups", value: "6" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-lg font-bold text-neutral-700">{stat.value}</div>
              <div className="text-xs text-neutral-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Edit Profile */}
        <div className="mt-4">
          <button className="btn-secondary w-full">Edit Profile</button>
        </div>

        {/* Interests */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-neutral-700">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span key={interest} className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700">
                {interest}
              </span>
            ))}
          </div>
        </section>

        {/* My Journey */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-neutral-700">My Journey</h2>
          <div className="space-y-0">
            {journeyStops.map((stop, i) => (
              <div key={stop.city} className="relative flex gap-4 pb-6">
                {/* Timeline line */}
                {i < journeyStops.length - 1 && (
                  <div className="absolute left-[11px] top-6 h-full w-0.5 bg-neutral-200" />
                )}
                {/* Dot */}
                <div className={`relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${stop.color}`}>
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
                {/* Content */}
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
              className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
                tab.active ? "text-brand-secondary-500" : "text-neutral-500"
              }`}
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