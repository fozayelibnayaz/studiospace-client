"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  MapPin,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

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
    <section className="hero-shell grain relative" aria-label="StudioSpace introduction">
      {reduceMotion ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/media/hero-poster.jpg"
          alt="A photography studio in Dhaka with softboxes and a cyclorama wall"
          className="hero-video"
          fetchPriority="high"
        />
      ) : (
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/hero-poster.jpg"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/media/hero.webm" type="video/webm" />
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Scrim: cinematic darkening + soft bottom fade, no second layer */}
      <div className="hero-scrim" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

      {/* 3D ambience: soft amber light mass behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-70 blur-[130px]"
        style={{ background: "radial-gradient(circle, rgba(231,155,35,0.34) 0%, rgba(231,155,35,0) 68%)" }}
      />

      <div className="relative container-x pt-28 pb-16 sm:pt-32 md:pt-36 md:pb-20 flex min-h-[min(92vh,880px)] flex-col justify-center">
        <div className="grid items-center gap-12 lg:grid-cols-[1.6fr_1fr]">
          {/* Headline block */}
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-3.5 py-1.5 text-[11px] font-medium tracking-[0.16em] uppercase text-[#f1eee5]/80 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#e79b23] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#e79b23]" />
              </span>
              Now booking across Bangladesh
            </p>

            <h1 className="display mt-6 text-[#f7f3e9] text-balance text-[2.6rem] leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-[5.1rem]">
              Find the space.
              <br />
              Make something{" "}
              <span className="serif italic squiggle text-[#f1eee5]">extraordinary.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[#f1eee5]/70 sm:text-base">
              Book remarkable photo studios, film stages, podcast lounges and music
              rooms from verified hosts in Dhaka, Chattogram, Sylhet and beyond.
              Real rooms, honest taka rates, exact hours.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/studios"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#f7f3e9] px-7 text-sm font-medium text-[#141311] transition-colors hover:bg-white"
              >
                Explore Studios <ArrowRight size={16} />
              </Link>
              <Link
                href="/add-studio"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 bg-white/[0.04] px-7 text-sm font-medium text-[#f7f3e9] backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <Play size={14} /> Host Your Space
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-[#f1eee5]/60">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#e79b23]" />
                Identity-verified hosts
              </span>
              <span className="hidden h-3 w-px bg-white/15 sm:block" />
              <span className="inline-flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#e79b23]" />
                5 disciplines · 12 curated rooms
              </span>
              <span className="hidden md:inline-flex items-center gap-1.5 pl-2">
                <Star size={13} className="fill-[#e79b23] text-[#e79b23]" />
                4.9 from 300+ sessions
              </span>
            </div>
          </div>

          {/* Floating "now booking" card */}
          <div className="hidden justify-self-end lg:block">
            <div className="w-64 rounded-2xl border border-white/15 bg-black/35 p-4 text-[#f1eee5] backdrop-blur-xl">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/studios/gulshan-glasshouse.jpg"
                  alt="Gulshan Glasshouse Photo Studio"
                  className="h-12 w-12 rounded-xl object-cover"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#e79b23]/90">
                    Featured today
                  </p>
                  <p className="truncate text-[13px] font-medium">Gulshan Glasshouse</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#f1eee5]/50">
                    <MapPin size={10} /> Gulshan 1, Dhaka
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                <span className="font-heading font-semibold text-base">৳6,500</span>
                <span className="text-[#f1eee5]/45">per hour</span>
                <Link href="/studios" className="text-[#e79b23] hover:underline">
                  Book
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* City marquee */}
        <div className="mt-14 border-t border-white/10 pt-4 marquee-mask overflow-hidden md:mt-16">
          <div className="marquee-track items-center gap-8 text-[11px] uppercase tracking-[0.2em] text-[#f1eee5]/40">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-8 pr-8" aria-hidden={copy === 1}>
                {AREAS.map((a) => (
                  <span key={a} className="flex items-center gap-8">
                    {a}
                    <span className="h-1 w-1 rounded-full bg-[#e79b23]/70" />
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
