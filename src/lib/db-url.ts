/**
 * Global Mobilis — Database URL normalization
 *
 * `DATABASE_URL` is read straight from the environment, and it frequently
 * arrives with accidental decoration that breaks the Neon driver's URL parser
 * (`new URL()` throws → handlers return "Something went wrong"):
 *
 *   - surrounding quotes from `.env` values that kept them when sourced
 *     (e.g. `export $(cat .env)` or `vercel deploy -e` with a quoted value)
 *   - surrounding whitespace from paste/copy artefacts
 *
 * `neon()` validates the URL string before connecting, so stripping the
 * decoration here makes the whole app robust to how the env var was injected.
 */
export function normalizeDbUrl(raw: string | undefined | null): string {
  if (!raw) return "";
  return raw.trim().replace(/^["']+|["']+$/g, "");
}
