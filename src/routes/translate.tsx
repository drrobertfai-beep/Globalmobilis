import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BottomNav } from "~/components/BottomNav";
import {
  LANG_STORAGE_KEY,
  langName,
  readStoredLang,
  SUPPORTED_LANGS,
} from "~/lib/translate";

export const Route = createFileRoute("/translate")({
  head: () => ({
    meta: [
      { title: "Real-Time Translation — Global Mobilis" },
      {
        name: "description",
        content:
          "Translate text instantly between 28 languages with automatic source detection. Free, no sign-up needed — plus built-in translation in every chat.",
      },
    ],
  }),
  component: TranslatePage,
});

const MAX_TEXT_LENGTH = 5000;

function TranslatePage() {
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState("en");
  const [result, setResult] = useState<{ translatedText: string; detectedLang: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Restore the stored/browser-detected language after hydration (avoids SSR mismatch).
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

  const translate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    setCopied(false);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: trimmed, targetLang }),
      });
      const data = (await res.json().catch(() => null)) as {
        translatedText?: string;
        detectedLang?: string;
        error?: string;
      } | null;
      if (res.ok && data?.translatedText) {
        setResult({
          translatedText: data.translatedText,
          detectedLang: data.detectedLang || "auto",
        });
      } else {
        setError(data?.error || "Translation failed. Please try again.");
      }
    } catch {
      setError("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <div className="mx-auto max-w-5xl px-4 pt-8">
        {/* Header */}
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-primary-500">
            🌐 Communication Tools
          </p>
          <h1 className="mt-1 text-2xl font-bold text-neutral-800">Real-Time Translation</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-500">
            Translate text instantly into 28 languages — no sign-up required. The source
            language is detected automatically, and the same engine powers every chat in
            Global Mobilis, so conversations across languages just work.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input card */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <form onSubmit={translate} className="space-y-4">
              <div>
                <label htmlFor="translate-text" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Text to translate
                </label>
                <textarea
                  id="translate-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                  maxLength={MAX_TEXT_LENGTH}
                  placeholder="Type or paste text in any language…"
                  className="w-full resize-y rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm leading-relaxed text-neutral-800 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand-primary-500 focus:bg-white"
                />
                <div className="mt-1 text-right text-[11px] text-neutral-400">
                  {text.length.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()} characters
                </div>
              </div>

              <div>
                <label htmlFor="translate-lang" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Translate to
                </label>
                <select
                  id="translate-lang"
                  value={targetLang}
                  onChange={(e) => handleLangChange(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-neutral-700 outline-none transition-colors hover:border-neutral-300 focus:border-brand-primary-500"
                >
                  {SUPPORTED_LANGS.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label} · {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={!text.trim() || loading}
                className="w-full rounded-xl bg-brand-primary-500 py-2.5 text-sm font-semibold text-white transition-opacity hover:bg-brand-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Translating…" : "🌐 Translate"}
              </button>
            </form>
          </section>

          {/* Output card */}
          <section className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-medium text-neutral-700">Translation</h2>
            {error && (
              <div className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
                <p className="mt-1 text-xs text-red-400">
                  The free translation service enforces a daily quota — if you hit it, try
                  again tomorrow.
                </p>
              </div>
            )}
            {result ? (
              <div className="mt-3 flex flex-1 flex-col">
                <p className="whitespace-pre-wrap rounded-xl bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-800">
                  {result.translatedText}
                </p>
                <p className="mt-2 text-xs text-neutral-400">
                  Translated to {langName(targetLang)}
                  {result.detectedLang !== "auto" && ` from ${langName(result.detectedLang)}`}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyResult}
                    className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-brand-primary-500 hover:text-brand-primary-500"
                  >
                    {copied ? "✓ Copied" : "Copy result"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/60 p-6 text-center">
                <span className="text-2xl">💬</span>
                <p className="mt-2 text-sm text-neutral-400">
                  {loading
                    ? "Translating…"
                    : "Your translation will appear here. The source language is detected automatically."}
                </p>
              </div>
            )}
          </section>
        </div>

        {/* How it works / feature notes */}
        <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-700">How translation works in Global Mobilis</h2>
          <ul className="mt-3 grid gap-3 text-sm text-neutral-600 sm:grid-cols-2">
            <li className="flex gap-2">
              <span>✨</span>
              <span>28 languages supported — from English, Spanish and Arabic to Japanese, Hindi and Ukrainian.</span>
            </li>
            <li className="flex gap-2">
              <span>🔍</span>
              <span>Source language is auto-detected, so you never have to pick where it came from.</span>
            </li>
            <li className="flex gap-2">
              <span>✉️</span>
              <span>
                Inside <Link to="/messages" className="font-medium text-brand-primary-500 underline-offset-2 hover:underline">Messages</Link>, every message has a 🌐 button — tap it to read any chat in your preferred language.
              </span>
            </li>
            <li className="flex gap-2">
              <span>💡</span>
              <span>Long text is translated in smart chunks, so paragraphs and full messages translate correctly.</span>
            </li>
          </ul>
        </section>

        <p className="mt-6 text-center text-xs text-gray-400">
          Translation is powered by a free language service with a daily quota — Premium unlocks
          enhanced translation with higher limits and priority support.
        </p>
      </div>
      <BottomNav currentTab="explore" />
    </div>
  );
}
