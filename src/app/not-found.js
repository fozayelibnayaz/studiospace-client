import Link from "next/link";
import { Aperture, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex-1 grid place-items-center bg-base-200/40 px-4">
      <div className="text-center max-w-lg">
        {/* Aperture "missing focus" mark */}
        <div className="relative inline-grid place-items-center mb-6">
          <Aperture
            size={64}
            strokeWidth={1.4}
            className="text-primary/30 rotate-12"
          />
          <span className="absolute font-heading font-bold text-4xl text-primary">
            404
          </span>
        </div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold">
          This studio is dark
        </h1>
        <p className="mt-3 text-sm md:text-base text-base-content/60 leading-relaxed">
          The page you are looking for was moved, deleted or never lit up in
          the first place. The spotlight is on — let&apos;s get you back on set.
        </p>
        <div className="mt-7 flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn btn-primary">
            <Home size={16} /> Return to Home
          </Link>
          <Link href="/studios" className="btn btn-outline">
            <Search size={16} /> Explore Studios
          </Link>
        </div>
      </div>
    </div>
  );
}
