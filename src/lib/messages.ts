/**
 * Global Mobilis — Messaging API
 *
 * Server functions for conversations and messages: list conversations,
 * get messages for a conversation, send a message. Persistence is a JSON
 * file under <project>/data/ (conversations.json). The current user is
 * identified from the session cookie (JWT issued by src/lib/auth.ts).
 */
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SESSION_COOKIE, verifySessionToken } from "./auth";
import type { AuthSession } from "./auth";

// =============================================================================
// Types
// =============================================================================

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string; // ISO
  read: boolean;
  /** On-demand translation (never persisted — computed at request time). */
  translatedText?: string;
  translatedLang?: string;
}

export interface Conversation {
  id: string;
  /** The other participant (the one who is not the current user) */
  participantName: string;
  participantAvatar: string;
  participantColor: string;
  participantOnline: boolean;
  messages: Message[];
}

export interface ConversationView {
  id: string;
  participantName: string;
  participantAvatar: string;
  participantColor: string;
  participantOnline: boolean;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
}

export interface MessageView {
  id: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMine: boolean;
  read: boolean;
  /** On-demand translation (never persisted — computed at request time). */
  translatedText?: string;
  translatedLang?: string;
}

export interface ThreadView {
  conversation: {
    id: string;
    participantName: string;
    participantAvatar: string;
    participantColor: string;
    participantOnline: boolean;
  };
  messages: MessageView[];
}

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: MessageView;
  conversation?: ConversationView;
}

// =============================================================================
// JSON file persistence
// =============================================================================

const DATA_DIR = join(process.cwd(), "data");
const CONVERSATIONS_FILE = join(DATA_DIR, "conversations.json");

function readConversations(): Conversation[] {
  try {
    if (existsSync(CONVERSATIONS_FILE)) {
      return JSON.parse(readFileSync(CONVERSATIONS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("messages: failed to read conversations.json", err);
  }
  return [];
}

function writeConversations(conversations: Conversation[]): void {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(CONVERSATIONS_FILE, JSON.stringify(conversations, null, 2));
}

// =============================================================================
// Helpers
// =============================================================================

let idCounter = 0;
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${++idCounter}`;
}

async function getCurrentUser(): Promise<AuthSession | null> {
  try {
    const token = getCookie(SESSION_COOKIE);
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
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

function toConversationView(conversation: Conversation, userId: string): ConversationView {
  const messages = conversation.messages;
  const last = messages[messages.length - 1];
  const unreadCount = messages.filter((m) => m.senderId !== userId && !m.read).length;
  return {
    id: conversation.id,
    participantName: conversation.participantName,
    participantAvatar: conversation.participantAvatar,
    participantColor: conversation.participantColor,
    participantOnline: conversation.participantOnline,
    lastMessage: last ? last.text : "No messages yet",
    lastTime: last ? formatTime(last.timestamp) : "",
    unreadCount,
  };
}

// =============================================================================
// Payload helpers
// =============================================================================

/** Coerce a FormData value to string (or undefined). */
function str(v: FormDataEntryValue | null): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}
/**
 * Extract string fields from a server-fn payload, tolerant of every shape the
 * framework can deliver: a raw FormData, `{ data: FormData, context, method }`,
 * `{ data: { ...fields } }`, or a bare `{ ...fields }` object. (POST args are
 * sent as FormData because this server build can't parse the seroval JSON
 * envelope the client's createServerFn serialization produces.)
 */
function getStrField(data: unknown, key: string): string | undefined {
  if (data instanceof FormData) return str(data.get(key));
  const obj = (data ?? {}) as Record<string, unknown>;
  const inner = obj.data;
  if (inner instanceof FormData) return str(inner.get(key));
  const src = (inner && typeof inner === "object" ? inner : obj) as Record<string, unknown>;
  return typeof src[key] === "string" ? (src[key] as string) : undefined;
}

// =============================================================================
// Server Functions
// =============================================================================

/** List the current user's conversations, newest activity first. */
export const listConversations = createServerFn({ method: "GET" }).handler(
  async (): Promise<ConversationView[]> => {
    const user = await getCurrentUser();
    if (!user) return [];
    return readConversations()
      .map((c) => toConversationView(c, user.userId))
      .sort((a, b) => (a.lastTime < b.lastTime ? 1 : -1));
  },
);

/** Get messages for a conversation; marks incoming messages as read. */
export const getMessages = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<ThreadView | { error: string }> => {
    const user = await getCurrentUser();
    if (!user) return { error: "You must be signed in to view messages." };

    // TanStack Start wraps a single non-FormData arg as { data: <arg> };
    // unwrap like sendMessage does (see getStrField in forums.ts).
    // Accept any RPC payload form (plain { conversationId }, { data: fd } with
    // FormData, etc.) via the same reader sendMessage uses.
    const conversationId = getStrField(data, "conversationId");
    if (!conversationId) return { error: "Conversation is required." };

    const conversations = readConversations();
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) return { error: "Conversation not found." };

    // Mark incoming messages as read
    let changed = false;
    for (const m of conversation.messages) {
      if (m.senderId !== user.userId && !m.read) {
        m.read = true;
        changed = true;
      }
    }
    if (changed) writeConversations(conversations);

    return {
      conversation: {
        id: conversation.id,
        participantName: conversation.participantName,
        participantAvatar: conversation.participantAvatar,
        participantColor: conversation.participantColor,
        participantOnline: conversation.participantOnline,
      },
      messages: conversation.messages.map((m) => ({
        id: m.id,
        senderName: m.senderId === user.userId ? user.name : conversation.participantName,
        text: m.text,
        timestamp: m.timestamp,
        isMine: m.senderId === user.userId,
        read: m.read,
      })),
    };
  },
);

/** Send a message as the current user. */
export const sendMessage = createServerFn({ method: "POST" }).handler(
  async (data: unknown): Promise<ActionResult> => {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "You must be signed in to send messages." };

    const conversationId = getStrField(data, "conversationId");
    const text = getStrField(data, "text");

    if (!conversationId) return { success: false, error: "Conversation is required." };
    if (!text || !text.trim()) return { success: false, error: "Message cannot be empty." };

    const conversations = readConversations();
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) return { success: false, error: "Conversation not found." };

    const message: Message = {
      id: generateId("m"),
      senderId: user.userId,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    conversation.messages.push(message);
    writeConversations(conversations);

    return {
      success: true,
      message: {
        id: message.id,
        senderName: user.name,
        text: message.text,
        timestamp: message.timestamp,
        isMine: true,
        read: false,
      },
      conversation: toConversationView(conversation, user.userId),
    };
  },
);
