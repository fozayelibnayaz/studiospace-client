import Link from "next/link";
import { Aperture, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="grid min-h-[80vh] flex-1 place-items-center px-4 pt-24">
      <div className="max-w-lg text-center">
        <div className="relative mb-7 inline-grid place-items-center">
          <Aperture
            size={72}
            strokeWidth={1.1}
            className="rotate-12 text-[#e79b23]/30"
          />
          <span className="absolute font-heading text-4xl font-semibold tracking-[-0.04em] text-[#e79b23]">
            404
          </span>
        </div>
        <h1 className="display text-3xl md:text-4xl">
          This studio is <span className="serif italic">dark.</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted md:text-[15px]">
          The page you are looking for was moved, deleted or never lit up in the
          first place. The spotlight is on — let&apos;s get you back on set.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-neutral px-6 text-sm font-medium text-neutral-content transition-opacity hover:opacity-90"
          >
            <Home size={15} /> Return home
          </Link>
          <Link
            href="/studios"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-base-content/20 px-6 text-sm font-medium transition-colors hover:bg-base-content/5"
          >
            <Search size={15} /> Explore studios
          </Link>
        </div>
      </div>
    </div>
  );
}
