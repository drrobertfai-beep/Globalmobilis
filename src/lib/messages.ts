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
// Seed data (used when the JSON file is empty / missing)
// =============================================================================

const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: "c_ana",
    participantName: "Ana Silva",
    participantAvatar: "AS",
    participantColor: "bg-brand-coral-500",
    participantOnline: true,
    messages: [
      { id: "m_ana_1", senderId: "seed_ana", text: "Hey! I saw you're moving to Toronto too. I arrived last month! 🇨🇦", timestamp: "2026-08-01T14:02:00.000Z", read: true },
      { id: "m_ana_2", senderId: "seed_ana", text: "Happy to share my apartment-hunting experience if you need it.", timestamp: "2026-08-01T14:05:00.000Z", read: false },
      { id: "m_ana_3", senderId: "seed_ana", text: "There's a Toronto Tech Expats meetup next week — want to join?", timestamp: "2026-08-02T09:30:00.000Z", read: false },
    ],
  },
  {
    id: "c_marcus",
    participantName: "Marcus Chen",
    participantAvatar: "MC",
    participantColor: "bg-brand-primary-500",
    participantOnline: false,
    messages: [
      { id: "m_marcus_1", senderId: "seed_marcus", text: "Thanks for the referral on the Lisbon job board!", timestamp: "2026-07-31T18:12:00.000Z", read: true },
      { id: "m_marcus_2", senderId: "seed_marcus", text: "I got an interview next Wednesday 🎉", timestamp: "2026-07-31T18:15:00.000Z", read: true },
    ],
  },
  {
    id: "c_sarah",
    participantName: "Sarah Williams",
    participantAvatar: "SW",
    participantColor: "bg-brand-gold-500",
    participantOnline: true,
    messages: [
      { id: "m_sarah_1", senderId: "seed_sarah", text: "Did you decide between Berlin and Dublin yet?", timestamp: "2026-08-01T10:40:00.000Z", read: true },
      { id: "m_sarah_2", senderId: "seed_sarah", text: "Berlin is amazing for creatives — and much cheaper 😄", timestamp: "2026-08-01T10:42:00.000Z", read: true },
    ],
  },
  {
    id: "c_felix",
    participantName: "Felix Müller",
    participantAvatar: "FM",
    participantColor: "bg-brand-secondary-500",
    participantOnline: false,
    messages: [
      { id: "m_felix_1", senderId: "seed_felix", text: "The visa workshop in the Global Nomads group is this Friday at 6 PM!", timestamp: "2026-08-02T07:55:00.000Z", read: true },
    ],
  },
];

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
export const getMessages = createServerFn({ method: "GET" }).handler(
  async (data: unknown): Promise<ThreadView | { error: string }> => {
    const user = await getCurrentUser();
    if (!user) return { error: "You must be signed in to view messages." };

    const { conversationId } = (data || {}) as { conversationId?: string };
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

    const { conversationId, text } = (data || {}) as {
      conversationId?: string;
      text?: string;
    };

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
