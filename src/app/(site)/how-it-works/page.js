import Link from "next/link";
import {
  Camera,
  Clapperboard,
  Mic,
  Music,
  Palette,
  ArrowRight,
  Banknote,
  BadgeCheck,
  ShieldCheck,
  MessagesSquare,
} from "lucide-react";

import { BookingSteps } from "@/components/HowBookingWorks";
import HostGuarantee from "@/components/HostGuarantee";

const PILLARS = [
  {
    icon: Banknote,
    title: "Transparent pricing",
    copy: "The hourly rate in taka and the refundable security deposit are printed on every listing. What you see in the booking modal is what you settle with the host — no finder's fee is added.",
  },
  {
    icon: BadgeCheck,
    title: "Owner-verified listings",
    copy: "Studios go live only after the host account confirms ownership and the amenity list. Photos must show the actual bookable room in Dhaka, Chattogram or wherever it stands — never a stock rep.",
  },
  {
    icon: ShieldCheck,
    title: "Conflict-free scheduling",
    copy: "The server rejects overlapping pending or confirmed slots instantly, so the calendar you see is the calendar that is true.",
  },
  {
    icon: MessagesSquare,
    title: "Support in hours, not days",
    copy: "Creators work odd hours; so do we. Support replies around the clock in Bangla or English, and hosts get payout help by bKash or bank transfer whenever they need it.",
  },
];

const CATEGORY_LINKS = [
  [Camera, "Photo Studio"],
  [Clapperboard, "Film Stage"],
  [Mic, "Podcast Lounge"],
  [Music, "Music Suite"],
  [Palette, "Art Workshop"],
];

export const metadata = {
  title: "How it works",
  description:
    "How booking works on StudioSpace: search a verified room, reserve exact hours in BDT, settle with bKash or Nagad, and walk in ready.",
};

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero copy */}
      <section className="border-b border-base-content/10 bg-base-200/40">
        <div className="container-x pt-36 pb-16 text-center md:pt-44 md:pb-24">
          <p className="eyebrow mb-5 justify-center text-primary">
            How StudioSpace works
          </p>
          <h1 className="display mx-auto max-w-3xl text-[2.3rem] leading-[0.99] sm:text-5xl md:text-[4rem] text-balance">
            From idea to invoice,{" "}
            <span className="serif italic">without the phone tag.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted md:text-base">
            StudioSpace is Bangladesh&apos;s peer-to-peer marketplace for
            creative production spaces. Owners publish their rooms with real
            taka rates; creators discover them, reserve exact hours and produce
            the work. Here is the whole journey.
          </p>
        </div>
      </section>

      {/* Four steps */}
      <section className="section container-x">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="eyebrow mb-4 text-primary">The flow</p>
            <h2 className="display text-[1.8rem] sm:text-4xl md:text-[2.9rem]">
              Booking in <span className="serif italic">four steps.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              The same steps whether you are shooting a lookbook, cutting a pilot
              episode, tracking an EP or glazing mugs.
            </p>
          </div>
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-faint md:block">
            04 steps · one afternoon
          </span>
        </div>
        <BookingSteps />
      </section>

      {/* Guarantees */}
      <section className="section border-y border-base-content/10 bg-base-200/50">
        <div className="container-x">
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow mb-4 text-primary">Why it holds together</p>
            <h2 className="display text-[1.8rem] sm:text-4xl md:text-[2.9rem]">
              Four guarantees{" "}
              <span className="serif italic">under every booking.</span>
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-base-content/10 bg-base-content/10 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <div key={p.title} className="flex items-start gap-4 bg-base-100 p-7">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-base-content/10 text-[#e79b23]">
                  <p.icon size={18} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="font-heading text-[15px] font-medium">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    {p.copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories strip */}
      <section className="section container-x">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow mb-4 text-primary">Five crafts, one platform</p>
          <h2 className="display text-[1.8rem] sm:text-4xl md:text-[2.9rem]">
            Which space <span className="serif italic">do you need?</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORY_LINKS.map(([Icon, label]) => (
            <Link
              key={label}
              href={`/studios?category=${encodeURIComponent(label)}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-base-content/10 p-6 text-center transition-colors hover:border-[#e79b23]/50 hover:bg-base-200/40"
            >
              <Icon
                size={26}
                strokeWidth={1.6}
                className="text-[#e79b23]"
              />
              <span className="font-heading text-[13px] font-medium">
                {label}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-muted opacity-0 transition-opacity group-hover:opacity-100">
                Browse <ArrowRight size={11} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Host guarantee (shared with home) */}
      <HostGuarantee />

      {/* CTA */}
      <section className="container-x pb-16 md:pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0d0d0b] px-6 py-14 text-center text-[#f1eee5] sm:px-12 md:py-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/studios/chattogram-stage.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0b] via-[#0d0d0b]/70 to-[#0d0d0b]/40" />
          <div className="relative mx-auto max-w-xl">
            <h2 className="display text-3xl sm:text-5xl">
              Ready to put your room{" "}
              <span className="serif italic">to work?</span>
            </h2>
            <p className="mt-4 text-sm text-[#f1eee5]/65">
              List your studio in minutes, or find your next shoot day now.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/studios"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#f1eee5] px-6 text-sm font-medium text-[#141311] transition-colors hover:bg-white"
              >
                Explore studios <ArrowRight size={15} />
              </Link>
              <Link
                href="/add-studio"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-sm font-medium transition-colors hover:bg-white/10"
              >
                Host your space
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
