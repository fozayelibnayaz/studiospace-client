import Link from "next/link";
import { Aperture, ArrowLeft, ShieldCheck, Star } from "lucide-react";

/**
 * Split auth shell — editorial dark image panel on the left, form on the right.
 * Used by both Login and Register so the brand story stays consistent.
 */
export default function AuthShell({ image, eyebrow, quote, byline, children }) {
  return (
    <div className="pt-24 pb-16 md:pt-28 md:pb-24">
      <div className="container-x">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-medium text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft size={13} /> Back to StudioSpace
        </Link>

        <div className="grid overflow-hidden rounded-[1.75rem] border border-base-content/10 lg:grid-cols-2">
          {/* Visual panel */}
          <div className="relative hidden min-h-[38rem] bg-[#0d0d0b] lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0b] via-[#0d0d0b]/55 to-[#0d0d0b]/20" />

            <div className="relative flex h-full flex-col justify-between p-10">
              <Link href="/" className="flex items-center gap-2.5 text-[#f1eee5]">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e79b23] text-[#14120c]">
                  <Aperture size={18} strokeWidth={2.2} />
                </span>
                <span className="font-heading text-[15px] font-semibold tracking-tight">
                  Studio<span className="text-[#e79b23]">Space</span>
                </span>
              </Link>

              <div>
                <p className="eyebrow mb-4 text-[#e79b23]">{eyebrow}</p>
                <blockquote className="serif max-w-sm text-2xl leading-[1.25] text-[#f1eee5]">
                  {quote}
                </blockquote>
                <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-[#f1eee5]/50">
                  {byline}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/12 pt-5 text-[11px] text-[#f1eee5]/60">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-[#e79b23]" />
                    Verified hosts
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Star size={12} className="fill-[#e79b23] text-[#e79b23]" />
                    4.9 average rating
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form panel */}
          <div className="bg-base-100 px-6 py-10 sm:px-10 md:px-14 md:py-14">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
