import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/messages/$id")({
  component: ChatThreadPage,
});

const chats: Record<string, { name: string; avatar: string; color: string; online: boolean }> = {
  "maria-santos": { name: "Maria Santos", avatar: "MS", color: "bg-brand-coral-500", online: true },
  "james-wilson": { name: "James Wilson", avatar: "JW", color: "bg-brand-secondary-500", online: false },
  "yuki-tanaka": { name: "Yuki Tanaka", avatar: "YT", color: "bg-brand-gold-500", online: true },
  "new": { name: "New Conversation", avatar: "💬", color: "bg-brand-primary-500", online: false },
};

const sampleMessages = [
  { type: "in", text: "Hey! I saw you're in Berlin too. How are you settling in?", time: "10:32 AM" },
  { type: "out", text: "It's been amazing so far! The city is so vibrant. Already found a great apartment in Neukölln.", time: "10:35 AM" },
  { type: "in", text: "Oh nice! Neukölln is a great area. I've been in Prenzlauer Berg for about 6 months now. Let me know if you want any tips!", time: "10:38 AM" },
  { type: "out", text: "That would be great! Actually, I'm looking for some good coworking spaces. Any recommendations?", time: "10:40 AM" },
  { type: "in", text: "Definitely! There's a great one called Betahaus near Moritzplatz. Also Factory Berlin if you want something more premium.", time: "10:42 AM" },
  { type: "translation", original: "Também recomendo o acompanhamento do visto — fiz tudo online e foi super tranquilo.", translated: "I also recommend the visa tracking — did everything online and it was super smooth.", time: "10:45 AM" },
  { type: "out", text: "Perfect, thanks! I'll check those out. The visa process was actually pretty smooth for me.", time: "10:48 AM" },
  { type: "in", text: "Same here! The German system is surprisingly efficient once you get the hang of it. Want to grab a coffee this weekend? ☕", time: "10:50 AM" },
];

function ChatThreadPage() {
  const { id } = Route.useParams();
  const chat = chats[id];
  const [input, setInput] = useState("");

  if (!chat) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-neutral-700">Chat not found</h1>
          <Link to="/messages" className="text-brand-primary-500 hover:underline">Back to messages</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-[var(--gm-bg)]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3">
        <Link to="/messages" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-100">
          <svg className="h-5 w-5 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="relative">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${chat.color}`}>
            {chat.avatar}
          </div>
          {chat.online && (
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-neutral-700">{chat.name}</h2>
          <p className="text-xs text-green-500">{chat.online ? "Online" : "Offline"}</p>
        </div>
        <div className="flex gap-1">
          <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-100">
            <svg className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5.25h18M3 12h18m-7 6.75h7" />
            </svg>
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-100">
            <svg className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat thread */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-2xl space-y-4">
          {/* Date separator */}
          <div className="text-center">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] text-neutral-500">Today</span>
          </div>

          {sampleMessages.map((msg, i) => (
            <div key={i}>
              {msg.type === "translation" ? (
                <div className="mx-auto max-w-xs">
                  <div className="chat-bubble-in">
                    <p className="text-xs italic text-neutral-500">🔄 Translated from Portuguese</p>
                    <p className="mt-1">{msg.translated}</p>
                  </div>
                  <div className="mt-1 flex justify-center">
                    <span className="rounded-full bg-brand-gold-100 px-2 py-0.5 text-[10px] text-brand-gold-700">
                      View original
                    </span>
                  </div>
                  <p className="mt-1 text-center text-[10px] text-neutral-400">{msg.time}</p>
                </div>
              ) : msg.type === "out" ? (
                <div className="flex justify-end">
                  <div className="max-w-xs">
                    <div className="chat-bubble-out">{msg.text}</div>
                    <p className="mt-1 text-right text-[10px] text-neutral-400">{msg.time}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="max-w-xs">
                    <div className="chat-bubble-in">{msg.text}</div>
                    <p className="mt-1 text-left text-[10px] text-neutral-400">{msg.time}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-300" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-300" style={{ animationDelay: "0.1s" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-300" style={{ animationDelay: "0.2s" }} />
            </div>
            {chat.name} is typing...
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-neutral-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-neutral-100">
            <svg className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 0119.5 7.372L8.552 18.32a.75.75 0 01-1.063 0l-1.59-1.59a.75.75 0 010-1.063l10.94-10.94" />
            </svg>
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write a message..."
              className="input pr-12 text-sm"
            />
            <button className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white" style={{ background: input ? "var(--gm-gradient-brand)" : "var(--gm-border)" }}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}