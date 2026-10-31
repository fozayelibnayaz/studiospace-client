import { Suspense } from "react";

import ExploreStudios from "@/components/ExploreStudios";
import StudioCardSkeleton from "@/components/StudioCardSkeleton";

export const metadata = {
  title: "Explore Studios",
  description:
    "Browse every studio listing on StudioSpace — photo studios, film stages, podcast lounges, music suites and art workshops.",
};

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <section className="section-pad px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="skeleton h-10 w-72 mx-auto mb-4" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10">
            {Array.from({ length: 6 }, (_, i) => (
              <StudioCardSkeleton key={i} />
            ))}
          </div>
        </section>
      }
    >
      <ExploreStudios />
    </Suspense>
  );
}
