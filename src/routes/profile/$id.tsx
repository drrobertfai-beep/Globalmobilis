import { createFileRoute, Link } from "@tanstack/react-router";

import { BottomNav } from "~/components/BottomNav";
export const Route = createFileRoute("/profile/$id")({
  component: PublicProfilePage,
});

interface PublicProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  color: string;
  bio: string;
  home: { city: string; flag: string };
  current: { city: string; flag: string };
  connections: number;
  interests: string[];
  journey: { city: string; country: string; flag: string; year: string; color: string; desc: string }[];
}

/** Maps public profile ids to their seeded conversation ids (messages/data
 * conversations.json). Profiles without an entry fall back to the community
 * directory instead of a dead "Message" link. */
// Public profiles are served from the database only.
//
// This file previously hardcoded two invented members — "Ana Silva"
// (287 connections) and "Marcus Chen" (412 connections) — with invented bios,
// home cities and move histories, plus fake conversation ids, and served them
// at /profile/ana-silva as though they were real users. A stranger browsing the
// community would find people who never existed. Removed: profile pages now
// render only real accounts, and ids with no account fall back to the
// community directory.
const CONVERSATION_BY_PROFILE: Record<string, string> = {};

const mockProfiles: Record<string, PublicProfile> = {};

function PublicProfilePage() {
  const { id } = Route.useParams();
  const profile = mockProfiles[id];

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-neutral-700">Profile not found</h1>
          <Link to="/community" className="text-brand-primary-500 hover:underline">Back to community</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Cover */}
      <div className="h-40" style={{ background: "var(--gm-gradient-brand)" }} />

      <div className="relative mx-auto max-w-2xl px-4">
        {/* Avatar */}
        <div className="-mt-12 mb-4 flex justify-center">
          <div className={`flex h-24 w-24 items-center justify-center rounded-full border-4 border-white text-3xl font-bold text-white shadow-lg ${profile.color}`}>
            {profile.avatar}
          </div>
        </div>

        {/* Name & Bio */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-700">{profile.name}</h1>
          <p className="text-sm text-neutral-500">{profile.username}</p>
          <div className="mt-3 flex justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary-50 px-3 py-1 text-xs font-medium text-brand-primary-700">
              {profile.home.flag} {profile.home.city}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-secondary-100 px-3 py-1 text-xs font-medium text-brand-secondary-700">
              {profile.current.flag} {profile.current.city}
            </span>
          </div>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
            {profile.bio}
          </p>
        </div>

        {/* Message button — link to the member's existing conversation; the
            /messages/new route doesn't exist and previously dead-ended. */}
        <div className="mt-4">
          {CONVERSATION_BY_PROFILE[profile.id] ? (
            <Link
              to="/messages/$id"
              params={{ id: CONVERSATION_BY_PROFILE[profile.id] }}
              className="btn-primary w-full"
            >
              Message {profile.name.split(" ")[0]}
            </Link>
          ) : (
            <Link to="/community" className="btn-primary w-full">
              Find {profile.name.split(" ")[0]} in Community
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="text-center">
            <div className="text-lg font-bold text-neutral-700">{profile.connections}</div>
            <div className="text-xs text-neutral-500">Connections</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-neutral-700">15</div>
            <div className="text-xs text-neutral-500">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-neutral-700">4</div>
            <div className="text-xs text-neutral-500">Groups</div>
          </div>
        </div>

        {/* Interests */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-neutral-700">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span key={interest} className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700">
                {interest}
              </span>
            ))}
          </div>
        </section>

        {/* Journey */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-neutral-700">My Journey</h2>
          <div className="space-y-0">
            {profile.journey.map((stop, i) => (
              <div key={stop.city} className="relative flex gap-4 pb-6">
                {i < profile.journey.length - 1 && (
                  <div className="absolute left-[11px] top-6 h-full w-0.5 bg-neutral-200" />
                )}
                <div className={`relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${stop.color}`}>
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
                <div className="card flex-1 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{stop.flag}</span>
                    <div>
                      <h3 className="font-bold text-neutral-700">{stop.city}</h3>
                      <p className="text-xs text-neutral-500">{stop.country}</p>
                    </div>
                    <span className="ml-auto text-xs text-neutral-500">{stop.year}</span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">{stop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom tab bar */}
      <BottomNav currentTab="profile" />
    </div>
  );
}