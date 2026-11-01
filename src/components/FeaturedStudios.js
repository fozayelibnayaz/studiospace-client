"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { apiRequest } from "@/lib/api";
import SectionHeading from "./SectionHeading";
import StudioCard from "./StudioCard";
import StudioCardSkeleton from "./StudioCardSkeleton";
import EmptyState from "./EmptyState";

export default function FeaturedStudios() {
  const [studios, setStudios] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false; // StrictMode-safe: must be per-effect-run
    apiRequest("/studios?limit=6&sort=rating")
      .then((d) => !cancelled && setStudios(d))
      .catch((e) => !cancelled && setError(e));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="section container-x">
      <SectionHeading
        eyebrow="Independent studios"
        title={
          <>
            Rooms with a{" "}
            <span className="serif italic">point of view.</span>
          </>
        }
        subtitle="Chosen for their light, equipment and character — not their listing count. Every room is verified, every rate is in taka."
        action={
          <Link
            href="/studios"
            className="group inline-flex items-center gap-2 text-sm font-medium border-b border-base-content/25 pb-1 hover:border-primary hover:text-primary transition-colors"
          >
            View all studios
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        }
      />

      {error ? (
        <EmptyState
          title="Couldn't load studios"
          message={
            error.message ||
            "Our studio catalogue is unreachable right now. Please try again shortly."
          }
          ctaLabel="Try again"
          ctaHref="/"
        />
      ) : (
        <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 md:gap-x-6">
          {studios === null
            ? Array.from({ length: 6 }, (_, i) => <StudioCardSkeleton key={i} />)
            : studios.map((s) => <StudioCard key={s._id} studio={s} />)}
        </div>
      )}

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-base-content/10 pt-6 text-xs text-faint">
        <p>12 curated rooms · 5 disciplines · 5 cities</p>
        <p className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e79b23]" />
          New rooms added weekly
        </p>
      </div>
    </section>
  );
}
