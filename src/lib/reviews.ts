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

// Reviews come only from real users. This map previously held four invented
// reviews from invented people (Ana Silva, Marcus Chen, Sarah Williams,
// Felix Müller), which the destination pages then displayed as a star rating
// and an "average score". A fabricated review is worse than no review: it
// tells someone weighing a move that a stranger vouched for a city when no
// stranger did. Keep this empty until the review pipeline has real rows in it.
export const SEED_REVIEWS: Record<string, StoredReview[]> = {};

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