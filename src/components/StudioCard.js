import Link from "next/link";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import BookingModal from "./BookingModal";
import { useState } from "react";

import { bdt } from "@/lib/format";
import WishlistButton from "./WishlistButton";

const FALLBACK_IMAGE = "/studios/gulshan-glasshouse.jpg";

const imageFor = (studio) => {
  const src = studio.image?.trim();
  if (!src) return FALLBACK_IMAGE;
  return src.startsWith("http") || src.startsWith("/") ? src : FALLBACK_IMAGE;
};

/** Area label without the street address — "Gulshan 1, Dhaka" not full line. */
const areaOf = (studio) => {
  const parts = String(studio.location || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length >= 2 ? parts.slice(-2).join(", ") : parts[0] || "Bangladesh";
};

/**
 * Editorial studio card — shared by the home page, explore grid and wishlist.
 * Image-led, quiet metadata, taka price. The heart sits outside the link
 * so the card stays keyboard-accessible and never nests controls.
 */
export default function StudioCard({ studio }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative overflow-hidden rounded-2xl bg-base-200">
        <Link
          href={`/studios/${studio._id}`}
          className="block aspect-[4/3] overflow-hidden"
          aria-label={`View ${studio.title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageFor(studio)}
            alt={studio.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />
        </Link>

        <span className="pointer-events-none absolute top-3 left-3 rounded-full border border-white/25 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-white backdrop-blur-md">
          {studio.category}
        </span>

        <div className="absolute top-2.5 right-2.5">
          <WishlistButton studio={studio} />
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-[1.05rem] leading-snug font-medium tracking-[-0.02em]">
            <Link href={`/studios/${studio._id}`} className="hover:text-primary transition-colors">
              {studio.title}
            </Link>
          </h3>
          <span className="flex items-center gap-1 text-xs text-muted shrink-0 pt-1">
            <Star size={12} className="fill-[#e79b23] text-[#e79b23]" />
            {Number(studio.rating || 0).toFixed(1)}
          </span>
        </div>

        <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-muted">
          <MapPin size={13} className="shrink-0 text-[#e79b23]" />
          <span className="truncate">{areaOf(studio)}</span>
        </p>

        <div className="mt-auto pt-4 flex items-end justify-between gap-3 border-t border-base-content/10 mt-4">
          <p className="font-heading font-semibold text-[1.05rem]">
            {bdt(studio.hourlyRate)}
            <span className="text-xs font-normal text-faint"> / hour</span>
          </p>
          <button
            onClick={() => setBookingOpen(true)}
            className="inline-flex items-center gap-1 rounded-full bg-amber-500 text-[#14120c] font-bold text-xs px-3 py-1.5 hover:bg-amber-400 transition shadow-md shadow-amber-900/20 whitespace-nowrap"
          >
            Book now
          </button>
          <Link
            href={`/studios/${studio._id}`}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-muted hover:text-primary transition-colors"
          >
            View details <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
