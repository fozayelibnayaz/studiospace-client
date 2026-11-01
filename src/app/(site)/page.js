import Link from "next/link";
import { ArrowRight, Aperture, Quote } from "lucide-react";

import Hero from "@/components/Hero";
import FeaturedStudios from "@/components/FeaturedStudios";
import CategoryShowcase from "@/components/CategoryShowcase";
import HowBookingWorks from "@/components/HowBookingWorks";
import HostGuarantee from "@/components/HostGuarantee";

export default function HomePage() {
  return (
    <>
      <Hero />

      <div className="reveal">
        <FeaturedStudios />
      </div>

      <CategoryShowcase />

      <div className="reveal">
        <HowBookingWorks />
      </div>

      <div className="reveal">
        <HostGuarantee />
      </div>

      {/* Quote */}
      <section className="container-x pb-16 md:pb-24">
        <figure className="mx-auto max-w-3xl text-center">
          <Quote size={26} className="mx-auto text-primary/50" />
          <blockquote className="mt-5 serif text-2xl sm:text-3xl md:text-[2.4rem] leading-[1.2] tracking-[-0.02em] text-balance">
            “We shot three lookbooks in one day because every room was on the
            same calendar. That never happened before StudioSpace.”
          </blockquote>
          <figcaption className="mt-5 text-xs uppercase tracking-[0.18em] text-muted">
            Nusrat Jahan · producer, Dhaka
          </figcaption>
        </figure>
      </section>

      {/* Closing CTA */}
      <section className="container-x pb-16 md:pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0d0d0b] text-[#f1eee5] px-6 py-14 sm:px-12 md:px-16 md:py-20">
          <div className="absolute inset-0 opacity-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/studios/coxsbazar-sea-light.jpg"
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0b] via-[#0d0d0b]/85 to-[#0d0d0b]/30" />
          </div>

          <div className="relative max-w-2xl">
            <span className="inline-grid place-items-center w-11 h-11 rounded-full bg-[#e79b23] text-[#14120c] mb-6">
              <Aperture size={22} />
            </span>
            <p className="eyebrow text-[#e79b23] mb-4">StudioSpace</p>
            <h2 className="display text-3xl sm:text-5xl md:text-[3.6rem] text-balance">
              Built for the people{" "}
              <span className="serif italic">behind the work.</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm md:text-base leading-relaxed text-[#f1eee5]/65">
              Photographers, filmmakers, podcasters, musicians and artists —
              the room is ready when you are. Priced in taka, booked in minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/studios"
                className="inline-flex items-center gap-2 rounded-full bg-[#f7f3e9] px-6 h-12 text-sm font-medium text-[#141311] hover:bg-white transition-colors"
              >
                Explore studios <ArrowRight size={16} />
              </Link>
              <Link
                href="/add-studio"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 h-12 text-sm font-medium text-[#f7f3e9] hover:bg-white/10 transition-colors"
              >
                List your space
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
