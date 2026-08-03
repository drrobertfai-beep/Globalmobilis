import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  getMessages,
  sendMessage,
  type MessageView,
  type ThreadView,
} from "~/lib/messages";

export const Route = createFileRoute("/messages/$id")({
  component: MessageThreadPage,
});

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function MessageThreadPage() {
  const { id } = useParams({ from: "/messages/$id" });
  const [thread, setThread] = useState<ThreadView | null>(null);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const result = (await getMessages({ conversationId: id })) as unknown;
    if (result && typeof result === "object" && "error" in result) {
      setError((result as { error: string }).error);
      return;
    }
    setThread(result as ThreadView);
    setError("");
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 4000); // simple polling for "real-time" feel
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const fd = new FormData();
      fd.set("conversationId", id);
      fd.set("text", input);
      const result = (await sendMessage(fd)) as any;
      if (result.success && result.message) {
        setThread((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, result.message as MessageView],
              }
            : prev,
        );
        setInput("");
      } else {
        setError(result.error || "Could not send message.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (error && !thread) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md items-center px-4 py-16">
        <div className="card w-full p-8 text-center">
          <p className="mb-3 text-sm text-neutral-500">{error}</p>
          <Link to="/messages" className="text-sm font-medium text-brand-primary-700 hover:underline">
            Back to messages
          </Link>
        </div>
      </div>
    );
  }

  const chat = thread?.conversation;

  return (
    <div className="flex h-screen flex-col">
      {/* Chat header */}
      <div className="border-b border-neutral-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Link to="/messages" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-100" aria-label="Back">
            <svg className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="relative shrink-0">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${chat?.participantColor || "bg-neutral-300"}`}>
              {chat?.participantAvatar || "?"}
            </div>
            {chat?.participantOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-neutral-700">{chat?.participantName || "..."}</h2>
            <p className="text-xs text-green-500">{chat?.participantOnline ? "Online" : "Offline"}</p>
          </div>
        </div>
      </div>

      {/* Chat thread */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="text-center">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] text-neutral-500">Today</span>
          </div>
          {(thread?.messages ?? []).map((msg) => (
            <div key={msg.id}>
              {msg.isMine ? (
                <div className="flex justify-end">
                  <div className="max-w-xs">
                    <div className="chat-bubble-out">{msg.text}</div>
                    <p className="mt-1 text-right text-[10px] text-neutral-400">{formatTime(msg.timestamp)}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="max-w-xs">
                    <div className="chat-bubble-in">{msg.text}</div>
                    <p className="mt-1 text-left text-[10px] text-neutral-400">{formatTime(msg.timestamp)}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          {thread && thread.messages.length === 0 && (
            <p className="pt-8 text-center text-sm text-neutral-400">
              No messages yet — say hi to {chat?.participantName}! 👋
            </p>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-neutral-200 bg-white px-4 py-3">
        <form onSubmit={handleSend} className="mx-auto flex max-w-2xl items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write a message..."
              className="input pr-12 text-sm"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-40"
              style={{ background: "var(--gm-gradient-brand)" }}
              aria-label="Send"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
