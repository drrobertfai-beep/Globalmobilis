import { neon } from "@neondatabase/serverless";
import type {
  Destination,
  Community,
  Message,
  Event,
  WaitlistEntry,
  DestinationReview,
} from "~/db.types";

/**
 * Server-only handle to the team's database (Neon serverless Postgres over HTTP).
 * The connection string comes from `DATABASE_URL`, which the owner connects via
 * the database card and which is injected into the sandbox and passed to the live
 * host on publish. Resolved lazily (per call, not at module load) so the site
 * still builds and serves before a database is connected — the error only
 * surfaces if a query actually runs without `DATABASE_URL`.
 *
 * Use it only inside a `createServerFn()` handler or an `src/routes/api/*` route
 * (never client code):
 *
 *   const getPosts = createServerFn().handler(async () => {
 *     const rows = await sql()`select id, title, created_at from posts`;
 *     return rows.map((r) => ({ ...r, created_at: String(r.created_at) }));
 *   });
 */
export const sql = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set — connect a database (via the database card) before running queries.",
    );
  }
  return neon(url);
};

// =============================================================================
// DESTINATION QUERIES
// =============================================================================

/** Get all destinations, optionally filtered by continent */
export async function getDestinations(continent?: string) {
  const db = sql();
  if (continent) {
    const rows = await db`SELECT * FROM destinations WHERE continent = ${continent} ORDER BY country, city`;
    return rows as unknown as Destination[];
  }
  const rows = await db`SELECT * FROM destinations ORDER BY is_featured DESC, country, city`;
  return rows as unknown as Destination[];
}

/** Get featured destinations for the landing page */
export async function getFeaturedDestinations(limit = 6) {
  const db = sql();
  const rows = await db`SELECT * FROM destinations WHERE is_featured = TRUE ORDER BY job_score DESC LIMIT ${limit}`;
  return rows as unknown as Destination[];
}

/** Get a single destination by ID */
export async function getDestinationById(id: string) {
  const db = sql();
  const rows = await db`SELECT * FROM destinations WHERE id = ${id}`;
  return (rows as unknown as Destination[])[0] ?? null;
}

/** Get destinations by country */
export async function getDestinationsByCountry(country: string) {
  const db = sql();
  const rows = await db`SELECT * FROM destinations WHERE country = ${country} ORDER BY city`;
  return rows as unknown as Destination[];
}

/** Search destinations by city or country name */
export async function searchDestinations(query: string) {
  const db = sql();
  const pattern = `%${query}%`;
  const rows = await db`
    SELECT * FROM destinations
    WHERE city ILIKE ${pattern} OR country ILIKE ${pattern}
    ORDER BY is_featured DESC, country, city
    LIMIT 20
  `;
  return rows as unknown as Destination[];
}

/** Get distinct continents */
export async function getContinents() {
  const db = sql();
  const rows = await db`SELECT DISTINCT continent FROM destinations ORDER BY continent`;
  return rows.map((r: any) => r.continent) as string[];
}

// =============================================================================
// COMMUNITY QUERIES
// =============================================================================

/** Get all public communities */
export async function getCommunities(type?: string, limit = 20) {
  const db = sql();
  if (type) {
    const rows = await db`
      SELECT * FROM communities
      WHERE is_public = TRUE AND type = ${type}
      ORDER BY member_count DESC
      LIMIT ${limit}
    `;
    return rows as unknown as Community[];
  }
  const rows = await db`
    SELECT * FROM communities
    WHERE is_public = TRUE
    ORDER BY member_count DESC
    LIMIT ${limit}
  `;
  return rows as unknown as Community[];
}

/** Get communities for a specific destination */
export async function getCommunitiesByDestination(destinationId: string) {
  const db = sql();
  const rows = await db`
    SELECT * FROM communities
    WHERE destination_id = ${destinationId} AND is_public = TRUE
    ORDER BY member_count DESC
  `;
  return rows as unknown as Community[];
}

// =============================================================================
// WAITLIST QUERIES
// =============================================================================

/** Add email to waitlist */
export async function addToWaitlist(email: string, name?: string) {
  const db = sql();
  const rows = await db`
    INSERT INTO waitlist (email, name)
    VALUES (${email.toLowerCase()}, ${name?.trim() || ""})
    ON CONFLICT (email) DO NOTHING
    RETURNING id, email, created_at
  `;
  return (rows as unknown as WaitlistEntry[])[0] ?? null;
}

