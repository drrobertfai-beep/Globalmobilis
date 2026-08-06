import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BottomNav } from "~/components/BottomNav";
import {
  bookSession,
  formatSlot,
  getMentor,
  ratingStars,
  type BookingView,
  type MentorProfileView,
} from "~/lib/mentors";

export const Route = createFileRoute("/mentors/$mentorId")({
  head: () => ({
    meta: [
      { title: "Mentor Profile — Global Mobilis" },
      {
        name: "description",
        content:
          "View a mentor's profile, expertise and availability, then book a 1:1 video consultation.",
      },
    ],
  }),
  component: MentorProfilePage,
});

function MentorProfilePage() {
  const { mentorId } = Route.useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState<MentorProfileView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [booking, setBooking] = useState<BookingView | null>(null);

  useEffect(() => {
    let cancelled = false;
    const gfd = new FormData();
    gfd.set("mentorId", mentorId);
    // POST server fn: FormData args need the { data: fd } wrapper — raw fn(fd)
    // sends an EMPTY body, so getMentor returns null and every profile showed
    // "Mentor not found.".
    getMentor({ data: gfd })
      .then((result) => {
        if (cancelled) return;
        if (!result) {
          setError("Mentor not found.");
          return;
        }
        setMentor(result as unknown as MentorProfileView);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load this mentor. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mentorId]);

  const handleBook = async () => {
    if (!selectedSlot || !mentor) return;
    setBookingInProgress(true);
    setBookingError("");
    const bfd = new FormData();
    bfd.set("mentorId", mentor.id);
    bfd.set("slot", selectedSlot);
    // Same wrapper requirement as getMentor — raw fn(fd) would send an empty
    // body and booking would always fail with "Mentor and time slot are required.".
    const result = await bookSession({ data: bfd });
    setBookingInProgress(false);
    if (result.success && result.booking) {
      setBooking(result.booking);
    } else {
      setBookingError(result.error ?? "Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="pb-24">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="card h-64 animate-pulse bg-neutral-100" />
        </div>
        <BottomNav currentTab="explore" />
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="pb-24">
        <div className="mx-auto max-w-3xl px-4 py-10 text-center">
          <p className="mb-4 text-4xl">🤷</p>
          <p className="mb-4 font-semibold text-neutral-700">{error || "Mentor not found."}</p>
          <Link
            to="/mentors"
            className="rounded-full bg-brand-primary-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-primary-500"
          >
            ← Back to mentors
          </Link>
        </div>
        <BottomNav currentTab="explore" />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {/* Back */}
        <Link to="/mentors" className="mb-4 inline-block text-sm font-medium text-brand-primary-500 hover:text-brand-primary-700">
          ← All mentors
        </Link>

        {/* Profile card */}
        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${mentor.avatarColor}`}
            >
              {mentor.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-neutral-800">{mentor.name}</h1>
              <p className="text-sm text-neutral-500">{mentor.title}</p>
              <p className="mt-0.5 text-xs text-neutral-400">
                {mentor.flag} {mentor.city}, {mentor.country} · ${mentor.hourlyRate}/hr
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <span className="tracking-tight text-brand-gold-500">
                  {ratingStars(mentor.rating).join("")}
                </span>
                <span className="ml-1 text-xs font-semibold text-neutral-700">{mentor.rating}</span>
                <span className="text-xs text-neutral-400">({mentor.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-neutral-600">{mentor.bio}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {mentor.expertise.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-primary-50 px-3 py-1 text-xs font-medium text-brand-primary-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4">
            <p className="mb-1.5 text-xs font-semibold text-neutral-500">Languages</p>
            <div className="flex flex-wrap gap-1.5">
              {mentor.languages.map((lang) => (
                <span
                  key={lang}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Intro video (if the mentor has one) */}
        {mentor.videoIntroUrl && (
          <div className="card mt-4 p-6">
            <h2 className="mb-3 font-bold text-neutral-800">Intro video 🎬</h2>
            <div className="overflow-hidden rounded-xl bg-black">
              <video
                src={mentor.videoIntroUrl}
                controls
                playsInline
                preload="metadata"
                className="aspect-video w-full"
              >
                Your browser doesn't support embedded video.
              </video>
            </div>
          </div>
        )}
        {/* Booking */}
        {!booking ? (
          <div className="card mt-4 p-6">
            <h2 className="mb-1 font-bold text-neutral-800">Book a session</h2>
            <p className="mb-4 text-sm text-neutral-500">
              Pick an upcoming time slot. Your call takes place over video (Jitsi Meet).
            </p>

            {mentor.availableTimeSlots.length === 0 ? (
              <p className="rounded-xl bg-brand-primary-50 p-4 text-sm text-brand-primary-700">
                No upcoming slots right now — check back soon or browse other mentors.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {mentor.availableTimeSlots.map((slot) => {
                  const selected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setBookingError("");
                      }}
                      className={`rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                        selected
                          ? "border-brand-secondary-500 bg-brand-secondary-100 text-brand-secondary-700"
                          : "border-neutral-200 text-neutral-700 hover:border-brand-primary-300 hover:bg-brand-primary-50"
                      }`}
                    >
                      {formatSlot(slot)}
                    </button>
                  );
                })}
              </div>
            )}

            {bookingError && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {bookingError}{" "}
                {bookingError.includes("signed in") && (
                  <Link to="/login" className="font-semibold underline">
                    Sign in →
                  </Link>
                )}
              </div>
            )}

            <button
              onClick={handleBook}
              disabled={!selectedSlot || bookingInProgress}
              className="mt-5 w-full rounded-full bg-brand-secondary-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-secondary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {bookingInProgress
                ? "Booking…"
                : selectedSlot
                  ? `Book session — $${mentor.hourlyRate} · ${formatSlot(selectedSlot)}`
                  : "Select a time slot above"}
            </button>
            <p className="mt-2 text-center text-xs text-neutral-400">
              Free for now — payments are coming soon.
            </p>
          </div>
        ) : (
          <div className="card mt-4 border-2 border-brand-secondary-500/40 bg-gradient-to-r from-[#F0FBFA] to-[#E6F7F5] p-6 text-center">
            <span className="text-4xl">✅</span>
            <h2 className="mt-2 text-lg font-bold text-neutral-800">Session confirmed!</h2>
            <p className="mt-1 text-sm text-neutral-600">
              {formatSlot(booking.slot)} with {booking.mentorName} · {booking.mentorTitle}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Your room is ready — join from a quiet space with a stable connection.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
              <Link
                to="/consultation/$bookingId"
                params={{ bookingId: booking.id }}
                className="rounded-full bg-brand-secondary-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-secondary-700"
              >
                Join Call →
              </Link>
              <Link
                to="/mentors"
                className="rounded-full border border-brand-primary-200 px-6 py-2.5 text-sm font-semibold text-brand-primary-700 hover:bg-brand-primary-50"
              >
                Book another
              </Link>
            </div>
          </div>
        )}
      </div>
      <BottomNav currentTab="explore" />
    </div>
  );
}
