// =============================================================================
// Seed review data — used directly by the detail page (synchronous, no RPC).
// Reviews submitted via the form are stored in a JSON file.
// =============================================================================

export interface StoredReview {
  id: string;
  destination_id: string;
  user_id: string;
  user_name: string;
  avatar_url: string;
  rating: number;
  review_text: string;
  pros: string[];
  cons: string[];
  image_url: string;
  video_url: string;
  created_at: string;
}

// Seed mock reviews for destinations
export const SEED_REVIEWS: Record<string, StoredReview[]> = {
  "1": [
    { id: "r1", destination_id: "1", user_id: "u1", user_name: "Ana Silva", avatar_url: "", rating: 5, review_text: "Absolutely love Toronto! The multicultural vibe is unmatched. Great job opportunities in tech.", pros: ["Diverse culture", "Great food scene", "Strong job market"], cons: ["Expensive rent", "Cold winters"], image_url: "", video_url: "", created_at: "2026-03-15T10:30:00Z" },
    { id: "r2", destination_id: "1", user_id: "u2", user_name: "Marcus Chen", avatar_url: "", rating: 4, review_text: "Moved here for work and it's been fantastic. The public transit could be better though.", pros: ["Job opportunities", "Multicultural"], cons: ["TTC delays", "High taxes"], image_url: "", video_url: "", created_at: "2026-02-20T14:00:00Z" },
  ],
  "3": [
    { id: "r3", destination_id: "3", user_id: "u3", user_name: "Sarah Williams", avatar_url: "", rating: 5, review_text: "London is incredible! So much history, culture, and career opportunities.", pros: ["World-class museums", "Career growth", "Public transport"], cons: ["Very expensive", "Crowded"], image_url: "", video_url: "", created_at: "2026-01-10T09:00:00Z" },
  ],
  "5": [
    { id: "r4", destination_id: "5", user_id: "u4", user_name: "Felix Müller", avatar_url: "", rating: 5, review_text: "Berlin is the best decision I ever made. Creative, affordable, and incredibly welcoming.", pros: ["Affordable", "Creative scene", "English-friendly"], cons: ["Bureaucracy", "Weather"], image_url: "", video_url: "", created_at: "2026-04-01T11:00:00Z" },
  ],
};

function getFileFallback(): StoredReview[] {
  try {
    if (existsSync(REVIEWS_FILE)) {
      return JSON.parse(readFile(REVIEWS_FILE, "utf-8"));
    }
  } catch {}
  return [];
}

/** Get reviews for a destination — uses seed data + file fallback, sync, no RPC */
export function getReviewsForDestination(destinationId: string) {
  if (!destinationId) return { reviews: [], avgRating: 0, reviewCount: 0 };

  const stored = getFileFallback();
  const fileReviews = stored.filter((r) => r.destination_id === destinationId);

  if (fileReviews.length > 0) {
    const count = fileReviews.length;
    const avg = fileReviews.reduce((s, r) => s + r.rating, 0) / count;
    return { reviews: fileReviews, avgRating: Math.round(avg * 10) / 10, reviewCount: count };
  }

  const seed = SEED_REVIEWS[destinationId] || [];
  return {
    reviews: seed,
    avgRating: seed.length ? Math.round((seed.reduce((s, r) => s + r.rating, 0) / seed.length) * 10) / 10 : 0,
    reviewCount: seed.length,
  };
}

/** Submit a review — stores to JSON file (DB optional) */
export async function submitReviewForDestination(
  destinationId: string,
  userId: string,
  rating: number,
  reviewText: string,
  pros: string[],
  cons: string[],
  imageUrl?: string,
  videoUrl?: string,
) {
  if (!destinationId || !rating || rating < 1 || rating > 5) {
    return { success: false, error: "Valid rating (1-5) is required" };
  }

  const stored = getFileFallback();
  stored.push({
    id: `r_${Date.now()}`,
    destination_id: destinationId,
    user_id: userId || "anonymous",
    user_name: "Anonymous",
    avatar_url: "",
    rating,
    review_text: reviewText,
    pros,
    cons,
    image_url: imageUrl || "",
    video_url: videoUrl || "",
    created_at: new Date().toISOString(),
  });
  await writeFile(REVIEWS_FILE, JSON.stringify(stored, null, 2));
  return { success: true, error: null };
}