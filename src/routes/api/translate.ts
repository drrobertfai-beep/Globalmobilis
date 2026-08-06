import { createFileRoute } from "@tanstack/react-router";
import { SUPPORTED_LANG_CODES } from "~/lib/translate";

/**
 * POST /api/translate
 * Translates text into a supported target language using the free MyMemory
 * translation API (no key required). MyMemory auto-detects the source language.
 * Returns { translatedText, detectedLang }.
 *
 * Body: { text: string, targetLang: string }
 *
 * Handles three things the raw MyMemory API doesn't:
 *  - Long text: MyMemory's free GET endpoint caps a single query at 500 chars,
 *    so text is split into chunks (at sentence boundaries) and translated
 *    sequentially before being joined.
 *  - Error payloads: MyMemory returns HTTP 200 with an error string inside
 *    `translatedText` for quota/length problems — those are turned into real
 *    JSON errors instead of "successful" garbage translations.
 *  - HTML entities: MyMemory escapes quotes/apostrophes (&quot;, &#39;) which
 *    are decoded before returning.
 */
const MAX_TEXT_LENGTH = 5000;
const MAX_CHUNK_CHARS = 450; // safely under MyMemory's 500-char query limit
const KNOWN_ERROR_PATTERNS = /^(QUERY LENGTH|MYMEMORY WARNING|INVALID|NO QUERY|NOT AVAILABLE)/i;

function splitChunks(text: string): string[] {
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > MAX_CHUNK_CHARS) {
    const slice = remaining.slice(0, MAX_CHUNK_CHARS);
    // Cut at the last sentence boundary (., !, ?, ;, newline) if one exists.
    const boundary = Math.max(
      slice.lastIndexOf(". "),
      slice.lastIndexOf("! "),
      slice.lastIndexOf("? "),
      slice.lastIndexOf("; "),
      slice.lastIndexOf("\n"),
    );
    const cut = boundary > MAX_CHUNK_CHARS * 0.4 ? boundary + 1 : MAX_CHUNK_CHARS;
    chunks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

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
        if (text.length > MAX_TEXT_LENGTH) {
          return json({ error: `Text too long (max ${MAX_TEXT_LENGTH} characters)` }, 400);
        }
        if (!SUPPORTED_LANG_CODES.has(targetLang)) {
          return json({ error: "Unsupported target language" }, 400);
        }

        const chunks = splitChunks(text);
        const translatedChunks: string[] = [];
        let detectedLang = "auto";
        try {
          for (const chunk of chunks) {
            const url =
              "https://api.mymemory.translated.net/get?q=" +
              encodeURIComponent(chunk) +
              "&langpair=autodetect|" +
              encodeURIComponent(targetLang);
            const res = await fetch(url, { signal: AbortSignal.timeout(12_000) });
            if (!res.ok) return json({ error: "Translation service unavailable" }, 502);
            const data = (await res.json()) as {
              responseStatus?: number;
              responseData?: { translatedText?: string; detectedLanguage?: string };
            };
            const status = typeof data.responseStatus === "number" ? data.responseStatus : 200;
            const raw = data?.responseData?.translatedText ?? "";
            // MyMemory reports errors as HTTP 200 + status != 200 or an error string.
            if (status !== 200 || !raw || KNOWN_ERROR_PATTERNS.test(raw.trim())) {
              return json({ error: "Translation failed — free daily quota may be exhausted. Try again later." }, 502);
            }
            translatedChunks.push(decodeEntities(raw));
            if (data?.responseData?.detectedLanguage) detectedLang = data.responseData.detectedLanguage;
          }
        } catch {
          return json({ error: "Translation service unavailable" }, 502);
        }

        return json({ translatedText: translatedChunks.join(" "), detectedLang });
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
