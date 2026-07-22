/**
 * Global Mobilis — Auth Library
 *
 * Cookie-based JWT authentication using jose + bcryptjs.
 * Works with or without a database (graceful fallback to file storage).
 */
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { stringifyCookie, parseCookie } from "cookie";
import { createServerFn } from "@tanstack/react-start";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// =============================================================================
// Configuration
// =============================================================================

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "gm-dev-secret-change-in-production",
);

const JWT_ISSUER = "global-mobilis";
const JWT_AUDIENCE = "global-mobilis-web";
export const SESSION_COOKIE = "gm_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// =============================================================================
// Types
// =============================================================================

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  subscriptionTier: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  session?: AuthSession;
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  subscriptionTier: string;
  createdAt: string;
}

// =============================================================================
// File-based user storage (fallback when no DB)
// =============================================================================

const USERS_FILE = join(process.cwd(), ".run", "users.json");

function getUsers(): StoredUser[] {
  try {
    if (existsSync(USERS_FILE)) {
      return JSON.parse(readFileSync(USERS_FILE, "utf-8"));
    }
  } catch {}
  return [];
}

function saveUsers(users: StoredUser[]): void {
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

let userIdCounter = Date.now();
function generateId(): string {
  return `user_${++userIdCounter}`;
}

// =============================================================================
// Password Hashing
// =============================================================================

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// =============================================================================
// JWT Token Management
// =============================================================================

export async function createSessionToken(session: AuthSession): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(JWT_SECRET);
}

export async function verifySessionToken(
  token: string,
): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    return payload as unknown as AuthSession;
  } catch {
    return null;
  }
}

// =============================================================================
// Cookie Management
// =============================================================================

