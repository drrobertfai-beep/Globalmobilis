import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { resetPassword } from "~/lib/auth";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, unknown>) => {
    return { token: (search.token as string) || "" };
  },
});

function ResetPasswordPage() {
  const { token } = useSearch({ from: "/reset-password" }) as { token: string };
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const result = await resetPassword({ token, newPassword });
      if (result.success) {
        setStatus("success");
        setMessage(result.message || "Password has been reset.");
      } else {
        setStatus("error");
        setMessage(result.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Failed to reset password. Please try again.");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white pt-24 pb-16">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm text-center">
            <span className="text-5xl">🔗</span>
            <h1 className="mt-4 text-xl font-bold text-neutral-700">Invalid Reset Link</h1>
            <p className="mt-2 text-sm text-neutral-500">
              This reset link is invalid or missing. Please request a new one.
            </p>
            <Link
              to="/forgot-password"
              className="mt-6 inline-block btn-primary"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white pt-24 pb-16">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-neutral-700">Set New Password</h1>
            <p className="mt-2 text-sm text-neutral-500">
              Enter your new password below.
            </p>
          </div>

          {status === "success" ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">
                {message}
              </div>
              <Link
                to="/login"
                className="btn-primary block w-full text-center"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === "error" && (
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{message}</div>
              )}
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input w-full text-sm"
                  placeholder="At least 8 characters"
                  required
                  autoFocus
                  minLength={8}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input w-full text-sm"
                  placeholder="Re-enter your password"
                  required
                  minLength={8}
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary w-full"
              >
                {status === "loading" ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
