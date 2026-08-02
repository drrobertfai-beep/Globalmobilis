import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listConversations, type ConversationView } from "~/lib/messages";

export const Route = createFileRoute("/messages/")({
  component: MessagesPage,
});

function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationView[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const result = (await listConversations()) as unknown as ConversationView[];
    setConversations(result);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, []);

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
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-neutral-100" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 p-8 text-center">
            <span className="text-3xl">💬</span>
            <p className="text-sm text-neutral-500">
              {conversations.length === 0 && !loading
                ? "Sign in to message expats, or start a conversation from the Community page."
                : "No conversations yet."}
            </p>
            <Link
              to="/login"
              className="mt-1 rounded-full bg-brand-primary-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-primary-500"
            >
              Sign in
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                to="/messages/$id"
                params={{ id: conv.id }}
                className="flex cursor-pointer items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-neutral-50"
              >
                <div className="relative shrink-0">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white ${conv.participantColor}`}>
                    {conv.participantAvatar}
                  </div>
                  {conv.participantOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-neutral-700">{conv.participantName}</h3>
                    <span className="text-[10px] text-neutral-500">{conv.lastTime}</span>
                  </div>
                  <p className={`truncate text-sm ${conv.unreadCount > 0 ? "font-medium text-neutral-700" : "text-neutral-500"}`}>
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-coral-500 text-[10px] font-bold text-white">
                    {conv.unreadCount}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white">
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
