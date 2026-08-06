/**
 * Global Mobilis — Shared translation configuration & helpers.
 *
 * Used by the /api/translate route (server), the messaging chat UI and the
 * standalone /translate tool. Keeps language support in one place.
 */

export interface TranslateLang {
  code: string;
  label: string;
  name: string;
}

export const SUPPORTED_LANGS: TranslateLang[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "es", label: "ES", name: "Spanish" },
  { code: "fr", label: "FR", name: "French" },
  { code: "de", label: "DE", name: "German" },
  { code: "pt", label: "PT", name: "Portuguese" },
  { code: "it", label: "IT", name: "Italian" },
  { code: "nl", label: "NL", name: "Dutch" },
  { code: "ar", label: "AR", name: "Arabic" },
  { code: "zh-CN", label: "ZH", name: "Chinese (Simplified)" },
  { code: "ja", label: "JA", name: "Japanese" },
  { code: "ko", label: "KO", name: "Korean" },
  { code: "hi", label: "HI", name: "Hindi" },
  { code: "ru", label: "RU", name: "Russian" },
  { code: "tr", label: "TR", name: "Turkish" },
  { code: "pl", label: "PL", name: "Polish" },
  { code: "sv", label: "SV", name: "Swedish" },
  { code: "da", label: "DA", name: "Danish" },
  { code: "fi", label: "FI", name: "Finnish" },
  { code: "no", label: "NO", name: "Norwegian" },
  { code: "cs", label: "CS", name: "Czech" },
  { code: "el", label: "EL", name: "Greek" },
  { code: "he", label: "HE", name: "Hebrew" },
  { code: "hu", label: "HU", name: "Hungarian" },
  { code: "id", label: "ID", name: "Indonesian" },
  { code: "ro", label: "RO", name: "Romanian" },
  { code: "th", label: "TH", name: "Thai" },
  { code: "uk", label: "UK", name: "Ukrainian" },
  { code: "vi", label: "VI", name: "Vietnamese" },
];

export const SUPPORTED_LANG_CODES = new Set(SUPPORTED_LANGS.map((l) => l.code));

/** localStorage key for the user's preferred translation target language. */
export const LANG_STORAGE_KEY = "gm_translate_lang";

/** Human-readable name for a language code (falls back to the raw code). */
export function langName(code: string): string {
  const base = code.toLowerCase().split("-")[0];
  const hit = SUPPORTED_LANGS.find(
    (l) => l.code.toLowerCase() === code.toLowerCase() || l.code.toLowerCase().startsWith(base),
  );
  return hit?.name ?? code;
}

/** Pick the user's browser language if we support it, otherwise English. */
export function detectDefaultLang(): string {
  try {
    const navLang = (typeof navigator !== "undefined" && navigator.language) || "";
    const base = navLang.split("-")[0].toLowerCase();
    const hit = SUPPORTED_LANGS.find((l) => l.code.toLowerCase().startsWith(base));
    if (hit) return hit.code;
  } catch {
    /* ignore */
  }
  return "en";
}

/** Read the stored preference, falling back to the browser language. */
export function readStoredLang(): string {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored && SUPPORTED_LANG_CODES.has(stored)) return stored;
  } catch {
    /* ignore */
  }
  return detectDefaultLang();
}
