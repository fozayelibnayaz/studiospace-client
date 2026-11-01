"use client";

import { useRouter } from "next/navigation";
import { Camera, Clapperboard, Mic, Music, Palette, ArrowRight } from "lucide-react";

import { CATEGORIES, CATEGORY_META } from "@/lib/constants";
import SectionHeading from "./SectionHeading";

const ICONS = {
  "Photo Studio": Camera,
  "Film Stage": Clapperboard,
  "Podcast Lounge": Mic,
  "Music Suite": Music,
  "Art Workshop": Palette,
};

export default function CategoryCards() {
  const router = useRouter();

  return (
    <section className="section-pad px-4 sm:px-6 max-w-7xl mx-auto">
      <SectionHeading
        eyebrow="Categories"
        title="Browse spaces by craft"
        subtitle="Five purpose-built categories, verified hosts from Dhaka to Cox's Bazar. Pick yours and filter instantly."
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((c) => {
          const Icon = ICONS[c];
          return (
            <button
              key={c}
              type="button"
              onClick={() => router.push(`/studios?category=${encodeURIComponent(c)}`)}
              aria-label={`Browse ${c} listings`}
              className="group card bg-base-200/60 border border-base-300 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 text-center items-center p-6 gap-3"
            >
              <span className="grid place-items-center w-14 h-14 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-content transition-all duration-300">
                <Icon size={26} strokeWidth={1.9} />
              </span>
              <span className="font-heading font-semibold text-sm md:text-base leading-tight">
                {c}
              </span>
              <span className="text-[11px] md:text-xs text-base-content/55 leading-snug">
                {CATEGORY_META[c]?.blurb}
              </span>
              <span className="text-primary/70 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={16} />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
