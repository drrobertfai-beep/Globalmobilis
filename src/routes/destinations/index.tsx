import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getDestinations, getContinents, searchDestinations } from "~/lib/destinations";
import type { Destination } from "~/db.types";

export const Route = createFileRoute("/destinations/")({
  component: DestinationsPage,
});

function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [continents, setContinents] = useState<string[]>([]);
  const [activeContinent, setActiveContinent] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDestinations();
    getContinents().then((data) => setContinents(data as unknown as string[]));
  }, []);

  const loadDestinations = async (continent?: string) => {
    setLoading(true);
    const data = await getDestinations(continent ? { continent } : {}) as unknown as Destination[];
    setDestinations(data);
    setLoading(false);
  };

  const handleContinentClick = (continent: string) => {
    if (continent === activeContinent) {
      setActiveContinent("");
      loadDestinations();
    } else {
      setActiveContinent(continent);
      loadDestinations(continent);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) {
      loadDestinations(activeContinent || undefined);
      return;
    }
    setLoading(true);
    const data = await searchDestinations({ query: searchQuery }) as unknown as Destination[];
    setDestinations(data);
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">
          Explore Destinations
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600">
          Discover cities and countries around the world. Compare scores, cost of living, and quality of life.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search cities or countries..."
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0E4F8B] focus:outline-none focus:ring-2 focus:ring-[#0E4F8B]/20"
          />
          <button
            onClick={handleSearch}
            className="rounded-lg bg-[#0E4F8B] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#1B7A9B]"
          >
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleContinentClick("")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              !activeContinent
                ? "bg-[#0E4F8B] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {continents.map((continent) => (
            <button
              key={continent}
              onClick={() => handleContinentClick(continent)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                activeContinent === continent
                  ? "bg-[#0E4F8B] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {continent}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-3xl">{dest.flag_emoji}</span>
                {dest.is_featured && (
                  <span className="rounded-full bg-[#F4B860]/15 px-2.5 py-0.5 text-xs font-medium text-[#B8860B]">
                    Featured
                  </span>
                )}
              </div>
              <h3 className="mb-1 text-xl font-bold text-gray-900">{dest.city}</h3>
              <p className="mb-1 text-sm text-gray-500">{dest.country}</p>
              <p className="mb-4 text-xs text-gray-400">{dest.continent}</p>

              <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
                {dest.short_description}
              </p>

              {/* Score badges */}
              <div className="mb-4 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">
                  💼 {dest.job_score}
                </span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                  🏠 {dest.quality_of_life_score}
                </span>
                <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-xs text-yellow-700">
                  💰 {dest.cost_of_living_index}
                </span>
                <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-700">
                  🎓 {dest.education_score}
                </span>
              </div>

              {/* Cost snapshot */}
              <div className="mb-4 border-t border-gray-50 pt-3 text-xs text-gray-500">
                <span className="font-medium text-gray-700">Rent (1BR):</span> ${dest.avg_rent_1br}/mo
              </div>

              <Link
                to="/destinations/$id"
                params={{ id: dest.id }}
                className="inline-block rounded-full bg-[#0E4F8B]/10 px-4 py-1.5 text-xs font-medium text-[#0E4F8B] transition-all hover:bg-[#0E4F8B] hover:text-white"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}

      {!loading && destinations.length === 0 && (
        <div className="py-16 text-center text-gray-500">
          No destinations found. Try a different search.
        </div>
      )}
    </div>
  );
}