export function createSessionCookie(token: string): string {
  return stringifyCookie({ [SESSION_COOKIE]: token }, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSessionCookie(): string {
  return stringifyCookie({ [SESSION_COOKIE]: "" }, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  return parseCookie(cookieHeader) as Record<string, string>;
}

// =============================================================================
// Sign Up
// =============================================================================

export const signUp = createServerFn({ method: "POST" }).handler(
  async (data: unknown) => {
    const { email, password, name } = data as {
      email: string;
      password: string;
      name: string;
    };

    if (!email || !password || !name) {
      return { success: false, error: "All fields are required" };
    }

    if (password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters" };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: "Invalid email address" };
    }

    try {
      // Try database first
      if (process.env.DATABASE_URL) {
        const { neon } = await import("@neondatabase/serverless");
        const sql = neon(process.env.DATABASE_URL);
        const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()}`;
        if (existing.length > 0) {
          return { success: false, error: "An account with this email already exists" };
        }
        const passwordHash = await hashPassword(password);
        const result = await sql`
          INSERT INTO users (name, email, password_hash, subscription_tier)
          VALUES (${name}, ${email.toLowerCase()}, ${passwordHash}, 'free')
          RETURNING id, name, email, subscription_tier
        `;
        const user = result[0] as any;
        const session: AuthSession = {
          userId: user.id,
          email: user.email,
          name: user.name,
          subscriptionTier: user.subscription_tier,
        };
        const token = await createSessionToken(session);
        return { success: true, session, cookie: createSessionCookie(token) };
      }

      // Fallback: file-based storage
      const users = getUsers();
      if (users.some((u) => u.email === email.toLowerCase())) {
        return { success: false, error: "An account with this email already exists" };
      }

      const passwordHash = await hashPassword(password);
      const newUser: StoredUser = {
        id: generateId(),
        name,
        email: email.toLowerCase(),
        passwordHash,
        subscriptionTier: "free",
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      saveUsers(users);

      const session: AuthSession = {
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        subscriptionTier: newUser.subscriptionTier,
      };
      const token = await createSessionToken(session);
      return { success: true, session, cookie: createSessionCookie(token) };
    } catch (err) {
      console.error("Signup error:", err);
      return { success: false, error: "Something went wrong. Please try again." };
    }
  },
);

// =============================================================================
// Log In
// =============================================================================

export const logIn = createServerFn({ method: "POST" }).handler(
  async (data: unknown) => {
    const { email, password } = data as { email: string; password: string };

    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    try {
      // Try database first
      if (process.env.DATABASE_URL) {
        const { neon } = await import("@neondatabase/serverless");
        const sql = neon(process.env.DATABASE_URL);
        const result = await sql`
          SELECT id, name, email, password_hash, subscription_tier
          FROM users WHERE email = ${email.toLowerCase()}
        `;
        const user = result[0] as any;
        if (!user) {
          return { success: false, error: "Invalid email or password" };
        }
        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) {
          return { success: false, error: "Invalid email or password" };
        }
        const session: AuthSession = {
          userId: user.id,
          email: user.email,
          name: user.name,
          subscriptionTier: user.subscription_tier,
        };
        const token = await createSessionToken(session);
        return { success: true, session, cookie: createSessionCookie(token) };
      }

      // Fallback: file-based storage
      const users = getUsers();
      const user = users.find((u) => u.email === email.toLowerCase());
      if (!user) {
        return { success: false, error: "Invalid email or password" };
      }
      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) {
        return { success: false, error: "Invalid email or password" };
      }
      const session: AuthSession = {
        userId: user.id,
        email: user.email,
        name: user.name,
        subscriptionTier: user.subscriptionTier,
      };
      const token = await createSessionToken(session);
      return { success: true, session, cookie: createSessionCookie(token) };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: "Something went wrong. Please try again." };
    }
  },
);

// =============================================================================
// Log Out
// =============================================================================

export const logOut = createServerFn({ method: "POST" }).handler(async () => {
  return { cookie: clearSessionCookie() };
});

// =============================================================================
// Password Reset
// =============================================================================

const resetTokens = new Map<string, { email: string; expiresAt: number }>();

const RESET_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

function generateResetToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 48; i++) token += chars.charAt(Math.floor(Math.random() * chars.length));
  return token;
}

export const requestPasswordReset = createServerFn({ method: "POST" }).handler(
  async (data: unknown) => {
    const { email } = data as { email: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    try {
      // Check if user exists
      let userExists = false;
      if (process.env.DATABASE_URL) {
        const { neon } = await import("@neondatabase/serverless");
        const sql = neon(process.env.DATABASE_URL);
        const rows = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()}`;
        userExists = rows.length > 0;
      } else {
        const users = getUsers();
        userExists = users.some((u) => u.email === email.toLowerCase());
      }

      // Generate token even if user doesn't exist (prevents email enumeration)
      const token = generateResetToken();
      resetTokens.set(token, {
        email: email.toLowerCase(),
        expiresAt: Date.now() + RESET_TOKEN_EXPIRY,
      });

      // Clean expired tokens
      for (const [key, val] of resetTokens) {
        if (val.expiresAt < Date.now()) resetTokens.delete(key);
      }

      if (!userExists) {
        // Return success anyway to not leak user existence
        return { success: true, message: "If an account exists with that email, a reset link has been sent." };
      }

      // In production, send an email. For now, return the token (dev only).
      const resetLink = `${process.env.APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;
      console.log(`[Password Reset] Link for ${email}: ${resetLink}`);

      return {
        success: true,
        message: "If an account exists with that email, a reset link has been sent.",
        // Only include in dev mode
        ...(process.env.NODE_ENV !== "production" ? { devToken: token, devLink: resetLink } : {}),
      };
    } catch (err) {
      console.error("Password reset request error:", err);
      return { success: false, error: "Something went wrong. Please try again." };
    }
  },
);

export const resetPassword = createServerFn({ method: "POST" }).handler(
  async (data: unknown) => {
    const { token, newPassword } = data as { token: string; newPassword: string };

    if (!token || !newPassword) {
      return { success: false, error: "Token and new password are required" };
    }

    if (newPassword.length < 8) {
      return { success: false, error: "Password must be at least 8 characters" };
    }

    try {
      const stored = resetTokens.get(token);
      if (!stored || stored.expiresAt < Date.now()) {
        resetTokens.delete(token);
        return { success: false, error: "This reset link has expired. Please request a new one." };
      }

      const passwordHash = await hashPassword(newPassword);

      if (process.env.DATABASE_URL) {
        const { neon } = await import("@neondatabase/serverless");
        const sql = neon(process.env.DATABASE_URL);
        await sql`UPDATE users SET password_hash = ${passwordHash} WHERE email = ${stored.email}`;
      } else {
        const users = getUsers();
        const idx = users.findIndex((u) => u.email === stored.email);
        if (idx >= 0) {
          users[idx].passwordHash = passwordHash;
          saveUsers(users);
        }
      }

      resetTokens.delete(token);
      return { success: true, message: "Password has been reset. You can now log in." };
    } catch (err) {
      console.error("Password reset error:", err);
      return { success: false, error: "Something went wrong. Please try again." };
    }
  },
);