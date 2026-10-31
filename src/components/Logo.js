import Link from "next/link";
import { Aperture } from "lucide-react";

export default function Logo({ compact = false }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 group w-max"
      aria-label="StudioSpace home"
    >
      <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary text-primary-content shadow-sm group-hover:rotate-90 transition-transform duration-300">
        <Aperture size={20} strokeWidth={2.2} />
      </span>
      {!compact && (
        <span className="font-heading font-bold text-lg md:text-xl tracking-tight">
          Studio<span className="text-primary">Space</span>
        </span>
      )}
    </Link>
  );
}
