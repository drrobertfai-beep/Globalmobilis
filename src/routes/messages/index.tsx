import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/messages/")({
  component: MessagesPage,
});

const messages = [
  { name: "Maria Santos", avatar: "MS", lastMsg: "I just arrived in Berlin! Would love to grab a coffee ☕", time: "2m ago", online: true, unread: true, color: "bg-brand-coral-500" },
  { name: "James Wilson", avatar: "JW", lastMsg: "The visa process was actually pretty smooth", time: "1h ago", online: false, unread: false, color: "bg-brand-secondary-500" },
  { name: "Yuki Tanaka", avatar: "YT", lastMsg: "Have you looked into the D7 visa?", time: "3h ago", online: true, unread: false, color: "bg-brand-gold-500" },
  { name: "Toronto Tech Group", avatar: "TT", lastMsg: "New meetup announced for next Friday!", time: "5h ago", online: false, unread: true, color: "bg-brand-primary-500" },
  { name: "Elena Petrova", avatar: "EP", lastMsg: "The apartment hunt in Lisbon is intense 😅", time: "1d ago", online: false, unread: false, color: "bg-brand-coral-700" },
];

function MessagesPage() {
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white px-4 pb-2 pt-6 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-neutral-700">Messages</h1>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary-50 text-brand-primary-700">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div className="space-y-1">
          {messages.map((msg) => (
            <div
              key={msg.name}
              className="flex cursor-pointer items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-neutral-50"
            >
              <div className="relative shrink-0">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white ${msg.color}`}>
                  {msg.avatar}
                </div>
                {msg.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-700">{msg.name}</h3>
                  <span className="text-[10px] text-neutral-500">{msg.time}</span>
                </div>
                <p className={`truncate text-sm ${msg.unread ? "font-medium text-neutral-700" : "text-neutral-500"}`}>
                  {msg.lastMsg}
                </p>
              </div>
              {msg.unread && (
                <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-coral-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          {[
            { icon: "🏠", label: "Home", href: "/dashboard", active: false },
            { icon: "🔍", label: "Explore", href: "/destinations", active: false },
            { icon: "👥", label: "Connect", href: "/community", active: false },
            { icon: "💬", label: "Messages", href: "/messages", active: true },
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