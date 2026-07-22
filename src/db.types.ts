// =============================================================================
// Global Mobilis — Database Types
// TypeScript interfaces matching the PostgreSQL schema
// =============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string | null;
  avatar_url: string | null;
  bio: string;
  country: string;
  city: string;
  subscription_tier: "free" | "premium" | "pro";
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  name: string;
  source: string;
  created_at: string;
}

export interface Destination {
  id: string;
  country: string;
  city: string;
  region: string;
  continent: string;
  flag_emoji: string;
  image_url: string;
  job_score: number;
  education_score: number;
  business_score: number;
  tourism_score: number;
  quality_of_life_score: number;
  safety_score: number;
  avg_rent_1br: number;
  avg_rent_3br: number;
  cost_of_living_index: number;
  avg_monthly_utilities: number;
  avg_monthly_groceries: number;
  avg_monthly_transport: number;
  description: string;
  short_description: string;
  languages: string[];
  currency: string;
  timezone: string;
  visa_info_url: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export type DestinationScore =
  | "job_score"
  | "education_score"
  | "business_score"
  | "tourism_score"
  | "quality_of_life_score"
  | "safety_score";

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: "expat" | "professional" | "cultural" | "social" | "education" | "support";
  icon: string;
  cover_image_url: string;
  is_public: boolean;
  member_count: number;
  destination_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CommunityMember {
  user_id: string;
  community_id: string;
  role: "member" | "moderator" | "admin";
  joined_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  community_id: string;
  title: string;
  description: string;
  event_type: "online" | "in_person" | "hybrid";
  location: string;
  event_url: string;
  start_date: string;
  end_date: string | null;
  max_attendees: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EventAttendee {
  event_id: string;
  user_id: string;
  status: "going" | "maybe" | "not_going";
  created_at: string;
}

export interface DestinationReview {
  id: string;
  destination_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  pros: string[];
  cons: string[];
  image_url: string;
  created_at: string;
}

export interface MentorshipConnection {
  id: string;
  mentor_id: string;
  mentee_id: string;
  topic: string;
  status: "pending" | "active" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}