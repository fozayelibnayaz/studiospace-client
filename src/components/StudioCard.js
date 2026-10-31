import Link from "next/link";
import { MapPin, Star } from "lucide-react";

import WishlistButton from "./WishlistButton";

const img = (studio) =>
  studio.image?.startsWith("http")
    ? studio.image
    : `https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&w=900&q=80`;

/**
 * Unified studio card — used on Home (featured) and Explore grids.
 * Fixed aspect 4/3 cover image; equal heights in grid; one consistent CTA.
 */
export default function StudioCard({ studio }) {
  return (
    <Link
      href={`/studios/${studio._id}`}
      className="group card bg-base-100 border border-base-300 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 h-full flex flex-col overflow-hidden"
    >
      <figure className="relative aspect-[4/3] overflow-hidden m-0">
        {/* next/image is intentionally avoided for arbitrary remote showcases;
            object-cover keeps every crop identical */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img(studio)}
          alt={studio.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 badge badge-primary text-xs font-semibold uppercase tracking-wide">
          {studio.category}
        </span>
      </figure>

      <div className="card-body p-5 gap-2 flex-1 items-start">
        <h3 className="card-title font-heading text-base md:text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {studio.title}
        </h3>
        <p className="flex items-center gap-1.5 text-xs md:text-sm text-base-content/60">
          <MapPin size={14} className="text-primary shrink-0" />
          <span className="truncate">{studio.location}</span>
        </p>

        <div className="mt-1 flex items-center gap-1 text-sm">
          <Star size={15} className="fill-warning text-warning" />
          <span className="font-semibold">{Number(studio.rating).toFixed(1)}</span>
          <span className="text-base-content/50 text-xs">
            ({studio.totalReviews || 0} reviews)
          </span>
        </div>

        <div className="card-actions mt-auto pt-3 w-full items-center justify-between">
          <p className="font-heading font-bold text-lg">
            ${studio.hourlyRate}
            <span className="text-xs font-normal text-base-content/55"> / hr</span>
          </p>
          <span className="flex items-center">
            <span className="text-primary font-semibold text-sm group-hover:underline underline-offset-4">
              View Details
            </span>
            <WishlistButton studio={studio} />
          </span>
        </div>
      </div>
    </Link>
  );
}
