import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SEED_DESTINATIONS } from "~/lib/destinations";
import { uploadFile } from "~/lib/upload/server";

export const Route = createFileRoute("/destinations/$id")({
  component: DestinationDetailPage,
});

const TABS = ["Overview", "Jobs", "Housing", "Education", "Community", "Reviews"] as const;
type Tab = (typeof TABS)[number];

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-neutral-700">{label}</span>
        <span className="text-neutral-500">{value}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function DestinationDetailPage() {
  const { id } = Route.useParams();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formText, setFormText] = useState("");
  const [formPros, setFormPros] = useState("");
  const [formCons, setFormCons] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formVideo, setFormVideo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const dest = SEED_DESTINATIONS.find((d) => d.id === id) || null;

  // Load reviews when tab switches to Reviews
  useEffect(() => {
    if (activeTab === "Reviews") {
      loadReviews();
    }
  }, [activeTab]);

  const loadReviews = () => {
    if (reviewsLoaded) return;
    try {
      const result = getReviewsForDestination(id);
      setReviews(result.reviews);
      setAvgRating(result.avgRating);
      setReviewCount(result.reviewCount);
      setReviewsLoaded(true);
    } catch {}
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setReviewError("");
    try {
      const result = await submitReviewForDestination(
        id,
        "anonymous",
        formRating,
        formText,
        formPros.split(",").map((s) => s.trim()).filter(Boolean),
        formCons.split(",").map((s) => s.trim()).filter(Boolean),
        formImage || undefined,
        formVideo || undefined
      );
      if (result.success) {
        setShowReviewForm(false);
        setFormText("");
        setFormPros("");
        setFormCons("");
        setFormImage("");
        setFormVideo("");
        setReviewsLoaded(false); // force reload
        const updated = getReviewsForDestination(id);
        setReviews(updated.reviews);
        setAvgRating(updated.avgRating);
        setReviewCount(updated.reviewCount);
        setReviewsLoaded(true);
      } else {
        setReviewError(result.error || "Something went wrong");
      }
    } catch {
      setReviewError("Failed to submit review");
    }
    setSubmitting(false);
  };

  if (!dest) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="mb-2 text-2xl font-bold text-neutral-700">Destination not found</h1>
        <Link to="/destinations" className="text-brand-primary-500 hover:underline">Browse all destinations</Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="relative h-64 overflow-hidden" style={{ background: "var(--gm-gradient-brand)" }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <span className="text-[200px]">{dest.flag_emoji}</span>
        </div>
        {/* Floating chrome */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-6">
          <Link to="/destinations" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
            <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  const url = window.location.href;
                  const text = `Check out ${dest.city}, ${dest.country} on Global Mobilis!`;
                  if (navigator.share) {
                    navigator.share({ title: text, url });
                  } else {
                    navigator.clipboard.writeText(url).then(() => alert("Link copied!"));
                  }
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
                title="Share"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            </div>
        {/* Floating city name */}
        <div className="absolute -bottom-8 left-4 z-10">
          <div className="card inline-flex items-center gap-3 p-5">
            <span className="text-4xl">{dest.flag_emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-neutral-700">{dest.city}</h1>
              <p className="text-sm text-neutral-500">{dest.country}</p>
            </div>
          </div>
        </div>
          </div>
        </div>

      <div className="mx-auto mt-10 max-w-4xl px-4 sm:px-6">
        {/* Quick stat row */}
        <div className="mb-6 grid grid-cols-4 gap-2">
          {[
            { label: "Cost", value: dest.cost_of_living_index, color: "text-brand-coral-500" },
            { label: "Jobs", value: dest.job_score, color: "text-brand-primary-500" },
            { label: "Education", value: dest.education_score, color: "text-brand-secondary-500" },
            { label: "Safety", value: dest.safety_score, color: "text-green-500" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-white p-3 text-center shadow-sm">
              <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] text-neutral-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="mb-6 flex gap-0 overflow-x-auto border-b border-neutral-200 hide-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-brand-secondary-500 text-brand-secondary-500"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "Overview" && (
          <div className="space-y-6">
            <p className="text-sm leading-relaxed text-neutral-500">{dest.description}</p>

            {/* Why city card */}
            <div className="rounded-2xl border border-brand-coral-100 bg-brand-coral-50 p-5">
              <h3 className="mb-1 text-sm font-bold text-brand-coral-700">Why {dest.city}?</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                A vibrant hub for professionals seeking a balanced lifestyle, with excellent public transport, 
                multicultural communities, and growing career opportunities.
              </p>
            </div>

            {/* Score bars */}
            <div className="card">
              <h3 className="mb-4 text-sm font-bold text-neutral-700">Quality Scores</h3>
              <ScoreBar label="Job Market" value={dest.job_score} color="#0E4F8B" />
              <ScoreBar label="Education" value={dest.education_score} color="#1B7A9B" />
              <ScoreBar label="Business" value={dest.business_score} color="#0FA3A3" />
              <ScoreBar label="Tourism" value={dest.tourism_score} color="#F4B860" />
              <ScoreBar label="Quality of Life" value={dest.quality_of_life_score} color="#F47B53" />
              <ScoreBar label="Safety" value={dest.safety_score} color="#2ECC71" />
            </div>
          </div>
        )}

        {activeTab === "Jobs" && (
          <div className="card">
            <h3 className="mb-4 text-lg font-bold text-neutral-700">Job Market Overview</h3>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-3xl">💼</span>
              <div>
                <div className="text-2xl font-bold text-brand-primary-700">{dest.job_score}/100</div>
                <div className="text-sm text-neutral-500">Job Market Score</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-neutral-500">
              {dest.city} offers a diverse job market with opportunities across tech, finance, healthcare, 
              and more. The city is home to numerous multinational companies and a thriving startup ecosystem.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-brand-primary-50 p-3 text-center">
                <div className="text-sm font-bold text-brand-primary-700">Tech</div>
                <div className="text-xs text-neutral-500">Growing sector</div>
              </div>
              <div className="rounded-xl bg-brand-primary-50 p-3 text-center">
                <div className="text-sm font-bold text-brand-primary-700">Finance</div>
                <div className="text-xs text-neutral-500">Strong market</div>
              </div>
              <div className="rounded-xl bg-brand-primary-50 p-3 text-center">
                <div className="text-sm font-bold text-brand-primary-700">Avg. Salary</div>
                <div className="text-xs text-neutral-500">Competitive</div>
              </div>
              <div className="rounded-xl bg-brand-primary-50 p-3 text-center">
                <div className="text-sm font-bold text-brand-primary-700">Remote</div>
                <div className="text-xs text-neutral-500">Growing</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Housing" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card">
                <div className="mb-1 text-xs text-neutral-500">Rent (1BR, Center)</div>
                <div className="text-2xl font-bold text-neutral-700">${dest.avg_rent_1br.toLocaleString()}/mo</div>
              </div>
              <div className="card">
                <div className="mb-1 text-xs text-neutral-500">Rent (3BR, Center)</div>
                <div className="text-2xl font-bold text-neutral-700">${dest.avg_rent_3br.toLocaleString()}/mo</div>
              </div>
              <div className="card">
                <div className="mb-1 text-xs text-neutral-500">Cost of Living Index</div>
                <div className="text-2xl font-bold text-brand-primary-700">{dest.cost_of_living_index}</div>
              </div>
              <div className="card">
                <div className="mb-1 text-xs text-neutral-500">Monthly Utilities</div>
                <div className="text-2xl font-bold text-neutral-700">${dest.avg_monthly_utilities}</div>
              </div>
              <div className="card">
                <div className="mb-1 text-xs text-neutral-500">Groceries</div>
                <div className="text-2xl font-bold text-neutral-700">${dest.avg_monthly_groceries}</div>
              </div>
              <div className="card">
                <div className="mb-1 text-xs text-neutral-500">Transport</div>
                <div className="text-2xl font-bold text-neutral-700">${dest.avg_monthly_transport}</div>
              </div>
            </div>
            <div className="rounded-2xl bg-brand-secondary-50 p-5 text-center">
              <p className="text-sm text-brand-secondary-700">
                💡 {dest.city} is {dest.cost_of_living_index > 75 ? "more expensive" : "more affordable"} than the average global city.
              </p>
            </div>
          </div>
        )}

        {activeTab === "Education" && (
          <div className="card">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-3xl">🎓</span>
              <div>
                <div className="text-2xl font-bold text-brand-secondary-500">{dest.education_score}/100</div>
                <div className="text-sm text-neutral-500">Education Score</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-neutral-500">
              {dest.city} has excellent educational institutions, from primary schools to world-class universities.
              The city is known for its strong focus on research and innovation.
            </p>
            <div className="mt-4 rounded-xl bg-brand-secondary-100 p-4">
              <p className="text-xs text-brand-secondary-700">
                Languages spoken: {dest.languages.join(", ")} · Currency: {dest.currency}
              </p>
            </div>
          </div>
        )}

        {activeTab === "Community" && (
          <div className="card">
            <h3 className="mb-4 text-lg font-bold text-neutral-700">Expat Community</h3>
            <p className="mb-4 text-sm leading-relaxed text-neutral-500">
              {dest.city} has a thriving expat community with numerous groups, events, and networking opportunities.
              Connect with locals and fellow expats who've made the move.
            </p>
            <div className="space-y-3">
              {[
                { name: `${dest.city} Expats`, members: "2.3k", type: "Social" },
                { name: `Professionals in ${dest.city}`, members: "1.8k", type: "Career" },
                { name: `${dest.city} Newcomers`, members: "890", type: "Support" },
              ].map((g) => (
                <div key={g.name} className="flex items-center justify-between rounded-xl bg-neutral-50 p-3">
                  <div>
                    <div className="text-sm font-medium text-neutral-700">{g.name}</div>
                    <div className="text-xs text-neutral-500">{g.members} members · {g.type}</div>
                  </div>
                  <button className="rounded-full bg-brand-secondary-100 px-3 py-1 text-xs font-medium text-brand-secondary-700">
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Reviews" && (
          <div>
            {/* Rating summary */}
            <div className="mb-6 card">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-brand-secondary-500">{avgRating}</div>
                  <div className="flex gap-0.5 justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`text-sm ${star <= Math.round(avgRating) ? "text-brand-gold-500" : "text-neutral-200"}`}>★</span>
                    ))}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">{reviewCount} review{reviewCount !== 1 ? "s" : ""}</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-neutral-700">What expats say about {dest.city}</h3>
                  <p className="text-sm text-neutral-500 mt-1">Real reviews from the Global Mobilis community</p>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="btn-primary shrink-0 text-xs px-4 py-2"
                >
                  {showReviewForm ? "Cancel" : "Write Review"}
                </button>
              </div>
            </div>

            {/* Review form */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="mb-6 card p-5 space-y-4">
                <h3 className="font-bold text-neutral-700">Write your review</h3>
                
                {reviewError && (
                  <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{reviewError}</div>
                )}

                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setFormRating(star)} className={`text-2xl transition-colors ${star <= formRating ? "text-brand-gold-500" : "text-neutral-200 hover:text-brand-gold-300"}`}>
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Review</label>
                  <textarea
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    className="input min-h-[80px] text-sm"
                    placeholder="Share your experience..."
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">Pros (comma-separated)</label>
                    <input value={formPros} onChange={(e) => setFormPros(e.target.value)} className="input text-sm" placeholder="e.g. Great food, Friendly locals" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">Cons (comma-separated)</label>
                    <input value={formCons} onChange={(e) => setFormCons(e.target.value)} className="input text-sm" placeholder="e.g. Expensive, Cold weather" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Photo URL (optional)</label>
                  <input value={formImage} onChange={(e) => setFormImage(e.target.value)} className="input text-sm" placeholder="https://example.com/photo.jpg" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Video URL (optional)</label>
                  <input value={formVideo} onChange={(e) => setFormVideo(e.target.value)} className="input text-sm" placeholder="https://youtube.com/watch?v=..." />
                </div>

                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}

            {/* Review cards */}
            {reviews.length === 0 ? (
              <div className="card text-center py-10">
                <span className="text-4xl">💬</span>
                <p className="mt-3 text-sm text-neutral-500">No reviews yet. Be the first to review {dest.city}!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, i) => (
                  <div key={review.id || i} className="card p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${["bg-brand-coral-500", "bg-brand-secondary-500", "bg-brand-primary-500", "bg-brand-gold-500"][i % 4]}`}>
                          {review.user_name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-neutral-700">{review.user_name || "Anonymous"}</div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={`text-xs ${star <= review.rating ? "text-brand-gold-500" : "text-neutral-200"}`}>★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-neutral-400">
                        {new Date(review.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>

                    {review.review_text && (
                      <p className="mt-3 text-sm leading-relaxed text-neutral-600">{review.review_text}</p>
                    )}

                    {review.image_url && (
                      <div className="mt-3 overflow-hidden rounded-xl">
                        <img src={review.image_url} alt="Review photo" className="h-48 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                    )}

                    {review.video_url && (
                      <div className="mt-3 overflow-hidden rounded-xl">
                        <div className="relative aspect-video w-full bg-black">
                            <iframe
                            src={review.video_url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                            className="absolute inset-0 h-full w-full"
                            allowFullScreen
                            title="Review video"
                            />
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {review.pros?.filter(Boolean).map((p: string, j: number) => (
                        <span key={j} className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-medium text-green-700">👍 {p}</span>
                      ))}
                      {review.cons?.filter(Boolean).map((c: string, j: number) => (
                        <span key={j} className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-medium text-red-700">👎 {c}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>


      {/* Social Share */}
      <div className="mt-8 mb-4 text-center">
        <p className="mb-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Share {dest.city} with friends</p>
        <div className="flex items-center justify-center gap-3">
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out " + dest.city + ", " + dest.country + " on Global Mobilis!")}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-black hover:text-white transition-colors" title="Share on X (Twitter)">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-blue-600 hover:text-white transition-colors" title="Share on Facebook">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-blue-700 hover:text-white transition-colors" title="Share on LinkedIn">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href={`https://wa.me/?text=${encodeURIComponent("Check out " + dest.city + ", " + dest.country + " on Global Mobilis! " + (typeof window !== "undefined" ? window.location.href : ""))}`} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-green-500 hover:text-white transition-colors" title="Share on WhatsApp">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert("Link copied!"))}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-brand-primary-500 hover:text-white transition-colors"
            title="Copy link"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <Link
            to="/community"
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white shadow-lg"
            style={{ background: "var(--gm-gradient-brand)" }}
          >
            Connect with expats in {dest.city} →
          </Link>
        </div>
      </div>
    </div>
  );
}
