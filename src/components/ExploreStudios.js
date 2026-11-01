"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpRight,
  Check,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

import { apiRequest } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import StudioCard from "./StudioCard";
import StudioCardSkeleton from "./StudioCardSkeleton";
import EmptyState from "./EmptyState";

const SORT_OPTIONS = [
  { value: "", label: "Recommended" },
  { value: "priceLow", label: "Price: low to high" },
  { value: "priceHigh", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "newest", label: "Newest first" },
];

const PRICE_BANDS = [
  { id: "any", label: "Any price", min: 0, max: Infinity },
  { id: "under", label: "Under ৳2,500", min: 0, max: 2500 },
  { id: "mid", label: "৳2,500 – ৳6,000", min: 2500, max: 6000 },
  { id: "high", label: "৳6,000 – ৳15,000", min: 6000, max: 15000 },
  { id: "top", label: "৳15,000+", min: 15000, max: Infinity },
];

const CAPACITIES = [
  { value: 0, label: "Any capacity" },
  { value: 4, label: "4+ people" },
  { value: 8, label: "8+ people" },
  { value: 12, label: "12+ people" },
  { value: 20, label: "20+ people" },
];

const AMENITIES = [
  "Cyc Wall",
  "Green Screen",
  "Lighting Kit",
  "Soundproof",
  "Mixer",
  "Makeup Room",
  "Air Conditioning",
  "Parking",
];

const CITIES = ["Dhaka", "Chattogram", "Sylhet", "Cox's Bazar"];

