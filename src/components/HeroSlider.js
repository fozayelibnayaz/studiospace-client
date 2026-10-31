"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Camera, Music, Mic } from "lucide-react";

const SLIDES = [
  {
    id: "1516035069371-29a1b244cc32",
    kicker: "Photo Studio",
    title: "Shoot in spaces built for light",
    sub: "Cyc walls, softboxes and daylight lofts — indexed by city, floor plan and gear list so you know exactly what you're stepping into.",
  },
  {
    id: "1519677100203-a0e668c92439",
    kicker: "Podcast Lounge",
    title: "Press record in a treated room",
    sub: "Broadcast-fed podcast lounges with engineer-ready chains. Walk in, plug into the mixing board, ship the episode the same day.",
  },
  {
    id: "1505740420928-5e560c06d30e",
    kicker: "Music Suite",
    title: "Rehearse, track and mix in one place",
    sub: "Floating-floor rehearsal rooms and mastering-grade mix suites. Reserve the backline, the room and the engineer in a single booking.",
  },
];

const HERO_ICONS = { "Photo Studio": Camera, "Podcast Lounge": Mic, "Music Suite": Music };

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      loop
      autoplay={{ delay: 5500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      className="w-full aspect-[16/10] sm:aspect-[16/8] md:aspect-[16/6] max-h-[560px]"
    >
      {SLIDES.map((s) => {
        const Icon = HERO_ICONS[s.kicker] || Camera;
        return (
          <SwiperSlide key={s.id}>
            <div className="relative w-full h-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://images.unsplash.com/photo-${s.id}?auto=format&fit=crop&w=1800&q=80`}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
                <div className="max-w-xl text-white">
                  <p className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-warning mb-3 sm:mb-4">
                    <Icon size={16} /> {s.kicker}
                  </p>
                  <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold leading-tight">
                    {s.title}
                  </h1>
                  <p className="mt-3 md:mt-4 text-sm sm:text-base text-white/80 leading-relaxed max-w-lg">
                    {s.sub}
                  </p>
                  <div className="mt-6 md:mt-8 flex flex-wrap gap-3">
                    <Link href="/studios" className="btn btn-primary btn-sm md:btn-md px-5">
                      Explore Studios
                    </Link>
                    <Link
                      href="/studios"
                      className="btn btn-outline btn-sm md:btn-md px-5 text-white border-white/40 hover:bg-white/10 hover:text-white"
                    >
                      Host Your Space
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
