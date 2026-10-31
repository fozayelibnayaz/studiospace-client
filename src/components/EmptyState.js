import Link from "next/link";
import { FolderSearch } from "lucide-react";

export default function EmptyState({ title, message, ctaLabel, ctaHref, icon: Icon = FolderSearch }) {
  return (
    <div className="text-center py-16 md:py-24 px-4">
      <div className="inline-grid place-items-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6">
        <Icon size={36} strokeWidth={1.8} />
      </div>
      <h3 className="font-heading text-xl md:text-2xl font-bold">{title}</h3>
      <p className="mt-2 text-sm md:text-base text-base-content/60 max-w-md mx-auto leading-relaxed">
        {message}
      </p>
      {ctaHref && ctaLabel && (
        <Link href={ctaHref} className="btn btn-primary mt-6">
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
