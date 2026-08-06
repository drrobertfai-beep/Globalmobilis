/**
 * Global Mobilis — Transactional Email
 *
 * Sends welcome emails, password resets, and notifications.
 * Primary transport: Knock (https://knock.app) — POST /v1/notify, works from
 * Vercel serverless. Requires KNOCK_API_KEY (+ KNOCK_WORKFLOW_KEY, default
 * "global-mobilis-email"); the Knock workflow must contain an email channel
 * step that renders {{ data.subject }} / {{{ data.html }}} and has an SMTP
 * provider connected in the Knock dashboard.
 * Fallback transport: the team's cto.email inbox (api.ctomail.io).
 * Emails are also logged to data/email-log.json for audit.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const EMAIL_FROM = "Global Mobilis <global-mobilis-d5a8c0d0@ctomail.io>";
const DATA_DIR = join(process.cwd(), "data");
const EMAIL_LOG = join(DATA_DIR, "email-log.json");

// ── Helpers ─────────────────────────────────────────

function ensureDataDir() {
  mkdirSync(DATA_DIR, { recursive: true });
}

function logEmail(entry: Record<string, unknown>) {
  ensureDataDir();
  const log: unknown[] = existsSync(EMAIL_LOG)
    ? JSON.parse(readFileSync(EMAIL_LOG, "utf-8"))
    : [];
  log.push({ ...entry, sentAt: new Date().toISOString() });
  writeFileSync(EMAIL_LOG, JSON.stringify(log, null, 2));
}

// Knock — primary provider (works from Vercel serverless). See header comment.
async function sendViaKnock(to: string, subject: string, body: string): Promise<boolean> {
  const apiKey = process.env.KNOCK_API_KEY;
  if (!apiKey) {
    console.log("[Email] KNOCK_API_KEY not set — using fallback transport");
    return false;
  }
  const workflowKey = process.env.KNOCK_WORKFLOW_KEY || "global-mobilis-email";
  try {
    const res = await fetch("https://api.knock.app/v1/notify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: workflowKey,
        // Inline-identify the recipient so the email channel has an address.
        recipients: [{ id: `email:${to}`, email: to, name: to.split("@")[0] }],
        actor: "global-mobilis",
        data: { subject, html: body },
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[Email] Knock API returned ${res.status} for "${subject}" → ${to}: ${detail.slice(0, 300)}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[Email] Knock API request failed for "${subject}" → ${to}:`, err);
    return false;
  }
}
async function sendViaAPI(to: string, subject: string, body: string): Promise<boolean> {
  // Try Knock first; fall back to the legacy ctomail transport.
  if (await sendViaKnock(to, subject, body)) return true;
  try {
    const res = await fetch("https://api.ctomail.io/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to,
        subject,
        html: body,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[Email] API returned ${res.status} for "${subject}" → ${to}: ${detail.slice(0, 300)}`);
    }
    return res.ok;
  } catch (err) {
    console.error(`[Email] API request failed for "${subject}" → ${to}:`, err);
    return false;
  }
}

// ── Public API ──────────────────────────────────────

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const { to, subject, html } = options;

  // Try API first
  const sent = await sendViaAPI(to, subject, html);

  // Always log
  logEmail({ to, subject, sent });

  // Also console-log for dev visibility
  if (sent) {
    console.log(`[Email] ✓ Sent "${subject}" → ${to}`);
  } else {
    console.log(`[Email] ✗ Failed to send "${subject}" → ${to} (logged for retry)`);
  }

  return sent;
}

// ── Templates ───────────────────────────────────────

export function welcomeEmail(name: string): EmailOptions {
  return {
    to: "",
    subject: "Welcome to Global Mobilis! 🌍",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h1 style="color:#0E4F8B;margin:0 0 8px">Welcome, ${name}!</h1>
        <p style="color:#444;font-size:16px;line-height:1.6">
          You've joined <strong>Global Mobilis</strong> — your all-in-one platform for
          international migration and global networking.
        </p>
        <p style="color:#444;font-size:16px;line-height:1.6">
          Here's what you can do right now:
        </p>
        <ul style="color:#444;font-size:16px;line-height:1.8">
          <li>🌎 Explore 36 destinations worldwide</li>
          <li>👥 Join expat communities in your target city</li>
          <li>💬 Connect with fellow global citizens</li>
          <li>📊 Compare cost of living across cities</li>
        </ul>
        <a href="${process.env.APP_URL || "https://globalmobilis.com"}/destinations"
           style="display:inline-block;background:#0E4F8B;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:12px">
          Start Exploring
        </a>
        <p style="color:#888;font-size:14px;margin-top:24px">
          — The Global Mobilis Team
        </p>
      </div>
    `,
  };
}

export function passwordResetEmail(resetLink: string): EmailOptions {
  return {
    to: "",
    subject: "Reset your Global Mobilis password",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h1 style="color:#0E4F8B;margin:0 0 8px">Password Reset</h1>
        <p style="color:#444;font-size:16px;line-height:1.6">
          Someone (hopefully you) requested a password reset for your Global Mobilis account.
        </p>
        <a href="${resetLink}"
           style="display:inline-block;background:#0E4F8B;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;margin:12px 0">
          Reset Password
        </a>
        <p style="color:#888;font-size:14px">
          This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
        </p>
        <p style="color:#888;font-size:14px;margin-top:24px">
          — The Global Mobilis Team
        </p>
      </div>
    `,
  };
}
