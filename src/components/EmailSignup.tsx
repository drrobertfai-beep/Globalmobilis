import { useState } from "react";
import { submitToWaitlist } from "~/components/Waitlist";

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const result = await submitToWaitlist({ email, name });

      if (result.success) {
        setStatus("success");
        setMessage("You're on the list! We'll be in touch soon.");
        setEmail("");
        setName("");
      } else {
        setStatus("error");
        setMessage(result.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      {status === "success" ? (
        <div className="rounded-2xl border border-[#0FA3A3]/20 bg-[#0FA3A3]/5 p-8 text-center">
          <div className="mb-3 text-4xl">🎉</div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            You're on the List!
          </h3>
          <p className="text-gray-600">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="signup-name"
                className="mb-1 block text-left text-sm font-medium text-gray-700"
              >
                Name <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                id="signup-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white/90 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-[#0E4F8B] focus:outline-none focus:ring-2 focus:ring-[#0E4F8B]/20"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label
                htmlFor="signup-email"
                className="mb-1 block text-left text-sm font-medium text-gray-700"
              >
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="signup-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 bg-white/90 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-[#0E4F8B] focus:outline-none focus:ring-2 focus:ring-[#0E4F8B]/20"
                placeholder="jane@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-full bg-[#0E4F8B] px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#1B7A9B] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Signing up...
              </span>
            ) : (
              "Join the Waitlist"
            )}
          </button>

          {status === "error" && (
            <p className="text-sm text-red-500">{message}</p>
          )}

          <p className="text-xs text-gray-400">
            No spam, ever. We'll only email you about your early access.
          </p>
        </form>
      )}
    </div>
  );
}