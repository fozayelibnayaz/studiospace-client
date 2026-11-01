"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e) => setReduceMotion(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return (
    <section className="ss-hero ss-grain" aria-label="StudioSpace introduction">
      {/* Static image background — dimmed + tinted so text stays crisp */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/hero-poster.jpg"
        alt=""
        className="ss-media"
        fetchPriority="high"
      />

      {/* Strong dark scrim for guaranteed text visibility */}
      <div className="ss-scrim" aria-hidden="true" />

      {/* Raycast-style diagonal amber light bars */}
      <div className="ss-streaks" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </div>
      <div className="ss-vignette" aria-hidden="true" />

      {/* pt-32 reserves room for the floating navbar INSIDE the hero */}
      <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-5 pb-10 pt-32 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-[var(--ss-line)] bg-[var(--ss-glass)] px-3.5 py-1.5 text-xs font-medium text-[var(--ss-muted)] backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--ss-amber)]" />
          Now booking across Bangladesh
        </p>

        <h1 className="display mt-6 max-w-4xl text-balance text-[2.9rem] leading-[0.98] tracking-[-0.045em] text-[var(--ss-fg)] sm:text-7xl lg:text-[5.75rem]">
          Find the space.
          <br />
          Make something{" "}
          <span className="serif italic text-[var(--ss-amber-deep)]">
            extraordinary.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-[15px] leading-relaxed text-[var(--ss-muted)] sm:text-base">
          Photo studios, film stages, podcast lounges and music rooms from
          verified hosts in Dhaka, Chattogram, Sylhet and beyond. Real rooms,
          honest taka rates, exact hours.
        </p>

        {/* Search */}
        <form
          action="/studios"
          className="mt-9 flex w-full max-w-2xl flex-col gap-2 rounded-3xl border border-[var(--ss-line)] bg-[var(--ss-field)] p-2 text-left text-[#1b1710] shadow-[0_24px_60px_-24px_rgba(231,155,35,0.55)] sm:flex-row sm:items-center sm:rounded-full"
        >
          <label className="flex flex-1 items-center gap-3 px-4 py-2">
            <Search size={17} className="shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold text-black/55">
                What are you making?
              </span>
              <input
                name="q"
                placeholder="Photo, film, podcast…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-black/40"
              />
            </span>
          </label>

          <span className="hidden h-8 w-px bg-black/10 sm:block" />

          <label className="flex flex-1 items-center gap-3 px-4 py-2">
            <MapPin size={17} className="shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold text-black/55">
                Where?
              </span>
              <input
                name="area"
                placeholder="City or neighbourhood"
                className="w-full bg-transparent text-sm outline-none placeholder:text-black/40"
              />
            </span>
          </label>

          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--ss-amber)] px-6 text-sm font-semibold text-[var(--ss-on-amber)] transition-colors hover:bg-[var(--ss-amber-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ss-amber)]"
          >
            Search <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
          <Link
            href="/studios"
            className="font-semibold text-[var(--ss-fg)] underline decoration-[var(--ss-amber)] decoration-2 underline-offset-4"
          >
            Browse all studios
          </Link>
          <Link
            href="/add-studio"
            className="text-[var(--ss-muted)] hover:text-[var(--ss-fg)]"
          >
            Host your space
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--ss-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[var(--ss-amber-deep)]" />
            Identity-verified hosts
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Star size={13} className="fill-[var(--ss-amber)] text-[var(--ss-amber)]" />
            4.9 from 300+ sessions
          </span>
        </div>

        {/* City marquee */}
        <div className="ss-marquee-mask mt-14 w-full overflow-hidden border-t border-[var(--ss-line)] pt-4">
          <div className="ss-marquee text-[12px] text-[var(--ss-muted)]">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex items-center gap-8 pr-8"
                aria-hidden={copy === 1}
              >
                {AREAS.map((a) => (
                  <span key={a} className="flex items-center gap-8">
                    {a}
                    <span className="h-1 w-1 rounded-full bg-[var(--ss-amber)]" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
