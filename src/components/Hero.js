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
    <section className="hero-shell grain" aria-label="StudioSpace introduction">
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
      <div className="hero-scrim" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-transparent pointer-events-none" />

      <div className="relative container-x pt-32 sm:pt-36 md:pt-40 pb-28 md:pb-32 flex flex-col min-h-[min(92vh,880px)] justify-center">
        <div className="max-w-4xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-3.5 py-1.5 text-[11px] font-medium tracking-[0.16em] uppercase text-[#f1eee5]/80 backdrop-blur-sm">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#e79b23] opacity-75 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-[#e79b23]" />
            </span>
            Now booking across Bangladesh
          </p>

          <h1 className="display mt-6 text-[2.85rem] sm:text-6xl lg:text-[5.4rem] text-[#f7f3e9] text-balance">
            Find the space.
            <br />
            Make something{" "}
            <span className="serif italic squiggle text-[#f1eee5]">extraordinary.</span>
          </h1>

          <p className="mt-7 max-w-xl text-[15px] sm:text-base leading-relaxed text-[#f1eee5]/70">
            Book remarkable photo studios, film stages, podcast lounges and music
            rooms from verified hosts in Dhaka, Chattogram, Sylhet and beyond.
            Real rooms, honest taka rates, exact hours.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 rounded-full bg-[#f7f3e9] px-6 h-12 text-sm font-medium text-[#141311] hover:bg-white transition-colors"
            >
              Explore studios <ArrowRight size={16} />
            </Link>
            <Link
              href="/add-studio"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.04] px-6 h-12 text-sm font-medium text-[#f7f3e9] hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              <Play size={14} /> List your space
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 pl-2 text-xs text-[#f1eee5]/55">
              <Star size={13} className="fill-[#e79b23] text-[#e79b23]" />
              4.9 from 300+ sessions
            </span>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-[#f1eee5]/60">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#e79b23]" />
              Identity-verified hosts
            </span>
            <span className="hidden sm:inline h-3 w-px bg-white/15" />
            <span className="inline-flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#e79b23]" />
              5 disciplines · 12 curated rooms
            </span>
          </div>
        </div>

        {/* Floating "now booking" card */}
        <div className="hidden lg:block absolute right-8 bottom-32 w-64 float-slow">
          <div className="rounded-2xl border border-white/15 bg-black/35 p-4 text-[#f1eee5] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/studios/gulshan-glasshouse.jpg"
                alt="Gulshan Glasshouse Photo Studio"
                className="w-12 h-12 rounded-xl object-cover"
                loading="lazy"
              />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#e79b23]/90 font-semibold">
                  Featured today
                </p>
                <p className="text-[13px] font-medium truncate">
                  Gulshan Glasshouse
                </p>
                <p className="text-[11px] text-[#f1eee5]/50 flex items-center gap-1">
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

        {/* City marquee */}
        <div className="mt-14 md:mt-16 border-t border-white/10 pt-4 marquee-mask overflow-hidden">
          <div className="marquee-track items-center gap-8 text-[11px] uppercase tracking-[0.2em] text-[#f1eee5]/40">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-8 pr-8" aria-hidden={copy === 1}>
                {AREAS.map((a) => (
                  <span key={a} className="flex items-center gap-8">
                    {a}
                    <span className="w-1 h-1 rounded-full bg-[#e79b23]/70" />
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
