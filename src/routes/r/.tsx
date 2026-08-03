import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/r/$code")({
  component: ReferralRedirect,
});

function ReferralRedirect() {
  const { code } = Route.useParams();

  useEffect(() => {
    // Record click via API, then redirect to signup
    fetch("/api/referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    }).finally(() => {
      window.location.href = `/signup?ref=${encodeURIComponent(code)}`;
    });
  }, [code]);

  return (
    <div className="flex min-h-[80dvh] items-center justify-center">
      <div className="text-center">
        <div className="mb-4 animate-bounce text-5xl">🌍</div>
        <p className="text-lg text-gray-600">Taking you to Global Mobilis...</p>
      </div>
    </div>
  );
}
