import Link from "next/link";
import { FolderSearch, ArrowRight } from "lucide-react";

export default function EmptyState({
  title,
  message,
  ctaLabel,
  ctaHref,
  icon: Icon = FolderSearch,
}) {
  return (
    <div className="px-4 py-20 text-center md:py-28">
      <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full border border-base-content/10 bg-base-200/60 text-[#e79b23]">
        <Icon size={26} strokeWidth={1.6} />
      </div>
      <h3 className="display text-xl md:text-2xl">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
        {message}
      </p>
      {ctaHref && ctaLabel && (
        <Link
          href={ctaHref}
          className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-neutral px-5 text-[13px] font-medium text-neutral-content transition-opacity hover:opacity-90"
        >
          {ctaLabel} <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
