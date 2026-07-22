import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";
import { LogoIcon } from "~/components/Logo";
import { FeatureCard } from "~/components/FeatureCard";
import { Testimonials } from "~/components/Testimonials";
import { EmailSignup } from "~/components/EmailSignup";

const getBusinessName = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const cfg = JSON.parse(await readFile("site.json", "utf8")) as {
      businessName?: string;
    };
    return cfg.businessName?.trim() ?? "";
  } catch {
    return "";
  }
});

export const Route = createFileRoute("/")({
  loader: () => getBusinessName(),
  component: Home,
});

const features = [
  {
    icon: "🌍",
    title: "Destination Intelligence",
    description:
      "Get personalized insights on job markets, housing costs, education, and quality of life for any destination worldwide.",
    accentColor: "#0E4F8B",
  },
  {
    icon: "🤝",
    title: "Expat Communities",
    description:
      "Connect with verified expat networks, local mentors, and fellow global citizens who've made the move before you.",
    accentColor: "#0FA3A3",
  },
  {
    icon: "💬",
    title: "Seamless Translation",
    description:
      "Built-in messaging and calling with real-time translation — communicate across languages without barriers.",
    accentColor: "#F4B860",
  },
  {
    icon: "🏠",
    title: "Cost of Living Tools",
    description:
      "Compare housing, utilities, groceries, and more across cities to budget your move with confidence.",
    accentColor: "#F47B53",
  },
  {
    icon: "💼",
    title: "Job & Business Network",
    description:
      "Discover international job opportunities, connect with global employers, and find business partners abroad.",
    accentColor: "#1B7A9B",
  },
  {
    icon: "🎓",
    title: "Education Pathways",
    description:
      "Research universities, visa requirements, and scholarship opportunities for students worldwide.",
    accentColor: "#0E4F8B",
  },
];

function Home() {
  const businessName = Route.useLoaderData();

  return (
    <div>
      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F9FF] via-white to-white">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-[#0E4F8B]/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#0FA3A3]/5 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:pb-32">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0FA3A3]/20 bg-[#0FA3A3]/5 px-4 py-1.5 text-sm font-medium text-[#0FA3A3]">
                <span className="h-2 w-2 rounded-full bg-[#0FA3A3] animate-pulse" />
                Coming Soon
              </div>

              <h1 className="animate-fade-in-up mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                {businessName || "Global Mobilis"}
              </h1>

              <p className="animate-fade-in-up-delay-1 mx-auto mb-8 max-w-xl text-lg leading-relaxed text-gray-600 lg:mx-0">
                The all-in-one platform that simplifies global migration and
                international networking. Discover destinations, connect with
                expat communities, and navigate your move abroad — all in one
                place.
              </p>

              <div className="animate-fade-in-up-delay-2 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                <Link
                  to="/contact"
                  className="rounded-full bg-[#0E4F8B] px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#1B7A9B] hover:shadow-xl"
                >
                  Get Early Access
                </Link>
                <Link
                  to="/features"
                  className="rounded-full border border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:shadow-md"
                >
                  Explore Features
                </Link>
              </div>

              {/* Stats */}
              <div className="animate-fade-in-up-delay-3 mt-10 flex flex-wrap justify-center gap-8 border-t border-gray-100 pt-8 lg:justify-start">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-[#0E4F8B]">200+</div>
                  <div className="text-xs text-gray-500">Destinations</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-[#0FA3A3]">50K+</div>
                  <div className="text-xs text-gray-500">Community Members</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-[#F4B860]">100%</div>
                  <div className="text-xs text-gray-500">Free to Join</div>
                </div>
              </div>
            </div>

            {/* Logo / Visual */}
            <div className="flex-1 animate-float">
              <div className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80 lg:h-96 lg:w-96">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0E4F8B]/10 to-[#0FA3A3]/10 blur-2xl" />
                <LogoIcon size={280} className="relative" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="bg-white py-20 sm:py-28" id="features">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full bg-[#0E4F8B]/10 px-4 py-1.5 text-sm font-medium text-[#0E4F8B]">
              Everything You Need
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Your Global Journey, Simplified
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              From researching your destination to building your new community,
              Global Mobilis brings every tool together in one seamless
              experience.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="bg-[#F0F9FF] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full bg-[#0FA3A3]/10 px-4 py-1.5 text-sm font-medium text-[#0FA3A3]">
              Simple Process
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Moving abroad has never been easier. Get started in three simple
              steps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Choose Your Destination",
                description:
                  "Explore detailed guides on job markets, cost of living, housing, education, and visa requirements for hundreds of cities worldwide.",
                color: "#0E4F8B",
              },
              {
                step: "02",
                title: "Connect with the Community",
                description:
                  "Join expat groups, find mentors, and chat with locals who've made the move. Get real advice from real people.",
                color: "#0FA3A3",
              },
              {
                step: "03",
                title: "Make Your Move Confidently",
                description:
                  "Access expert resources, compare options, and use our tools to plan every aspect of your international relocation.",
                color: "#F4B860",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group rounded-2xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Testimonials / Social Proof ===== */}
      <Testimonials />

      {/* ===== Early Access Signup ===== */}
      <section className="bg-gm-gradient py-20 sm:py-28" id="signup">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white">
            Limited Early Access
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Be the First to Experience Global Mobilis
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80">
            Join our waitlist and get priority access when we launch. Early
            members get exclusive perks and lifetime discounts.
          </p>
          <EmailSignup />
        </div>
      </section>
    </div>
  );
}