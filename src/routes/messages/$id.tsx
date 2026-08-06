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

// =============================================================================
// On-demand translation (client side, cached per message + target language)
// =============================================================================
const TRANSLATE_LANGS = [
  { code: "en", label: "EN", name: "English" },
  { code: "es", label: "ES", name: "Spanish" },
  { code: "fr", label: "FR", name: "French" },
  { code: "de", label: "DE", name: "German" },
  { code: "pt", label: "PT", name: "Portuguese" },
  { code: "ar", label: "AR", name: "Arabic" },
  { code: "zh-CN", label: "ZH", name: "Chinese" },
  { code: "ja", label: "JA", name: "Japanese" },
];
const LANG_STORAGE_KEY = "gm_translate_lang";

function langName(code: string): string {
  const base = code.toLowerCase().split("-")[0];
  const hit = TRANSLATE_LANGS.find(
    (l) =>
      l.code.toLowerCase() === code.toLowerCase() ||
      l.code.toLowerCase().startsWith(base),
  );
  return hit?.name ?? code;
}

function detectDefaultLang(): string {
  try {
    const navLang = (typeof navigator !== "undefined" && navigator.language) || "";
    const base = navLang.split("-")[0].toLowerCase();
    const hit = TRANSLATE_LANGS.find((l) => l.code.toLowerCase().startsWith(base));
    if (hit) return hit.code;
  } catch {
    /* ignore */
  }
  return "en";
}

function readStoredLang(): string {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored && TRANSLATE_LANGS.some((l) => l.code === stored)) return stored;
  } catch {
    /* ignore */
  }
  return detectDefaultLang();
}

interface TranslationEntry {
  translatedText: string;
  detectedLang: string;
}

/** Simple module-level cache so the same message+language is never refetched. */
const translationCache = new Map<string, TranslationEntry>();

function TranslatableMessage({ text, targetLang }: { text: string; targetLang: string }) {
  const [translation, setTranslation] = useState<TranslationEntry | null>(() => {
    try {
      return translationCache.get(`${text}::${targetLang}`) ?? null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showTranslated, setShowTranslated] = useState(false);

  const translate = async () => {
    if (loading || translation) return;
    const cacheKey = `${text}::${targetLang}`;
    const cached = translationCache.get(cacheKey);
    if (cached) {
      setTranslation(cached);
      setShowTranslated(true);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, targetLang }),
      });
      const data = (await res.json().catch(() => null)) as {
        translatedText?: string;
        detectedLang?: string;
      } | null;
      if (res.ok && data?.translatedText) {
        const entry = {
          translatedText: data.translatedText,
          detectedLang: data.detectedLang || "auto",
        };
        translationCache.set(cacheKey, entry);
        setTranslation(entry);
        setShowTranslated(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>{text}</div>
      <div className="mt-0.5 flex items-center justify-end gap-2 opacity-60 transition-opacity hover:opacity-100">
        {loading ? (
          <span className="flex items-center gap-1 text-[10px] italic text-neutral-400">
            <span className="h-2.5 w-2.5 animate-spin rounded-full border border-neutral-400 border-t-transparent" />
            Translating…
          </span>
        ) : translation && showTranslated ? (
          <button
            type="button"
            onClick={() => setShowTranslated(false)}
            className="rounded px-1 py-0.5 text-[10px] font-medium text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
          >
            Show original
          </button>
        ) : (
          <button
            type="button"
            onClick={translate}
            disabled={loading}
            title={`Translate to ${langName(targetLang)}`}
            aria-label="Translate message"
            className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] hover:bg-neutral-100"
          >
            🌐
          </button>
        )}
      </div>
      {error && !translation && (
        <p className="mt-0.5 text-right text-[10px] italic text-red-400">
          Translation unavailable
        </p>
      )}
      {translation && showTranslated && (
        <div className="mt-1 border-t border-neutral-200/70 pt-1">
          <p className="text-xs italic leading-relaxed text-neutral-500">
            {translation.translatedText}
          </p>
          <p className="mt-0.5 text-[10px] text-neutral-400">
            Translated to {langName(targetLang)}
            {translation.detectedLang !== "auto" &&
              ` from ${langName(translation.detectedLang)}`}
          </p>
        </div>
      )}
    </div>
  );
}

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
  const [targetLang, setTargetLang] = useState("en");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load the stored/browser-detected language after hydration (avoids SSR mismatch).
  useEffect(() => {
    setTargetLang(readStoredLang());
  }, []);

  const handleLangChange = (code: string) => {
    setTargetLang(code);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  };

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
      const result = (await sendMessage({ data: fd })) as any;
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
          <label className="relative shrink-0">
            <span className="sr-only">Translation language</span>
            <select
              value={targetLang}
              onChange={(e) => handleLangChange(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white py-1.5 pl-2 pr-7 text-xs font-medium text-neutral-600 outline-none transition-colors hover:border-neutral-300 focus:border-brand-primary-500"
            >
              {TRANSLATE_LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label} · {l.name}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </label>
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
                    <div className="chat-bubble-out">
                      <TranslatableMessage
                        key={`${msg.id}-${targetLang}`}
                        text={msg.text}
                        targetLang={targetLang}
                      />
                    </div>
                    <p className="mt-1 text-right text-[10px] text-neutral-400">{formatTime(msg.timestamp)}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="max-w-xs">
                    <div className="chat-bubble-in">
                      <TranslatableMessage
                        key={`${msg.id}-${targetLang}`}
                        text={msg.text}
                        targetLang={targetLang}
                      />
                    </div>
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
