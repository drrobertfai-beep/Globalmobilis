import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { requestPasswordReset } from "~/lib/auth";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [devLink, setDevLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const result = await requestPasswordReset({ email });
      if (result.success) {
        setStatus("success");
        setMessage(result.message || "Check your email for a reset link.");
        if (result.devLink) setDevLink(result.devLink);
      } else {
        setStatus("error");
        setMessage(result.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white pt-24 pb-16">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-neutral-700">Reset Your Password</h1>
            <p className="mt-2 text-sm text-neutral-500">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {status === "success" ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">
                {message}
              </div>
              {devLink && (
                <div className="rounded-xl bg-blue-50 p-4 text-xs text-blue-700 break-all">
                  <strong>Dev:</strong>{" "}
                  <a href={devLink} className="underline">
                    {devLink}
                  </a>
                </div>
              )}
              <Link
                to="/login"
                className="btn-primary block w-full text-center"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === "error" && (
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{message}</div>
              )}
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full text-sm"
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary w-full"
              >
                {status === "loading" ? "Sending..." : "Send Reset Link"}
              </button>
              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-brand-primary-500 hover:underline"
                >
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
