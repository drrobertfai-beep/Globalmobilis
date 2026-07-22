const testimonials = [
  {
    quote:
      "Global Mobilis made my move from Brazil to Canada so much easier. Having all the info about housing, jobs, and the expat community in one place saved me months of research.",
    name: "Ana Silva",
    location: "São Paulo → Toronto",
    avatar: "AS",
    color: "#0E4F8B",
  },
  {
    quote:
      "The translation feature is a game-changer. I was able to connect with a mentor in Germany before I even arrived, and we communicated effortlessly despite the language barrier.",
    name: "Marcus Chen",
    location: "Singapore → Berlin",
    avatar: "MC",
    color: "#0FA3A3",
  },
  {
    quote:
      "As a digital nomad, I've moved 12 times in 5 years. Global Mobilis would have saved me countless hours of scattered research. Can't wait for the full launch!",
    name: "Priya Patel",
    location: "Digital Nomad",
    avatar: "PP",
    color: "#F4B860",
  },
];

export function Testimonials() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-[#F47B53]/10 px-4 py-1.5 text-sm font-medium text-[#F47B53]">
            Testimonials
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by Global Citizens
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Here's what early testers and community members are saying about
            Global Mobilis.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Quote mark */}
              <div
                className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ backgroundColor: item.color }}
              >
                "
              </div>

              {/* Quote */}
              <p className="mb-6 text-sm leading-relaxed text-gray-600">
                "{item.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500">{item.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof bar */}
        <div className="mt-12 rounded-2xl border border-gray-100 bg-gray-50 p-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-[#0E4F8B]">500+</div>
              <div className="text-xs text-gray-500">Waitlist Signups</div>
            </div>
            <div className="hidden h-8 w-px bg-gray-200 sm:block" />
            <div>
              <div className="text-2xl font-bold text-[#0FA3A3]">200+</div>
              <div className="text-xs text-gray-500">Destinations Researched</div>
            </div>
            <div className="hidden h-8 w-px bg-gray-200 sm:block" />
            <div>
              <div className="text-2xl font-bold text-[#F4B860]">4.9/5</div>
              <div className="text-xs text-gray-500">Early Tester Rating</div>
            </div>
            <div className="hidden h-8 w-px bg-gray-200 sm:block" />
            <div>
              <div className="text-2xl font-bold text-[#F47B53]">15+</div>
              <div className="text-xs text-gray-500">Countries Represented</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}