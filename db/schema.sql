-- =============================================================================
-- Global Mobilis — Database Schema
-- Target: PostgreSQL (Neon serverless)
-- =============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. USERS
-- =============================================================================
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  email           TEXT NOT NULL UNIQUE,
  password_hash   TEXT,  -- NULL until user sets password (OAuth allowed)
  avatar_url      TEXT,
  bio             TEXT DEFAULT '',
  country         TEXT DEFAULT '',
  city            TEXT DEFAULT '',
  subscription_tier TEXT NOT NULL DEFAULT 'free'
                    CHECK (subscription_tier IN ('free', 'premium', 'pro')),
  is_admin        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_country ON users (country);

-- =============================================================================
-- 2. WAITLIST (early access signups)
-- =============================================================================
CREATE TABLE waitlist (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT NOT NULL UNIQUE,
  name            TEXT DEFAULT '',
  source          TEXT DEFAULT 'landing_page',  -- tracking the signup source
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_waitlist_email ON waitlist (email);

-- =============================================================================
-- 3. DESTINATIONS
-- =============================================================================
CREATE TABLE destinations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country         TEXT NOT NULL,
  city            TEXT NOT NULL,
  region          TEXT DEFAULT '',  -- e.g. "Ontario", "Bavaria"
  continent       TEXT NOT NULL,
  flag_emoji      TEXT DEFAULT '',  -- e.g. "🇨🇦"
  image_url       TEXT DEFAULT '',

  -- Scores (1-100 scale)
  job_score          NUMERIC(4,1) DEFAULT 0 CHECK (job_score BETWEEN 0 AND 100),
  education_score    NUMERIC(4,1) DEFAULT 0 CHECK (education_score BETWEEN 0 AND 100),
  business_score     NUMERIC(4,1) DEFAULT 0 CHECK (business_score BETWEEN 0 AND 100),
  tourism_score      NUMERIC(4,1) DEFAULT 0 CHECK (tourism_score BETWEEN 0 AND 100),
  quality_of_life_score NUMERIC(4,1) DEFAULT 0 CHECK (quality_of_life_score BETWEEN 0 AND 100),
  safety_score       NUMERIC(4,1) DEFAULT 0 CHECK (safety_score BETWEEN 0 AND 100),

  -- Cost of living (monthly estimates in USD)
  avg_rent_1br       NUMERIC(8,2) DEFAULT 0,  -- 1-bedroom apartment, city center
  avg_rent_3br       NUMERIC(8,2) DEFAULT 0,  -- 3-bedroom apartment, city center
  cost_of_living_index NUMERIC(5,1) DEFAULT 0, -- Numbeo-style index
  avg_monthly_utilities NUMERIC(8,2) DEFAULT 0,
  avg_monthly_groceries NUMERIC(8,2) DEFAULT 0,
  avg_monthly_transport NUMERIC(8,2) DEFAULT 0,

  -- Description & highlights
  description       TEXT NOT NULL DEFAULT '',
  short_description TEXT DEFAULT '',
  languages         TEXT[] DEFAULT '{}',  -- e.g. {"English","French"}
  currency          TEXT DEFAULT '',
  timezone          TEXT DEFAULT '',
  visa_info_url     TEXT DEFAULT '',
  is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (country, city)
);

CREATE INDEX idx_destinations_continent ON destinations (continent);
CREATE INDEX idx_destinations_country ON destinations (country);
CREATE INDEX idx_destinations_featured ON destinations (is_featured) WHERE is_featured = TRUE;

-- =============================================================================
-- 4. COMMUNITIES (expat groups / interest groups)
-- =============================================================================
CREATE TABLE communities (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT NOT NULL DEFAULT '',
  type            TEXT NOT NULL DEFAULT 'expat'
                    CHECK (type IN ('expat', 'professional', 'cultural', 'social', 'education', 'support')),
  icon            TEXT DEFAULT '',
  cover_image_url TEXT DEFAULT '',
  is_public       BOOLEAN NOT NULL DEFAULT TRUE,
  member_count    INTEGER NOT NULL DEFAULT 0,
  destination_id  UUID REFERENCES destinations(id) ON DELETE SET NULL,
  created_by      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_communities_type ON communities (type);
CREATE INDEX idx_communities_destination ON communities (destination_id);

-- =============================================================================
-- 5. COMMUNITY MEMBERS
-- =============================================================================
CREATE TABLE community_members (
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  community_id  UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'member'
                  CHECK (role IN ('member', 'moderator', 'admin')),
  joined_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

  PRIMARY KEY (user_id, community_id)
);

CREATE INDEX idx_community_members_community ON community_members (community_id);

-- =============================================================================
-- 6. MESSAGES (direct messages between users)
-- =============================================================================
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_sender ON messages (sender_id, created_at DESC);
CREATE INDEX idx_messages_receiver ON messages (receiver_id, created_at DESC);
CREATE INDEX idx_messages_conversation ON messages (
  LEAST(sender_id, receiver_id),
  GREATEST(sender_id, receiver_id),
  created_at DESC
);

-- =============================================================================
-- 7. EVENTS (community events and meetups)
-- =============================================================================
CREATE TABLE events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id    UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  event_type      TEXT NOT NULL DEFAULT 'online'
                    CHECK (event_type IN ('online', 'in_person', 'hybrid')),
  location        TEXT DEFAULT '',  -- physical address or "Online"
  event_url       TEXT DEFAULT '',  -- for online events
  start_date      TIMESTAMPTZ NOT NULL,
  end_date        TIMESTAMPTZ,
  max_attendees   INTEGER DEFAULT 0,  -- 0 = unlimited
  created_by      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_community ON events (community_id, start_date DESC);
CREATE INDEX idx_events_date ON events (start_date DESC);

-- =============================================================================
-- 8. EVENT ATTENDEES
-- =============================================================================
CREATE TABLE event_attendees (
  event_id      UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status        TEXT NOT NULL DEFAULT 'going'
                  CHECK (status IN ('going', 'maybe', 'not_going')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  PRIMARY KEY (event_id, user_id)
);

-- =============================================================================
-- 9. DESTINATION REVIEWS (user ratings and reviews)
-- =============================================================================
CREATE TABLE destination_reviews (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      destination_id  UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
      user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      review_text     TEXT DEFAULT '',
      pros            TEXT[] DEFAULT '{}',
      cons            TEXT[] DEFAULT '{}',
      image_url       TEXT DEFAULT '',
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

      UNIQUE (destination_id, user_id)
    );

CREATE INDEX idx_destination_reviews_dest ON destination_reviews (destination_id, rating DESC);

-- =============================================================================
-- 10. MENTORSHIP CONNECTIONS
-- =============================================================================
CREATE TABLE mentorship_connections (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mentee_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic           TEXT DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (mentor_id, mentee_id)
);

CREATE INDEX idx_mentorship_mentor ON mentorship_connections (mentor_id);
CREATE INDEX idx_mentorship_mentee ON mentorship_connections (mentee_id);

-- =============================================================================
-- Apply updated_at triggers
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_destinations_updated_at
  BEFORE UPDATE ON destinations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_communities_updated_at
  BEFORE UPDATE ON communities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_mentorship_updated_at
  BEFORE UPDATE ON mentorship_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();