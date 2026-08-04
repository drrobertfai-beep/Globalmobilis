import { createFileRoute } from "@tanstack/react-router";

/**
 * POST /api/translate
 * Translates a message into the user's preferred language using the free
 * MyMemory translation API (no key required). MyMemory auto-detects the
 * source language. Returns { translatedText, detectedLang }.
 *
 * Body: { text: string, targetLang: string }
 */
const MAX_TEXT_LENGTH = 5000;
const SUPPORTED_LANGS = new Set(["en", "es", "fr", "de", "pt", "ar", "zh-CN", "ja"]);

export const Route = createFileRoute("/api/translate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ error: "Invalid request" }, 400);
        }
        const b = (body ?? {}) as { text?: unknown; targetLang?: unknown };
        const text = typeof b.text === "string" ? b.text.trim() : "";
        const targetLang = typeof b.targetLang === "string" ? b.targetLang.toLowerCase() : "";

        if (!text) return json({ error: "Text is required" }, 400);
        if (text.length > MAX_TEXT_LENGTH) return json({ error: "Text too long" }, 400);
        if (!SUPPORTED_LANGS.has(targetLang)) {
          return json({ error: "Unsupported target language" }, 400);
        }

        try {
          const url =
            "https://api.mymemory.translated.net/get?q=" +
            encodeURIComponent(text) +
            "&langpair=autodetect|" +
            encodeURIComponent(targetLang);
          const res = await fetch(url, { signal: AbortSignal.timeout(12_000) });
          if (!res.ok) return json({ error: "Translation service unavailable" }, 502);
          const data = (await res.json()) as {
            responseData?: { translatedText?: string; detectedLanguage?: string };
          };
          const translatedText = data?.responseData?.translatedText;
          if (typeof translatedText !== "string" || translatedText.length === 0) {
            return json({ error: "Translation failed" }, 502);
          }
          const detectedLang = data?.responseData?.detectedLanguage || "auto";
          return json({ translatedText, detectedLang });
        } catch {
          return json({ error: "Translation service unavailable" }, 502);
        }
      },
    },
  },
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
