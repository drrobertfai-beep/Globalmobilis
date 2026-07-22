import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-12 text-center">
        <span className="mb-4 inline-block rounded-full bg-[#0E4F8B]/10 px-4 py-1.5 text-sm font-medium text-[#0E4F8B]">
          About Us
        </span>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Our Mission
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Making global mobility accessible, simple, and human.
        </p>
      </div>

      <div className="space-y-8">
        <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="mb-3 text-xl font-bold text-gray-900">Who We Are</h2>
          <p className="leading-relaxed text-gray-600">
            Global Mobilis was founded on a simple belief: moving abroad
            shouldn't be overwhelming. We're building the first all-in-one
            platform that simplifies every aspect of international migration
            and global networking — from researching destinations to finding
            your community.
          </p>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="mb-3 text-xl font-bold text-gray-900">Our Vision</h2>
          <p className="leading-relaxed text-gray-600">
            We envision a world where borders are no barrier to opportunity.
            Whether you're moving for work, study, or a new chapter in life,
            Global Mobilis gives you the tools, data, and community to make
            your move with confidence.
          </p>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="mb-3 text-xl font-bold text-gray-900">Our Values</h2>
          <ul className="space-y-3">
            {[
              {
                title: "Accessibility",
                desc: "Free core tools for everyone, everywhere.",
              },
              {
                title: "Community First",
                desc: "Real connections with verified expats and locals.",
              },
              {
                title: "Data-Driven",
                desc: "Accurate, up-to-date information you can trust.",
              },
              {
                title: "Privacy & Security",
                desc: "Your data stays yours — always.",
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#0FA3A3]" />
                <div>
                  <strong className="text-gray-900">{item.title}:</strong>{" "}
                  <span className="text-gray-600">{item.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/contact"
          className="inline-block rounded-full bg-[#0E4F8B] px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#1B7A9B]"
        >
          Get in Touch
        </Link>
      </div>
    </div>
  );
}