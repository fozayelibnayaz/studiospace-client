"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CATEGORIES, CATEGORY_META } from "@/lib/constants";

const CATEGORY_VISUALS = {
  "Photo Studio": {
    image: "/studios/gulshan-glasshouse.jpg",
    from: "৳4,200",
    note: "Cyc walls, strobes, daylight lofts",
  },
  "Film Stage": {
    image: "/studios/banani-blackbox.jpg",
    from: "৳14,500",
    note: "Blackout stages, green screens, rigging",
  },
  "Podcast Lounge": {
    image: "/studios/uttara-podcast.jpg",
    from: "৳1,800",
    note: "Treated rooms, broadcast chains",
  },
  "Music Suite": {
    image: "/studios/lalmatia-mix.jpg",
    from: "৳2,600",
    note: "Rehearsal, tracking and mix rooms",
  },
  "Art Workshop": {
    image: "/studios/mohammadpur-art.jpg",
    from: "৳1,400",
    note: "Bright benches, kilns and printing bays",
  },
};

export default function CategoryShowcase() {
  const [active, setActive] = useState(CATEGORIES[0]);
  const visual = CATEGORY_VISUALS[active];

  return (
    <section className="section bg-base-200/70 border-y border-base-content/10">
      <div className="container-x grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 items-start">
        <div className="lg:sticky lg:top-28">
          <p className="eyebrow text-primary mb-4">Five disciplines</p>
          <h2 className="display text-[1.9rem] sm:text-4xl md:text-[3.1rem] max-w-md text-balance">
            Every discipline needs a{" "}
            <span className="serif italic">different room.</span>
          </h2>
          <p className="mt-5 max-w-sm text-sm md:text-[15px] leading-relaxed text-muted">
            From daylight coves to sound-treated suites — find a space built
            around the way you work, in the city where you work.
          </p>

          <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-2xl bg-base-300">
            {CATEGORIES.map((c) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={c}
                src={CATEGORY_VISUALS[c].image}
                alt={`${c} in Bangladesh`}
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                  c === active ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e79b23]">
                {active}
              </p>
              <p className="mt-1 text-sm text-white/80">{visual.note}</p>
            </div>
          </div>
        </div>

        <ul className="divide-y divide-base-content/10 border-y border-base-content/10">
          {CATEGORIES.map((c, i) => (
            <li key={c}>
              <Link
                href={`/studios?category=${encodeURIComponent(c)}`}
                onMouseEnter={() => setActive(c)}
                onFocus={() => setActive(c)}
                className={`group flex items-center gap-4 sm:gap-6 py-5 sm:py-6 transition-colors ${
                  active === c ? "text-base-content" : "text-base-content/55"
                } hover:text-base-content`}
              >
                <span className="w-7 text-[11px] font-medium text-faint tabular-nums">
                  0{i + 1}
                </span>
                <span className="flex-1 min-w-0">
                  <span
                    className={`block font-heading text-xl sm:text-2xl tracking-[-0.03em] transition-transform duration-300 ${
                      active === c ? "translate-x-1" : ""
                    }`}
                  >
                    {c}
                  </span>
                  <span className="mt-1 block text-xs text-muted truncate">
                    {CATEGORY_META[c]?.blurb} · from {CATEGORY_VISUALS[c].from}/hr
                  </span>
                </span>
                <span className="grid place-items-center w-9 h-9 rounded-full border border-base-content/15 shrink-0 transition-colors group-hover:bg-neutral group-hover:text-neutral-content group-hover:border-neutral">
                  <ArrowUpRight size={16} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