export default function ExploreStudios() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL is the single source of truth for category (deep-linkable)
  const urlCategory = searchParams.get("category") || "";
  const [category, setCategory] = useState(urlCategory);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [priceBand, setPriceBand] = useState("any");
  const [capacity, setCapacity] = useState(0);
  const [amenities, setAmenities] = useState([]);
  const [studios, setStudios] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  // load on mount and whenever server-side filters change
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sort]);

  const pickCategory = (c) => {
    const next = c === category ? "" : c;
    setCategory(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("category", next);
    else params.delete("category");
    router.replace(params.toString() ? `/studios?${params}` : "/studios", {
      scroll: false,
    });
  };

  const submitSearch = (e) => {
    e.preventDefault();
    load();
  };

  const applyCity = (city) => {
    setSearch(city);
    load({ search: city });
  };

  const toggleAmenity = (a) =>
    setAmenities((list) =>
      list.includes(a) ? list.filter((x) => x !== a) : [...list, a]
    );

  const clearAll = () => {
    setSearch("");
    setCategory("");
    setSort("");
    setPriceBand("any");
    setCapacity(0);
    setAmenities([]);
    router.replace("/studios", { scroll: false });
    load({ search: "", category: "", sort: "" });
  };

  const hasFilters = Boolean(
    search || category || sort || priceBand !== "any" || capacity || amenities.length
  );

  const filtered = useMemo(() => {
    if (!studios) return null;
    const band = PRICE_BANDS.find((b) => b.id === priceBand) || PRICE_BANDS[0];
    return studios.filter((s) => {
      const rate = Number(s.hourlyRate) || 0;
      if (rate < band.min || rate > band.max) return false;
      if (capacity && (Number(s.maxCapacity) || 0) < capacity) return false;
      if (amenities.length) {
        const list = (s.amenities || []).map((a) => String(a).toLowerCase());
        if (!amenities.every((a) => list.includes(a.toLowerCase()))) return false;
      }
      return true;
    });
  }, [studios, priceBand, capacity, amenities]);

  const results = filtered ?? [];
  const activeFilterCount =
    (category ? 1 : 0) +
    (priceBand !== "any" ? 1 : 0) +
    (capacity ? 1 : 0) +
    amenities.length;

  const FilterPanel = (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint mb-3">
          Search
        </p>
        <form onSubmit={submitSearch} className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Studio or area…"
            aria-label="Search studios"
            className="h-11 w-full rounded-full border border-base-content/15 bg-base-100 pl-10 pr-4 text-sm outline-none focus:border-primary"
          />
        </form>
      </div>

      {/* Category */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint mb-3">
          Category
        </p>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => pickCategory("")}
              className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors ${
                !category ? "font-medium" : "text-muted hover:text-base-content"
              }`}
            >
              All categories
              {!category && <Check size={14} className="text-primary" />}
            </button>
          </li>
          {CATEGORIES.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => pickCategory(c)}
                className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm text-left transition-colors ${
                  category === c ? "font-medium" : "text-muted hover:text-base-content"
                }`}
              >
                {c}
                {category === c && <Check size={14} className="text-primary" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint mb-3">
          Price per hour
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PRICE_BANDS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setPriceBand(b.id)}
              aria-pressed={priceBand === b.id}
              className={`rounded-full border px-2.5 py-1.5 text-[11px] transition-colors ${
                priceBand === b.id
                  ? "border-neutral bg-neutral text-neutral-content"
                  : "border-base-content/15 text-muted hover:border-base-content/35"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Capacity */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint mb-3">
          Capacity
        </p>
        <select
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          className="h-11 w-full rounded-full border border-base-content/15 bg-base-100 px-4 text-sm outline-none focus:border-primary"
          aria-label="Minimum capacity"
        >
          {CAPACITIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Amenities */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint mb-3">
          Amenities
        </p>
        <ul className="space-y-2">
          {AMENITIES.map((a) => {
            const on = amenities.includes(a);
            return (
              <li key={a}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted hover:text-base-content transition-colors">
                  <span
                    className={`grid place-items-center w-4 h-4 rounded border transition-colors ${
                      on
                        ? "bg-neutral border-neutral text-neutral-content"
                        : "border-base-content/25"
                    }`}
                  >
                    {on && <Check size={11} />}
                  </span>
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggleAmenity(a)}
                    className="sr-only"
                  />
                  {a}
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        type="button"
        onClick={clearAll}
        disabled={!hasFilters}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-error transition-colors disabled:opacity-40"
      >
        <X size={13} /> Clear all filters
      </button>
    </div>
  );

  return (
    <div className="pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="container-x">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-6 border-b border-base-content/10 pb-8 md:pb-10">
          <div className="max-w-2xl">
            <p className="eyebrow text-primary mb-4">Explore studios</p>
            <h1 className="display text-[2.2rem] sm:text-5xl md:text-[3.6rem] text-balance">
              Find a room for the{" "}
              <span className="serif italic">work ahead.</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm md:text-[15px] leading-relaxed text-muted">
              Photo studios, film stages, podcast lounges, music suites and art
              workshops — rented by the hour, straight from verified hosts across
              Bangladesh.
            </p>
          </div>

          <form onSubmit={submitSearch} className="w-full sm:w-auto">
            <div className="flex h-12 w-full items-center gap-2 rounded-full border border-base-content/15 bg-base-100 pl-4 pr-1.5 sm:w-80 focus-within:border-primary transition-colors">
              <Search size={16} className="shrink-0 text-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Gulshan, film stage, mixer…"
                aria-label="Search studios"
                className="h-full w-full bg-transparent text-sm outline-none placeholder:text-faint"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-neutral px-4 h-9 text-[13px] font-medium text-neutral-content hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </div>
          </form>
        </header>

        {/* City shortcuts */}
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-faint mr-1 inline-flex items-center gap-1">
            <MapPin size={12} /> Popular:
          </span>
          {CITIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => applyCity(c)}
              className={`rounded-full border px-3 py-1.5 transition-colors ${
                search === c
                  ? "border-neutral bg-neutral text-neutral-content"
                  : "border-base-content/15 text-muted hover:border-base-content/40"
              }`}
            >
              {c}
            </button>
          ))}
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                load({ search: "" });
              }}
              className="ml-1 text-faint hover:text-error"
            >
              reset
            </button>
          )}
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-12">
          {/* Filter rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">{FilterPanel}</div>
          </aside>

          {/* Results */}
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] text-muted">
                {loading
                  ? "Loading rooms…"
                  : `${results.length} ${results.length === 1 ? "room" : "rooms"}${
                      category ? ` in ${category}` : ""
                    }`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 rounded-full border border-base-content/15 px-3.5 h-9 text-[13px]"
                >
                  <SlidersHorizontal size={14} /> Filters
                  {activeFilterCount > 0 && (
                    <span className="grid place-items-center w-4 h-4 rounded-full bg-primary text-[10px] font-semibold text-primary-content">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <label htmlFor="explore-sort" className="text-[12px] text-faint hidden sm:block">
                  Sort by
                </label>
                <select
                  id="explore-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-9 rounded-full border border-base-content/15 bg-base-100 px-3 text-[13px] outline-none focus:border-primary"
                  aria-label="Sort studios"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <StudioCardSkeleton key={i} />
                ))}
              </div>
            ) : results.length ? (
              <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((s) => (
                  <StudioCard key={s._id} studio={s} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-base-content/10 bg-base-200/40">
                <EmptyState
                  title="No rooms match those filters"
                  message="Try a different category, widen the price band, or host the first listing for this space yourself."
                  ctaLabel="List a studio"
                  ctaHref="/add-studio"
                />
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-base-content/10 pt-6 text-[13px] text-muted">
                <p>
                  Showing {results.length} of {studios?.length ?? 0} curated rooms.
                </p>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                >
                  How booking works <ArrowUpRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-3xl bg-base-100 p-5 pb-8 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-heading text-lg font-medium">Filters</p>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="grid place-items-center w-9 h-9 rounded-full border border-base-content/15"
              >
                <X size={17} />
              </button>
            </div>
            {FilterPanel}
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="mt-6 w-full rounded-full bg-neutral h-12 text-sm font-medium text-neutral-content"
            >
              Show {results.length} rooms
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