/** Get waitlist count */
export async function getWaitlistCount() {
  const db = sql();
  const rows = await db`SELECT COUNT(*) as count FROM waitlist`;
  return Number(rows[0]?.count ?? 0);
}

// =============================================================================
// MESSAGE QUERIES
// =============================================================================

/** Get conversation between two users */
export async function getConversation(userId1: string, userId2: string, limit = 50) {
  const db = sql();
  const rows = await db`
    SELECT * FROM messages
    WHERE (sender_id = ${userId1} AND receiver_id = ${userId2})
       OR (sender_id = ${userId2} AND receiver_id = ${userId1})
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return (rows as unknown as Message[]).reverse();
}

/** Send a message */
export async function sendMessage(senderId: string, receiverId: string, content: string) {
  const db = sql();
  const rows = await db`
    INSERT INTO messages (sender_id, receiver_id, content)
    VALUES (${senderId}, ${receiverId}, ${content})
    RETURNING *
  `;
  return rows[0] as unknown as Message;
}

// =============================================================================
// EVENT QUERIES
// =============================================================================

/** Get upcoming events for a community */
export async function getUpcomingEvents(communityId: string, limit = 10) {
  const db = sql();
  const rows = await db`
    SELECT * FROM events
    WHERE community_id = ${communityId} AND start_date > NOW()
    ORDER BY start_date ASC
    LIMIT ${limit}
  `;
  return rows as unknown as Event[];
}

/** Get all upcoming events */
export async function getAllUpcomingEvents(limit = 20) {
  const db = sql();
  const rows = await db`
    SELECT e.*, c.name as community_name, c.slug as community_slug
    FROM events e
    JOIN communities c ON e.community_id = c.id
    WHERE e.start_date > NOW()
    ORDER BY e.start_date ASC
    LIMIT ${limit}
  `;
  return rows as unknown as (Event & { community_name: string; community_slug: string })[];
}

// =============================================================================
// REVIEW QUERIES
// =============================================================================

/** Get all reviews for a destination */
export async function getReviewsByDestination(destinationId: string) {
  const db = sql();
  const rows = await db`
    SELECT dr.*, u.name as user_name, u.avatar_url
    FROM destination_reviews dr
    JOIN users u ON dr.user_id = u.id
    WHERE dr.destination_id = ${destinationId}
    ORDER BY dr.created_at DESC
  `;
  return rows as unknown as (DestinationReview & { user_name: string; avatar_url: string })[];
}

/** Get average rating for a destination */
export async function getAverageRating(destinationId: string) {
  const db = sql();
  const rows = await db`
    SELECT ROUND(AVG(rating)::numeric, 1) as avg_rating, COUNT(*) as review_count
    FROM destination_reviews
    WHERE destination_id = ${destinationId}
  `;
  return { avgRating: Number(rows[0]?.avg_rating ?? 0), reviewCount: Number(rows[0]?.review_count ?? 0) };
}

/** Add a review for a destination */
export async function addReview(
  destinationId: string,
  userId: string,
  rating: number,
  reviewText: string,
  pros: string[],
  cons: string[],
  imageUrl?: string,
) {
  const db = sql();
  const rows = await db`
    INSERT INTO destination_reviews (destination_id, user_id, rating, review_text, pros, cons, image_url)
    VALUES (${destinationId}, ${userId}, ${rating}, ${reviewText}, ${pros}, ${cons}, ${imageUrl || ""})
    ON CONFLICT (destination_id, user_id)
    DO UPDATE SET rating = ${rating}, review_text = ${reviewText}, pros = ${pros}, cons = ${cons}, image_url = ${imageUrl || ""}
    RETURNING *
  `;
  return rows[0] as unknown as DestinationReview;
}

// =============================================================================
// METADATA
// =============================================================================

/** Get list of all countries with destinations */
export async function getCountries() {
  const db = sql();
  const rows = await db`
    SELECT country, flag_emoji, COUNT(*) as city_count
    FROM destinations
    GROUP BY country, flag_emoji
    ORDER BY country
  `;
  return rows as unknown as { country: string; flag_emoji: string; city_count: number }[];
}