import { createFileRoute } from "@tanstack/react-router";
import { FeatureCard } from "~/components/FeatureCard";

export const Route = createFileRoute("/features")({
  component: FeaturesPage,
});

const featureGroups = [
  {
    section: "Destination Intelligence",
    description: "Everything you need to research your next home.",
    features: [
      {
        icon: "🌍",
        title: "City & Country Guides",
        description:
          "In-depth profiles for 200+ destinations covering job markets, housing, culture, and more.",
        accentColor: "#0E4F8B",
      },
      {
        icon: "💰",
        title: "Cost of Living Calculator",
        description:
          "Compare expenses across cities — rent, groceries, utilities, transport, and entertainment.",
        accentColor: "#0FA3A3",
      },
      {
        icon: "🏫",
        title: "Education Hub",
        description:
          "Research universities, language schools, and international programs with visa guidance.",
        accentColor: "#F4B860",
      },
    ],
  },
  {
    section: "Community & Networking",
    description: "Build your global network before you arrive.",
    features: [
      {
        icon: "🤝",
        title: "Expat Groups",
        description:
          "Join or create groups based on destination, interests, profession, or background.",
        accentColor: "#1B7A9B",
      },
      {
        icon: "👤",
        title: "Mentorship Matching",
        description:
          "Get paired with experienced expats who can guide you through your relocation journey.",
        accentColor: "#0E4F8B",
      },
      {
        icon: "📅",
        title: "Local Events",
        description:
          "Discover and attend meetups, cultural events, and networking opportunities near you.",
        accentColor: "#F47B53",
      },
    ],
  },
  {
    section: "Communication Tools",
    description: "Stay connected across languages and time zones.",
    features: [
      {
        icon: "💬",
        title: "Smart Messaging",
        description:
          "Chat with community members with built-in real-time translation in 50+ languages.",
        accentColor: "#0FA3A3",
      },
      {
        icon: "📞",
        title: "Voice & Video Calls",
        description:
          "High-quality calls with live translation captions — talk naturally across languages.",
        accentColor: "#0E4F8B",
      },
      {
        icon: "🔔",
        title: "Smart Notifications",
        description:
          "Get alerts on visa changes, job openings, housing listings, and community activity.",
        accentColor: "#F4B860",
      },
    ],
  },
  {
    section: "Premium Features",
    description: "Unlock the full power of Global Mobilis.",
    features: [
      {
        icon: "⭐",
        title: "Expert Consultations",
        description:
          "One-on-one video calls with immigration lawyers, relocation specialists, and career coaches.",
        accentColor: "#F4B860",
      },
      {
        icon: "📊",
        title: "Advanced Reports",
        description:
          "Detailed market analyses, salary benchmarks, and neighborhood reports for your shortlisted cities.",
        accentColor: "#0E4F8B",
      },
      {
        icon: "🎯",
        title: "Priority Support",
        description:
          "24/7 dedicated support with faster response times and personalized assistance.",
        accentColor: "#0FA3A3",
      },
    ],
  },
];

function FeaturesPage() {
  return (
    <div className="pb-20 pt-12 sm:pb-28 sm:pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-[#0E4F8B]/10 px-4 py-1.5 text-sm font-medium text-[#0E4F8B]">
            Features
          </span>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need, All in One Place
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            From planning your move to building your new life abroad — Global
            Mobilis has you covered.
          </p>
        </div>

        {/* Feature Groups */}
        {featureGroups.map((group) => (
          <section key={group.section} className="mb-16">
            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                {group.section}
              </h2>
              <p className="text-gray-600">{group.description}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </section>
        ))}

        {/* Pricing teaser */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0E4F8B] to-[#0FA3A3] p-8 text-center text-white sm:p-12">
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
            Start Free, Upgrade When You're Ready
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-white/80">
            All core features are free forever. Premium plans start at just
            $9.99/month for advanced tools and expert consultations.
          </p>
          <a
            href="mailto:hello@globalmobilis.com"
            className="inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#0E4F8B] shadow-lg transition-all hover:shadow-xl hover:brightness-95"
          >
            Join the Waitlist
          </a>
        </div>
      </div>
    </div>
  );
}