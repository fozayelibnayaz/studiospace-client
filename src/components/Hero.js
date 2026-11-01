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
    <section className="hero-shell grain relative overflow-hidden" aria-label="StudioSpace introduction">
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

      {/* Bold amber scrim: heavy left darkening + vivid amber spotlight */}
      <div className="hero-scrim" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 15% 40%, rgba(231,155,35,0.55) 0%, rgba(231,155,35,0.15) 40%, transparent 70%), radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,0,0,0.85) 0%, transparent 60%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />

      {/* 3D ambience: amber light mass */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-[10%] h-[26rem] w-[26rem] rounded-full opacity-80 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(231,155,35,0.6) 0%, rgba(231,155,35,0) 70%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-[5%] h-80 w-80 rounded-full opacity-50 blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(231,155,35,0.45) 0%, rgba(231,155,35,0) 70%)" }}
      />

      <div className="relative container-x pt-28 pb-16 sm:pt-32 md:pt-36 md:pb-20 flex min-h-[min(100vh,980px)] flex-col justify-center">
        <div className="grid items-center gap-10 lg:grid-cols-[1.6fr_1fr]">
          {/* Headline block */}
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e79b23]/40 bg-[#e79b23]/15 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-[#f3c46c] backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#e79b23] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#e79b23]" />
              </span>
              Now booking across Bangladesh
            </p>

            <h1 className="display mt-6 text-[#f7f3e9] text-balance text-[2.8rem] leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-[6rem]">
              Find the space.
              <br />
              Make something{" "}
              <span className="serif italic text-[#f3c46c] drop-shadow-[0_0_24px_rgba(231,155,35,0.5)]">extraordinary.</span>
            </h1>

            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-[#f1eee5]/80 sm:text-base">
              Book remarkable photo studios, film stages, podcast lounges and music
              rooms from verified hosts in Dhaka, Chattogram, Sylhet and beyond.
              Real rooms, honest taka rates, exact hours.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/studios"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#e79b23] px-8 text-sm font-semibold text-[#14120c] transition-all hover:bg-[#f3c46c] hover:shadow-[0_0_30px_rgba(231,155,35,0.5)]"
              >
                Explore Studios <ArrowRight size={16} />
              </Link>
              <Link
                href="/add-studio"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 bg-white/[0.06] px-8 text-sm font-medium text-[#f7f3e9] backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <Play size={14} /> Host Your Space
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-[#f1eee5]/70">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#e79b23]" />
                Identity-verified hosts
              </span>
              <span className="hidden h-3 w-px bg-white/20 sm:block" />
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

          {/* 3D floating card stack */}
          <div className="hidden lg:block" style={{ perspective: "1200px" }}>
            <div className="relative mx-auto w-72" style={{ transformStyle: "preserve-3d", transform: "rotateY(-8deg) rotateX(4deg)" }}>
              <div className="absolute -top-4 -left-4 w-64 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl opacity-40" style={{ transform: "translateZ(-40px)" }}>
                <div className="h-10 w-full rounded-lg bg-white/5" />
                <div className="mt-3 h-3 w-3/4 rounded bg-white/10" />
                <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
              </div>
              <div className="relative w-64 rounded-2xl border border-[#e79b23]/30 bg-black/40 p-4 text-[#f1eee5] backdrop-blur-xl shadow-[0_40px_80px_-20px_rgba(231,155,35,0.4)]" style={{ transform: "translateZ(0)" }}>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/studios/gulshan-glasshouse.jpg"
                    alt="Gulshan Glasshouse Photo Studio"
                    className="h-14 w-14 rounded-xl object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#e79b23]/90">
                      Featured today
                    </p>
                    <p className="truncate text-[14px] font-medium">Gulshan Glasshouse</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#f1eee5]/50">
                      <MapPin size={10} /> Gulshan 1, Dhaka
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                  <span className="font-heading font-semibold text-base text-[#e79b23]">৳6,500</span>
                  <span className="text-[#f1eee5]/45">per hour</span>
                  <Link href="/studios" className="text-[#f1eee5] hover:text-[#e79b23]">
                    Book
                  </Link>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-64 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl opacity-40" style={{ transform: "translateZ(-80px)" }}>
                <div className="h-10 w-full rounded-lg bg-white/5" />
                <div className="mt-3 h-3 w-3/4 rounded bg-white/10" />
                <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
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
