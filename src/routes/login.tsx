import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { logIn } from "~/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await logIn({ email, password }) as any;
      if (result.success) {
        setSuccess(true);
        // Set cookie and redirect
        document.cookie = result.cookie;
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500);
      } else {
        setError(result.error || "Login failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-16">
        <div className="w-full rounded-2xl border border-[#0FA3A3]/20 bg-[#0FA3A3]/5 p-8 text-center">
          <div className="mb-3 text-4xl">✅</div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">Welcome back!</h2>
          <p className="mb-4 text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-16">
      <div className="w-full">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your Global Mobilis account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0E4F8B] focus:outline-none focus:ring-2 focus:ring-[#0E4F8B]/20"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0E4F8B] focus:outline-none focus:ring-2 focus:ring-[#0E4F8B]/20"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#0E4F8B] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#1B7A9B] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-[#0E4F8B] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}