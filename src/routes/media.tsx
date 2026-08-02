import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/media")({
  component: MediaPage,
});

const videos = [
  {
    title: "Global Mobilis — Version 1",
    url: "https://lbweneps5eo88ldi.private.blob.vercel-storage.com/708A24B5-F15E-4371-B37A-0242875978DB.MP4?vercel-blob-valid-until=1785692296432&vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfbEJXRW5FcHM1RW84OExESSIsIm93bmVySWQiOiJ0ZWFtXzBqS2JERnJkREdkMHF5bnBSbFlzck1EcCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzg1NzM1NDIxNTI4LCJpYXQiOjE3ODU2OTIyMjI1MTF9.1e-Ft9Y9VrH7ID6DFKtUVYAdYQea8eZWqkq5p-aAlsI&vercel-blob-signature=3S0tG18kwVf_fY7IomkfVVLWxpHah7wAnen9SspQIo0",
  },
  {
    title: "Global Mobilis — Version 2",
    url: "https://lbweneps5eo88ldi.private.blob.vercel-storage.com/EBE90EB5-352E-4242-9F0D-208892FFB95E.MP4?vercel-blob-valid-until=1785692483510&vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfbEJXRW5FcHM1RW84OExESSIsIm93bmVySWQiOiJ0ZWFtXzBqS2JERnJkREdkMHF5bnBSbFlzck1EcCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzg1NzM1NDIxNTI4LCJpYXQiOjE3ODU2OTIyMjI1MTF9.1e-Ft9Y9VrH7ID6DFKtUVYAdYQea8eZWqkq5p-aAlsI&vercel-blob-signature=pxNehI5UaYQxSuzldGQf87cKWt4SV1a27UMEWRY0lUM",
  },
];

function MediaPage() {
  return (
    <div className="min-h-screen bg-[var(--gm-bg)] pb-24">
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <div className="eyebrow">Media</div>
          <h1 className="mt-3 text-4xl font-bold text-neutral-700">
            Global Mobilis <span className="text-brand-secondary-500">Advertisements</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-neutral-500">
            Watch our promotional videos and share them with your network.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-12 px-4 py-12 sm:px-6">
        {/* Video Section */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-neutral-700">🎬 Promotional Videos</h2>
          <div className="space-y-8">
            {videos.map((video, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="bg-gradient-to-r from-brand-primary-600 to-brand-secondary-600 px-6 py-4">
                  <h3 className="text-lg font-bold text-white">{video.title}</h3>
                </div>
                <div className="bg-black">
                  <video
                    controls
                    className="mx-auto max-h-[500px] w-full"
                    poster="/logo.svg"
                    preload="metadata"
                  >
                    <source src={video.url} type="video/mp4" />
                    Your browser does not support the video element.
                  </video>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Share Section */}
        <section className="text-center">
          <h2 className="mb-4 text-xl font-bold text-neutral-700">📢 Share This Page</h2>
          <p className="mb-6 text-neutral-500">
            Help spread the word — share this page with your network.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "X (Twitter)", url: `https://twitter.com/intent/tweet?url=${encodeURIComponent("https://globalmobilis.com/media")}&text=${encodeURIComponent("Check out Global Mobilis — your all-in-one platform for global migration!")}` },
              { name: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://globalmobilis.com/media")}` },
              { name: "LinkedIn", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://globalmobilis.com/media")}` },
              { name: "Copy Link", url: "#", onClick: () => navigator.clipboard.writeText("https://globalmobilis.com/media") },
            ].map((btn) => (
              <a
                key={btn.name}
                href={btn.url}
                target={btn.url !== "#" ? "_blank" : undefined}
                rel={btn.url !== "#" ? "noopener noreferrer" : undefined}
                onClick={btn.onClick}
                className="rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-medium text-neutral-600 transition-all hover:border-brand-primary-300 hover:text-brand-primary-700 hover:shadow-md"
              >
                {btn.name === "Copy Link" ? "📋 Copy Link" : `🔗 ${btn.name}`}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
