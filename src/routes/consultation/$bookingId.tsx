import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BottomNav } from "~/components/BottomNav";
import { formatSlot, getMyBookings, type BookingView } from "~/lib/mentors";

export const Route = createFileRoute("/consultation/$bookingId")({
  head: () => ({
    meta: [
      { title: "Video Consultation — Global Mobilis" },
      {
        name: "description",
        content:
          "Join your 1:1 video consultation with a verified local mentor, powered by Jitsi Meet.",
      },
    ],
  }),
  component: ConsultationPage,
});

const CHECKLIST = [
  "Test your microphone and camera before joining",
  "Use a quiet, well-lit space",
  "Make sure you have a stable internet connection",
  "Join from Chrome or Firefox for the best experience",
];

function ConsultationPage() {
  const { bookingId } = Route.useParams();
  const [booking, setBooking] = useState<BookingView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getMyBookings()
      .then((result) => {
        if (cancelled) return;
        const found = (result as unknown as BookingView[]).find((b) => b.id === bookingId);
        if (!found) {
          setError("Booking not found.");
          return;
        }
        setBooking(found);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load this consultation.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  const cancelled = booking?.status === "cancelled";
  const completed = booking?.status === "completed";

  if (loading) {
    return (
      <div className="pb-24">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="card h-80 animate-pulse bg-neutral-100" />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-5xl">🤷</span>
        <p className="font-semibold text-neutral-700">{error || "Booking not found."}</p>
        <Link
          to="/mentors"
          className="rounded-full bg-brand-primary-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-primary-500"
        >
          Browse mentors
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 pb-16">
      {/* Header bar */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:px-6">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${booking.mentorAvatarColor}`}
          >
            {booking.mentorAvatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-neutral-800">
              {booking.mentorName}
              {booking.mentorTitle && (
                <span className="font-normal text-neutral-500"> · {booking.mentorTitle}</span>
              )}
            </p>
            <p className="truncate text-xs text-neutral-500">
              {booking.mentorFlag} {booking.mentorCity} · {formatSlot(booking.slot)}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
              cancelled
                ? "bg-red-50 text-red-600"
                : completed
                  ? "bg-neutral-100 text-neutral-500"
                  : "bg-green-50 text-green-600"
            }`}
          >
            {cancelled ? "Cancelled" : completed ? "Completed" : "● Live"}
          </span>
        </div>
      </header>

      {cancelled || completed ? (
        <div className="mx-auto mt-16 max-w-md px-6 text-center">
          <span className="text-5xl">{cancelled ? "🚫" : "🏁"}</span>
          <h2 className="mt-3 text-lg font-bold text-neutral-800">
            This session was {cancelled ? "cancelled" : "completed"}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            {cancelled
              ? "You can book a new session with a mentor anytime."
              : "Thanks for joining! Book another session when you're ready."}
          </p>
          <Link
            to="/mentors"
            className="mt-5 inline-block rounded-full bg-brand-secondary-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-secondary-700"
          >
            Book a new session →
          </Link>
        </div>
      ) : (
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-4 sm:px-6">
          {/* Jitsi Meet embed */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-black shadow-sm">
            <iframe
              src={`https://meet.jit.si/gm-mentor-${booking.id}`}
              title="Jitsi Meet consultation room"
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              className="h-[calc(100vh-320px)] min-h-[420px] w-full border-0"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <a
              href={booking.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-brand-primary-500 hover:text-brand-primary-700"
            >
              Open in a new tab ↗
            </a>
            <Link
              to="/dashboard"
              className="rounded-full bg-red-50 px-5 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
            >
              ✕ End Call
            </Link>
          </div>

          {/* Pre-call checklist */}
          <div className="card mt-4 p-5">
            <h3 className="mb-3 font-bold text-neutral-800">Before you start 📋</h3>
            <ul className="space-y-2">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                  <span className="mt-0.5 text-brand-secondary-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </main>
      )}

      <BottomNav currentTab="explore" />
    </div>
  );
}
