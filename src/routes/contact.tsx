import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-12 text-center">
        <span className="mb-4 inline-block rounded-full bg-[#0E4F8B]/10 px-4 py-1.5 text-sm font-medium text-[#0E4F8B]">
          Get in Touch
        </span>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Join the Waitlist
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          We're building something amazing. Be the first to know when we launch.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Contact Form */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            Send Us a Message
          </h2>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const name = formData.get("name") as string;
              const email = formData.get("email") as string;
              const message = formData.get("message") as string;
              window.location.href = `mailto:hello@globalmobilis.com?subject=Waitlist Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            }}
          >
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-[#0E4F8B] focus:outline-none focus:ring-2 focus:ring-[#0E4F8B]/20"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-[#0E4F8B] focus:outline-none focus:ring-2 focus:ring-[#0E4F8B]/20"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-[#0E4F8B] focus:outline-none focus:ring-2 focus:ring-[#0E4F8B]/20"
                placeholder="Tell us about your plans..."
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-[#0E4F8B] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#1B7A9B] hover:shadow-xl"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Other Ways to Reach Us
            </h2>
            <div className="space-y-4">
              {[
                {
                  icon: "📧",
                  label: "Email",
                  value: "hello@globalmobilis.com",
                  href: "mailto:hello@globalmobilis.com",
                },
                {
                  icon: "🐦",
                  label: "Twitter / X",
                  value: "@globalmobilis",
                  href: "https://x.com/globalmobilis",
                },
                {
                  icon: "💼",
                  label: "LinkedIn",
                  value: "Global Mobilis",
                  href: "https://linkedin.com/company/globalmobilis",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="mt-0.5 text-xl">{item.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      {item.label}
                    </div>
                    <a
                      href={item.href}
                      className="text-sm font-medium text-[#0E4F8B] transition-colors hover:text-[#1B7A9B]"
                    >
                      {item.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#0E4F8B] to-[#0FA3A3] p-8 text-white">
            <h3 className="mb-2 text-lg font-bold">
              Join Our Early Access List
            </h3>
            <p className="mb-4 text-sm text-white/80">
              Be the first to try Global Mobilis. Early access members get
              exclusive perks and priority onboarding.
            </p>
            <a
              href="mailto:hello@globalmobilis.com?subject=Early Access Request&body=I'd like early access to Global Mobilis!"
              className="inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#0E4F8B] transition-all hover:brightness-95"
            >
              Request Early Access
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}