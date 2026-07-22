import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/community/")({
  component: CommunityPage,
});

const groups = [
  { name: "Toronto Tech Expats", members: "1.2k", type: "Professional", icon: "💼", color: "bg-brand-primary-500" },
  { name: "Berlin Creatives", members: "856", type: "Cultural", icon: "🎨", color: "bg-brand-coral-500" },
  { name: "Dubai Entrepreneurs", members: "632", type: "Business", icon: "🚀", color: "bg-brand-gold-500" },
  { name: "Global Nomads", members: "3.4k", type: "Social", icon: "🌍", color: "bg-brand-secondary-500" },
  { name: "London Finance & Tech", members: "2.1k", type: "Professional", icon: "📊", color: "bg-brand-primary-700" },
  { name: "New Families in Sydney", members: "423", type: "Support", icon: "👪", color: "bg-brand-coral-700" },
];

const events = [
  { title: "Remote Work in Lisbon", group: "Global Nomads", date: "Fri, Jul 19", time: "6:00 PM", attendees: 34 },
  { title: "Toronto Tech Meetup", group: "Toronto Tech Expats", date: "Sat, Jul 20", time: "2:00 PM", attendees: 56 },
  { title: "Berlin Startup Pitch Night", group: "Berlin Creatives", date: "Wed, Jul 24", time: "7:00 PM", attendees: 28 },
];

function CommunityPage() {
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white px-4 pb-2 pt-6 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-neutral-700">Community</h1>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary-50 text-brand-primary-700">
              <span className="text-lg">+</span>
            </button>
          </div>
          <div className="mb-4 flex gap-2 overflow-x-auto hide-scrollbar">
            {["All", "Your Groups", "Nearby", "Following", "Events"].map((chip) => (
              <button
                key={chip}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium ${
                  chip === "All" ? "bg-brand-primary-700 text-white" : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6">
        {/* Your Groups */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-neutral-700">Your groups</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {groups.slice(0, 4).map((group) => (
              <div key={group.name} className="card w-48 shrink-0 p-4">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg text-white ${group.color}`}>
                  {group.icon}
                </div>
                <h3 className="text-sm font-bold text-neutral-700">{group.name}</h3>
                <p className="text-xs text-neutral-500">{group.members} members</p>
              </div>
            ))}
          </div>
        </section>

        {/* Discover Groups */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-neutral-700">Discover groups near you</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {groups.map((group) => (
              <div key={group.name} className="card flex items-center gap-3 p-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg text-white ${group.color}`}>
                  {group.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-neutral-700">{group.name}</h3>
                  <p className="text-xs text-neutral-500">{group.type} · {group.members} members</p>
                </div>
                <button className="shrink-0 rounded-full bg-brand-secondary-100 px-3 py-1 text-xs font-medium text-brand-secondary-700">
                  Join
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Events */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-neutral-700">Upcoming events</h2>
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.title} className="card flex items-center gap-4 p-4">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-primary-50 text-center">
                  <span className="text-xs font-bold text-brand-primary-700">{event.date.split(",")[0].split(" ")[1]}</span>
                  <span className="text-[10px] text-neutral-500">{event.date.split(" ")[0]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-neutral-700">{event.title}</h3>
                  <p className="text-xs text-neutral-500">{event.group} · {event.time}</p>
                  <p className="text-xs text-neutral-400">{event.attendees} going</p>
                </div>
                <button className="shrink-0 rounded-full bg-brand-secondary-500 px-3 py-1.5 text-xs font-medium text-white">
                  Going
                </button>
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
            { icon: "👥", label: "Connect", href: "/community", active: true },
            { icon: "💬", label: "Messages", href: "/messages", active: false },
            { icon: "👤", label: "Profile", href: "/profile", active: false },
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