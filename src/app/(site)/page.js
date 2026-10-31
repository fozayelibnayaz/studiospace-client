import Link from "next/link";
import { Aperture } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex-1">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
          Coming online — build in progress
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
          Book creative spaces with a{" "}
          <span className="text-spotlight">spotlight</span> on detail.
        </h1>
        <p className="mt-5 text-sm sm:text-base md:text-lg text-base-content/65 max-w-xl mx-auto">
          Photo studios, film stages, podcast lounges, music suites and art
          workshops — rented by the hour, straight from verified owners.
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <Link href="/studios" className="btn btn-primary">
            Explore Studios
          </Link>
          <Link href="/studios" className="btn btn-outline">
            Host Your Space
          </Link>
        </div>
      </section>
    </main>
  );
}
