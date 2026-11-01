"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import {
  ArrowRight,
  Camera,
  Clapperboard,
  MapPin,
  Mic,
  Music,
  Play,
  Star,
} from "lucide-react";

const SLIDES = [
  {
    id: "1516035069371-29a1b244cc32",
    category: "Photo Studio",
    city: "Gulshan 2, Dhaka",
    rate: "৳6,500",
    title: "Book Bangladesh's best creative rooms by the hour.",
    sub: "Cyc walls in Gulshan, daylight lofts in Dhanmondi, blackout stages in Tejgaon — verified rooms with honest BDT pricing, bookable in minutes.",
  },
  {
    id: "1485846234645-a62644f84728",
    category: "Film Stage",
    city: "Banani 11, Dhaka",
    rate: "৳18,000",
    title: "Stages built for the next big Bangladeshi story.",
    sub: "Blacked-out soundstages, green screen bays and rigging grids across Dhaka and Chattogram. Load-in, light and roll — all in one reservation.",
  },
  {
    id: "1519677100203-a0e668c92439",
    category: "Podcast Lounge",
    city: "Dhanmondi 27, Dhaka",
    rate: "৳2,200",
    title: "Press record in a room that respects your voice.",
    sub: "Treated podcast lounges with broadcast chains, video-ready lighting and same-day stems. Walk in with an idea, walk out with an episode.",
  },
  {
    id: "1505740420928-5e560c06d30e",
    category: "Music Suite",
    city: "Lalmatia, Dhaka",
    rate: "৳4,800",
    title: "Rehearse, track and mix without leaving the city.",
    sub: "Floating-floor rehearsal rooms and mastering-grade mix suites from Lalmatia to Khulshi. Book the backline, the room and the engineer together.",
  },
];

const ICONS = {
  "Photo Studio": Camera,
  "Film Stage": Clapperboard,
  "Podcast Lounge": Mic,
  "Music Suite": Music,
};

const CITIES = ["Dhaka", "Chattogram", "Sylhet", "Cox's Bazar"];

export default function HeroSlider() {
  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={1100}
        autoplay={{ delay: 6200, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="hero-swiper w-full h-[86vh] min-h-[560px] max-h-[820px]"
      >
        {SLIDES.map((s, i) => {
          const Icon = ICONS[s.category] || Camera;
          return (
            <SwiperSlide key={s.id}>
              <div className="relative w-full h-full overflow-hidden bg-[#0b0b0f]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://images.unsplash.com/photo-${s.id}?auto=format&fit=crop&w=2000&q=80`}
                  alt={`${s.category} in ${s.city}`}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  className="absolute inset-0 w-full h-full object-cover hero-kenburns"
                />
                {/* Cinematic grade */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#08080b]/95 via-[#08080b]/70 to-[#08080b]/15" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080b] via-transparent to-[#08080b]/40" />
                {/* Moving spotlight sheen */}
                <div className="hero-sheen absolute inset-0 pointer-events-none" />

                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
                  <div className="max-w-2xl text-white pb-16 md:pb-0">
                    <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-amber-200 backdrop-blur">
                      <Icon size={14} /> {s.category}
                      <span className="h-3 w-px bg-white/25" />
                      <MapPin size={13} /> {s.city}
                    </p>

                    <h1 className="mt-5 font-heading text-3xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.05] tracking-tight">
                      {s.title}
                    </h1>

                    <p className="mt-4 max-w-xl text-sm sm:text-base text-white/75 leading-relaxed">
                      {s.sub}
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-3">
                      <Link
                        href="/studios"
                        className="btn btn-primary btn-md px-6 gap-2 shadow-lg shadow-primary/25"
                      >
                        Explore Studios <ArrowRight size={16} />
                      </Link>
                      <Link
                        href="/studios"
                        className="btn btn-outline btn-md px-5 gap-2 text-white border-white/30 hover:bg-white/10 hover:text-white hover:border-white/50"
                      >
                        <Play size={15} /> Host Your Space
                      </Link>
                      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/60">
                        <Star size={13} className="fill-amber-300 text-amber-300" />
                        4.9 average from 300+ studio sessions
                      </span>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/55">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Verified hosts across Bangladesh
                      </span>
                      <span className="hidden sm:inline h-3 w-px bg-white/15" />
                      <span>bKash · Nagad · cash on arrival</span>
                    </div>
                  </div>
                </div>

                {/* Floating rate card */}
                <div className="hidden lg:block absolute right-8 xl:right-14 bottom-28 w-64">
                  <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-5 text-white shadow-2xl float-slow">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200">
                      Starting from
                    </p>
                    <p className="mt-1 font-heading text-3xl font-bold">
                      {s.rate}
                      <span className="text-sm font-normal text-white/60"> /hr</span>
                    </p>
                    <p className="mt-1 text-xs text-white/65">{s.city}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3 text-[11px] text-white/70">
                      <span>Free cancellation</span>
                      <span>24h notice</span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* City strip — anchors the marketplace in Bangladesh */}
      <div className="relative z-10 border-b border-base-300/60 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-base-content/45">
            Now booking in
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {CITIES.map((c) => (
              <Link
                key={c}
                href={`/studios?search=${encodeURIComponent(c)}`}
                className="badge badge-lg bg-base-200/70 border-base-300 font-medium hover:border-primary hover:text-primary transition-colors"
              >
                {c}
              </Link>
            ))}
            <span className="text-xs text-base-content/45">and 4 more districts</span>
          </div>
        </div>
      </div>
    </section>
  );
}
