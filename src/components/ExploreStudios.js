"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Search, X } from "lucide-react";
import toast from "react-hot-toast";

import { apiRequest } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import StudioCard from "./StudioCard";
import StudioCardSkeleton from "./StudioCardSkeleton";
import EmptyState from "./EmptyState";

const SORT_OPTIONS = [
  { value: "", label: "Sort: Featured" },
  { value: "priceLow", label: "Price: Low → High" },
  { value: "priceHigh", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest First" },
];

export default function ExploreStudios() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL is the single source of truth for category (deep-linkable)
  const urlCategory = searchParams.get("category") || "";
  const [category, setCategory] = useState(urlCategory);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [studios, setStudios] = useState(null);
  const [loading, setLoading] = useState(true);
  const first = useRef(true);

  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  const load = async (opts = {}) => {
    const q = new URLSearchParams();
    if (opts.search ?? search) q.set("search", opts.search ?? search);
    if (opts.category ?? category) q.set("category", opts.category ?? category);
    if (opts.sort ?? sort) q.set("sort", opts.sort ?? sort);
    setLoading(true);
    try {
      const data = await apiRequest(`/studios${q.toString() ? `?${q}` : ""}`);
      setStudios(data);
    } catch (err) {
      setStudios([]);
      toast.error(err.message || "Failed to load studios");
    } finally {
      setLoading(false);
    }
  };

  // load whenever filters change (skip the very first render — no query yet)
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sort]);

  const pickCategory = (c) => {
    setCategory(c === category ? "" : c);
    // keep the URL shareable/catening
    const next = new URLSearchParams(searchParams.toString());
    if (c) next.set("category", c);
    else next.delete("category");
    router.replace(next.toString() ? `/studios?${next}` : "/studios", {
      scroll: false,
    });
  };

  const submitSearch = (e) => {
    e.preventDefault();
    load();
  };

  const clearAll = () => {
    setSearch("");
    setCategory("");
    setSort("");
    router.replace("/studios", { scroll: false });
    load({ search: "", category: "", sort: "" });
  };

  const hasFilters = Boolean(search || category || sort);

  return (
    <div className="section-pad px-4 sm:px-6 max-w-7xl mx-auto">
      <header className="mb-8 text-center max-w-2xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
          Explore Studios
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold">
          Find the right room for the work
        </h1>
        <p className="mt-3 text-sm md:text-base text-base-content/65">
          Photo studios, film stages, podcast lounges, music suites and art
          workshops — rented by the hour, straight from verified owners.
        </p>
      </header>

      {/* Filter bar */}
      <div className="bg-base-100 border border-base-300 rounded-2xl p-4 md:p-5 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row gap-3">
          <form onSubmit={submitSearch} className="join flex-1">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by studio title or location (e.g. Banani, Berlin)…"
              className="input input-bordered join-item w-full bg-base-200/50"
              aria-label="Search studios"
            />
            <button type="submit" className="btn btn-primary join-item px-5">
              <Search size={17} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="select select-bordered lg:w-52 bg-base-200/50"
            aria-label="Sort studios"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category chips */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => pickCategory(c)}
              aria-pressed={category === c}
              className={`btn btn-xs sm:btn-sm rounded-full border font-medium ${
                category === c
                  ? "btn-primary border-primary"
                  : "btn-outline border-base-300 hover:border-primary hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="btn btn-ghost btn-xs text-base-content/60 hover:text-error"
            >
              <X size={13} /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <StudioCardSkeleton key={i} />
          ))}
        </div>
      ) : studios?.length ? (
        <>
          <p className="text-xs text-base-content/50 mb-4">
            {studios.length} {studios.length === 1 ? "studio" : "studios"} found
            {category ? ` in ${category}` : ""}
          </p>
          <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((s) => (
              <StudioCard key={s._id} studio={s} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title="No studios match those filters"
          message="Try a different category, widen the search, or host the first listing for this space yourself."
          ctaLabel="Add a New Studio"
          ctaHref="/add-studio"
        />
      )}

      <div className="mt-12 text-center text-sm text-base-content/50">
        Looking to book? Learn how{" "}
        <Link href="/how-it-works" className="link link-primary">
          booking works
        </Link>{" "}
        in four steps.
      </div>
    </div>
  );
}
