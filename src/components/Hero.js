
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Search, ShieldCheck, Star } from "lucide-react";

const AREAS = [
  "Gulshan",
  "Banani",
  "Dhanmondi",
  "Uttara",
  "Lalmatia",
  "Mohammadpur",
  "Old Dhaka",
  "Chattogram",
  "Sylhet",
  "Cox's Bazar",
  "Rajshahi",
  "Khulshi",
];

export default function Hero() {
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const search = form.elements.q.value.trim();
    const area = form.elements.area.value.trim();

    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (area) params.set("area", area);

    const url = params.toString()
      ? `/studios?${params.toString()}`
      : "/studios";

    router.push(url);
  };

  return (
    <section
      aria-label="Hero"
      className="relative isolate flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-[#0d0d0b] px-4 pb-10 pt-28 text-center sm:px-6 sm:pb-12 sm:pt-32 lg:px-8 lg:pt-36"
    >
      {/* Background image */}
      <img
        src="/media/hero-poster.jpg"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-[0.22]"
      />

      {/* Background overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0d0d0b]/80 via-[#0d0d0b]/70 to-[#0d0d0b]/95" />

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0d0d0b]/70 via-transparent to-[#0d0d0b]/70" />

      {/* Diagonal amber streaks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {[
          ["left-[10%]", "rotate-[22deg]", "bg-[#e79b23]/60"],
          ["left-[28%]", "rotate-[18deg]", "bg-[#e79b23]/40"],
          ["left-[50%]", "rotate-[25deg]", "bg-[#e79b23]/50"],
          ["left-[72%]", "rotate-[20deg]", "bg-[#e79b23]/35"],
          ["left-[88%]", "rotate-[22deg]", "bg-[#e79b23]/45"],
        ].map(([position, rotation, color], i) => (
          <div
            key={i}
            className={`absolute -top-[20%] h-[140%] w-px bg-gradient-to-b from-transparent via-current to-transparent ${position} ${rotation} ${color}`}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center">

        {/* Availability badge */}
        <p className="mb-5 inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-2 text-[10px] font-medium text-amber-100 shadow-lg shadow-amber-900/20 backdrop-blur sm:mb-7 sm:px-4 sm:text-xs">
          <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-amber-400" />
          Now booking across Bangladesh
        </p>

        {/* Heading */}
        <h1 className="mb-5 max-w-5xl text-[clamp(2.25rem,7vw,5.5rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-white drop-shadow-2xl sm:mb-6 sm:leading-[0.98]">
          Find the space.
          <br />
          <span className="font-serif italic text-amber-300">
            Make something extraordinary.
          </span>
        </h1>

        {/* Description */}
        <p className="mb-8 max-w-2xl px-1 text-sm leading-relaxed text-white/70 sm:mb-10 sm:text-base md:text-lg lg:text-xl">
          Photo studios, film stages, podcast lounges and music rooms from
          verified hosts in Dhaka, Chattogram, Sylhet and beyond.
        </p>

        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="mb-7 flex w-full max-w-3xl flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.05] p-2 text-left shadow-[0_24px_60px_-24px_rgba(231,155,35,0.35)] backdrop-blur-xl sm:mb-8 sm:rounded-3xl sm:p-2.5 md:flex-row md:items-center"
        >
          {/* Search query */}
          <label className="flex min-h-[58px] min-w-0 flex-1 items-center gap-3 rounded-xl bg-white/[0.05] px-3 py-2.5 transition-colors focus-within:bg-white/[0.09] sm:px-4">
            <Search size={19} className="shrink-0 text-amber-300" />

            <span className="min-w-0 flex-1">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-amber-100/60">
                What are you making?
              </span>

              <input
                name="q"
                type="search"
                placeholder="Photo, film, podcast..."
                autoComplete="off"
                className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
              />
            </span>
          </label>

          {/* Divider */}
          <span className="hidden h-10 w-px shrink-0 bg-white/10 md:block" />

          {/* Location */}
          <label className="flex min-h-[58px] min-w-0 flex-1 items-center gap-3 rounded-xl bg-white/[0.05] px-3 py-2.5 transition-colors focus-within:bg-white/[0.09] sm:px-4">
            <MapPin size={19} className="shrink-0 text-amber-300" />

            <span className="min-w-0 flex-1">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-amber-100/60">
                Where?
              </span>

              <input
                name="area"
                type="text"
                placeholder="City or neighbourhood"
                autoComplete="address-level2"
                className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
              />
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="flex min-h-[52px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 text-sm font-bold text-[#14120c] shadow-lg shadow-amber-500/20 transition-all duration-200 hover:bg-amber-400 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 md:w-auto md:min-h-[58px] md:rounded-full"
          >
            Search
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Navigation links */}
        <div className="mb-8 flex flex-col items-center justify-center gap-4 text-sm font-medium sm:mb-10 sm:flex-row sm:gap-7">
          <Link
            href="/studios"
            className="whitespace-nowrap text-white underline decoration-amber-500 decoration-2 underline-offset-4 transition-colors hover:text-amber-100"
          >
            Browse all studios
          </Link>

          <Link
            href="/add-studio"
            className="whitespace-nowrap text-white/60 transition-colors hover:text-white"
          >
            Host your space
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mb-10 flex flex-col items-center justify-center gap-3 text-xs text-white/50 sm:mb-12 sm:flex-row sm:flex-wrap sm:gap-x-7 sm:gap-y-3">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={15} className="shrink-0 text-amber-300" />
            Identity-verified hosts
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Star
              size={14}
              className="shrink-0 fill-amber-400 text-amber-400"
            />
            4.9 from 300+ sessions
          </span>
        </div>

        {/* Areas marquee */}
        <div className="w-full max-w-5xl overflow-hidden border-t border-white/10 pt-4">
          <div className="flex w-max animate-[marquee_30s_linear_infinite] whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.15em] text-white/40 sm:text-xs sm:tracking-wide">
            {[...AREAS, ...AREAS].map((area, i) => (
              <span key={i} className="shrink-0">
                {area}
                <span className="mx-3 text-amber-400 sm:mx-5">•</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
