import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";

export const Route = createFileRoute("/media")({
  component: MediaPage,
});

// ── Animated counter hook ──────────────────────────

function useCountUp(end: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

// ── Fade-in observer hook ───────────────────────────

function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.3) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

// ── Stats card ───────────────────────────────────────

function StatCard({ value, suffix, label, inView }: { value: number; suffix: string; label: string; inView: boolean }) {
  const count = useCountUp(value, 2000, inView);
  return (
    <div className="text-center">
      <div className="text-4xl font-extrabold text-white sm:text-5xl">
        {count}{suffix}
      </div>
      <div className="mt-1 text-sm text-white/70">{label}</div>
    </div>
  );
}

// ── Benefit row ──────────────────────────────────────

function Benefit({ icon, title, desc, delay }: { icon: string; title: string; desc: string; delay: string }) {
  return (
    <div
      className="flex items-start gap-4 opacity-0 animate-fade-in-up"
      style={{ animationDelay: delay, animationFillMode: "forwards" }}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl backdrop-blur">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-white/70">{desc}</p>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────

function MediaPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef);
  const statsInView = useInView(statsRef);

  return (
    <div className="min-h-screen bg-white pb-24">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-slide-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        .animate-slide-right {
          animation: slideInRight 0.8s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* ═══ HERO ═══ */}
      <div ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-[#0A1F3F] via-[#0E4F8B] to-[#0FA3A3]">
        {/* Background pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 lg:pt-36">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left text */}
            <div>
              <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                Now Available Worldwide
              </div>
              <h1 className="animate-fade-in-up mb-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                Your Global Journey{" "}
                <span className="bg-gradient-to-r from-[#F4B860] to-[#F47B53] bg-clip-text text-transparent">
                  Starts Here
                </span>
              </h1>
              <p className="animate-fade-in-up mb-8 text-lg leading-relaxed text-white/80" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                From researching destinations to building your new life abroad — Global Mobilis is the all-in-one platform trusted by thousands of expats, students, and global professionals.
              </p>
              <div className="animate-fade-in-up flex flex-wrap gap-4" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
                <a
                  href="/signup"
                  className="rounded-full bg-[#F4B860] px-8 py-3.5 text-sm font-bold text-[#0A1F3F] shadow-lg transition-all hover:bg-[#F47B53] hover:text-white hover:shadow-xl"
                >
                  Get Started Free
                </a>
                <a
                  href="/destinations"
                  className="rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20 hover:border-white/50"
                >
                  Explore Destinations →
                </a>
              </div>
            </div>

            {/* Right visual — animated globe card */}
            <div className="flex justify-center lg:justify-end">
              <div
                className={`relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 transition-all duration-1000 ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              >
                {/* Floating stat cards */}
                <div className="animate-float absolute -top-4 -left-4 rounded-2xl bg-white/10 backdrop-blur p-4 shadow-xl border border-white/20" style={{ animationDelay: "0s" }}>
                  <div className="text-2xl font-bold text-[#F4B860]">200+</div>
                  <div className="text-xs text-white/70">Destinations</div>
                </div>
                <div className="animate-float absolute -bottom-2 -right-2 rounded-2xl bg-white/10 backdrop-blur p-4 shadow-xl border border-white/20" style={{ animationDelay: "1s" }}>
                  <div className="text-2xl font-bold text-[#F47B53]">50K+</div>
                  <div className="text-xs text-white/70">Community Members</div>
                </div>
                <div className="animate-float absolute top-1/2 -right-8 rounded-2xl bg-white/10 backdrop-blur p-4 shadow-xl border border-white/20" style={{ animationDelay: "2s" }}>
                  <div className="text-2xl font-bold text-[#0FA3A3]">4.9★</div>
                  <div className="text-xs text-white/70">App Rating</div>
                </div>

                {/* Central globe */}
                <div className="flex h-full w-full items-center justify-center">
                  <div className="flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur">
                    <span className="text-8xl animate-float">🌍</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="white" d="M0 80L60 66.7C120 53.3 240 26.7 360 20C480 13.3 600 26.7 720 33.3C840 40 960 40 1080 33.3C1200 26.7 1320 13.3 1380 6.7L1440 0V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" />
          </svg>
        </div>
      </div>

      {/* ═══ STATS ═══ */}
      <div ref={statsRef} className="bg-white py-16">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-4 sm:grid-cols-4 sm:px-6">
          <StatCard value={200} suffix="+" label="Destinations" inView={statsInView} />
          <StatCard value={50} suffix="K+" label="Community Members" inView={statsInView} />
          <StatCard value={15} suffix="+" label="Countries" inView={statsInView} />
          <StatCard value={4.9} suffix="" label="App Rating" inView={statsInView} />
        </div>
      </div>

      {/* ═══ HOW IT WORKS ═══ */}
      <div className="bg-[#F0F9FF] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full bg-[#0FA3A3]/10 px-4 py-1.5 text-sm font-medium text-[#0FA3A3]">
              How It Works
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Three Steps to Your New Life
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              We've simplified global migration so you can focus on the exciting part — starting your next chapter.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "01", icon: "🔍", title: "Discover", desc: "Explore 200+ destinations with real data on jobs, housing, cost of living, and quality of life — all in one place.", color: "#0E4F8B" },
              { step: "02", icon: "🤝", title: "Connect", desc: "Join expat communities, find mentors, and chat with people who've already made the move. Real advice from real people.", color: "#0FA3A3" },
              { step: "03", icon: "🚀", title: "Move", desc: "Compare destinations side-by-side, access expert resources, and plan every aspect of your relocation with confidence.", color: "#F4B860" },
            ].map((item, i) => (
              <div
                key={item.step}
                className="group relative rounded-2xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.2}s`, animationFillMode: "forwards" }}
              >
                <div
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.step}
                </div>
                <div className="mb-2 text-2xl">{item.icon}</div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ BENEFITS ═══ */}
      <div className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full bg-[#0E4F8B]/10 px-4 py-1.5 text-sm font-medium text-[#0E4F8B]">
              Why Global Mobilis
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need, All in One Place
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              No more scattered research across dozens of websites. We bring it all together.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🌍", title: "200+ Destinations", desc: "Detailed guides on job markets, housing costs, education, and quality of life for cities worldwide." },
              { icon: "💬", title: "Built-in Translation", desc: "Real-time translation in messages and calls so you can connect across any language barrier." },
              { icon: "👥", title: "Expat Communities", desc: "Find your people before you even arrive — join groups, attend events, and build your network." },
              { icon: "📊", title: "Side-by-Side Compare", desc: "Compare cost of living, safety, job markets, and more across any two destinations." },
              { icon: "💼", title: "Job Network", desc: "Discover international opportunities and connect with employers who value global talent." },
              { icon: "🎓", title: "Education Pathways", desc: "Research universities, visa requirements, and scholarships for students worldwide." },
            ].map((b, i) => (
              <div
                key={b.title}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "forwards" }}
              >
                <div className="mb-3 text-3xl">{b.icon}</div>
                <h3 className="mb-1 text-base font-bold text-gray-900">{b.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ PHOTO SHOWCASE ═══ */}
      <div className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-[#0FA3A3]/10 px-4 py-1.5 text-sm font-medium text-[#0FA3A3]">
              App Preview
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Inside Global Mobilis
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Take a peek at the platform that's helping thousands make their move.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {[
              {
                src: "https://nyz3d0uniiwojldf.public.blob.vercel-storage.com/Global%20mobilis%20new%20videos/20260802_194200_36a67560.PNG",
                alt: "Global Mobilis app screenshot - destinations",
                caption: "Explore 200+ destinations with detailed guides",
              },
              {
                src: "https://nyz3d0uniiwojldf.public.blob.vercel-storage.com/Global%20mobilis%20new%20videos/20260802_201220_6e3d0fe0.PNG",
                alt: "Global Mobilis app screenshot - community",
                caption: "Connect with expat communities worldwide",
              },
            ].map((img, i) => (
              <div
                key={img.alt}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.2}s`, animationFillMode: "forwards" }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="border-t border-gray-100 px-6 py-4">
                  <p className="text-sm text-gray-600">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ PROMO VIDEOS ═══ */}
      <div ref={videoRef} id="videos" className="bg-[#F0F9FF] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-[#F47B53]/10 px-4 py-1.5 text-sm font-medium text-[#F47B53]">
              Watch & Share
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              See It In Action
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Watch our promotional spots and share them with friends considering a move abroad.
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                title: "Global Mobilis — Version 1",
                url: "https://nyz3d0uniiwojldf.public.blob.vercel-storage.com/Global%20mobilis%20new%20videos/1e084fc3de3841764b68540e9e0373f4.MP4",
              },
              {
                title: "Global Mobilis — Version 2",
                url: "https://nyz3d0uniiwojldf.public.blob.vercel-storage.com/Global%20mobilis%20new%20videos/ac33be5929f8383cb53f6e7630275b6e.MP4",
              },
            ].map((video) => (
              <div key={video.title} className="overflow-hidden rounded-2xl bg-white shadow-lg">
                <div className="bg-gradient-to-r from-[#0E4F8B] to-[#0FA3A3] px-6 py-4">
                  <h3 className="text-lg font-bold text-white">{video.title}</h3>
                </div>
                <div className="bg-black">
                  <video controls className="mx-auto max-h-[500px] w-full" preload="metadata">
                    <source src={video.url} type="video/mp4" />
                  </video>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CTA ═══ */}
      <div className="bg-gradient-to-br from-[#0E4F8B] to-[#0FA3A3] py-16 text-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Ready to Start Your Global Journey?
          </h2>
          <p className="mb-8 text-lg text-white/80">
            Join thousands of expats, students, and professionals who've made the move with Global Mobilis.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/signup"
              className="rounded-full bg-[#F4B860] px-8 py-3.5 text-sm font-bold text-[#0A1F3F] shadow-lg transition-all hover:bg-[#F47B53] hover:text-white"
            >
              Get Started Free
            </a>
            <a
              href="/destinations"
              className="rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
            >
              Browse Destinations
            </a>
          </div>

          {/* Share row */}
          <div className="mt-12 border-t border-white/20 pt-8">
            <p className="mb-4 text-sm text-white/60">Share with your network</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "X (Twitter)", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent("https://globalmobilis.com/media")}&text=${encodeURIComponent("Your global journey starts here — discover 200+ destinations with Global Mobilis 🌍")}` },
                { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://globalmobilis.com/media")}` },
                { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://globalmobilis.com/media")}` },
                { label: "Copy Link", href: "#", onClick: (e: React.MouseEvent) => { e.preventDefault(); navigator.clipboard.writeText("https://globalmobilis.com/media"); } },
              ].map((btn) => (
                <a
                  key={btn.label}
                  href={btn.href}
                  target={btn.label !== "Copy Link" ? "_blank" : undefined}
                  rel={btn.label !== "Copy Link" ? "noopener noreferrer" : undefined}
                  onClick={btn.onClick as any}
                  className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur transition-all hover:bg-white/20 hover:border-white/50"
                >
                  {btn.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
