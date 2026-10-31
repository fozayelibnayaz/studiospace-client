"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { apiRequest } from "@/lib/api";
import SectionHeading from "./SectionHeading";
import StudioCard from "./StudioCard";
import StudioCardSkeleton from "./StudioCardSkeleton";
import EmptyState from "./EmptyState";

export default function FeaturedStudios() {
  const [studios, setStudios] = useState(null);
  const [error, setError] = useState(null);
  const alive = useRef(true);

  useEffect(() => {
    apiRequest("/studios?limit=6&sort=rating")
      .then((d) => alive.current && setStudios(d))
      .catch((e) => alive.current && setError(e));
    return () => {
      alive.current = false;
    };
  }, []);

  return (
    <section className="section-pad px-4 sm:px-6 max-w-7xl mx-auto">
      <SectionHeading
        eyebrow="Featured Spaces"
        title="Top-rated studios this season"
        subtitle="Highest reviewed spaces across every category — from cyc-wall photo floors to mastering suites."
      />

      {error ? (
        <EmptyState
          title="Couldn't load studios"
          message={error.message || "Our studio catalog is unreachable right now. Please try again shortly."}
          ctaLabel="Try Again"
          ctaHref="/"
        />
      ) : (
        <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios === null
            ? Array.from({ length: 6 }, (_, i) => <StudioCardSkeleton key={i} />)
            : studios.map((s) => <StudioCard key={s._id} studio={s} />)}
        </div>
      )}

      <div className="text-center mt-10">
        <Link href="/studios" className="btn btn-outline btn-md px-6">
          Browse the full catalog <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  );
}
