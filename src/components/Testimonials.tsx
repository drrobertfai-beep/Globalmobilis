/**
 * Honest version of the social-proof section.
 *
 * This component previously rendered three invented testimonials (Ana Silva,
 * Marcus Chen, Priya Patel) plus a fabricated stats bar — "500+ Waitlist
 * Signups", "4.9/5 Early Tester Rating", "200+ Destinations Researched",
 * "15+ Countries Represented". None of it was true: the business has no
 * external customers and no waitlist figures.
 *
 * Fabricated testimonials are not a placeholder — they are a lie told to
 * someone deciding whether to trust us with their relocation. Until there are
 * real, attributable customer words with permission to publish them, this
 * section states only what can be verified in the codebase.
 */

const verifiedFacts = [
  {
    value: "36",
    label: "Destinations researched",
    detail: "Real cost-of-living, housing and job-market data",
    color: "#0E4F8B",
  },
  {
    value: "31",
    label: "Countries covered",
    detail: "Across North America, Europe, Asia-Pacific and the Gulf",
    color: "#0FA3A3",
  },
  {
    value: "8",
    label: "Visa pathways, step by step",
    detail: "Costs, timelines and documents for each route",
    color: "#F4B860",
  },
];

export function Testimonials() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-[#F47B53]/10 px-4 py-1.5 text-sm font-medium text-[#F47B53]">
            Early days
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            We're just getting started
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Global Mobilis is new, so there are no customer stories here yet. We
            would rather leave this space empty than fill it with reviews nobody
            wrote. Here is what genuinely exists today — you can verify every
            number by using the site.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {verifiedFacts.map((item) => (
            <div
              key={item.label}
              className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className="mb-4 text-3xl font-bold"
                style={{ color: item.color }}
              >
                {item.value}
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {item.label}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-600">
            If you are planning a move and something here is wrong, out of date,
            or missing — tell us at{" "}
            <a
              href="mailto:hello@globalmobilis.com"
              className="font-medium text-[#0E4F8B] underline"
            >
              hello@globalmobilis.com
            </a>
            . Early corrections shape the product more than anything else.
          </p>
        </div>
      </div>
    </section>
  );
}
