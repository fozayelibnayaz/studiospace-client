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
} from "lucide-react";

import SectionHeading from "@/components/SectionHeading";
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
    icon: MessageCircleHeartSafe,
    title: "Support in hours, not days",
    copy: "Creators work odd hours; so do we. Support replies around the clock in Bangla or English, and hosts get payout help by bKash or bank transfer whenever they need it.",
  },
];

function MessageCircleHeartSafe(props) {
  // alias keeps the icon vocabulary local without another top-level import
  return <BadgeCheck {...props} />;
}

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero copy */}
      <section className="bg-primary/5 border-b border-base-300/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
            How StudioSpace works
          </p>
          <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight">
            From idea to invoice, without the phone tag
          </h1>
          <p className="mt-4 text-sm md:text-base text-base-content/70 leading-relaxed">
            StudioSpace is Bangladesh's peer-to-peer marketplace for creative
            production spaces. Owners publish their rooms with real taka
            rates; creators discover them, reserve exact hours and produce the
            work. Here is the whole journey.
          </p>
        </div>
      </section>

      {/* Four steps */}
      <section className="section-pad px-4 sm:px-6 max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="The flow"
          title="Booking in four steps"
          subtitle="The same steps whether you are shooting a lookbook, cutting a pilot episode, tracking an EP or glazing mugs."
        />
        <BookingSteps />
      </section>

      {/* What we stand for */}
      <section className="section-pad px-4 sm:px-6 bg-base-200/50 border-y border-base-300/50">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Why it holds together"
            title="Four guarantees underneath every booking"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="flex gap-4 card bg-base-100 border border-base-300 p-6 items-start"
              >
                <span className="shrink-0 grid place-items-center w-11 h-11 rounded-xl bg-primary/10 text-primary">
                  <p.icon size={20} strokeWidth={1.9} />
                </span>
                <div>
                  <h3 className="font-heading font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm text-base-content/65 leading-relaxed">
                    {p.copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories strip */}
      <section className="section-pad px-4 sm:px-6 max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Five crafts, one platform"
          title="Which space do you need?"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            [Camera, "Photo Studio"],
            [Clapperboard, "Film Stage"],
            [Mic, "Podcast Lounge"],
            [Music, "Music Suite"],
            [Palette, "Art Workshop"],
          ].map(([Icon, label]) => (
            <Link
              key={label}
              href={`/studios?category=${encodeURIComponent(label)}`}
              className="group card bg-base-100 border border-base-300 hover:border-primary/60 transition-colors items-center text-center p-6 gap-2"
            >
              <Icon size={26} strokeWidth={1.7} className="text-primary" />
              <span className="font-heading font-semibold text-sm">{label}</span>
              <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Browse <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Host guarantee (shared with home) */}
      <HostGuarantee />

      {/* CTA */}
      <section className="px-4 sm:px-6 pb-16 md:pb-24 max-w-7xl mx-auto">
        <div className="card bg-primary text-primary-content p-8 md:p-12 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">
            Ready to put your room to work?
          </h2>
          <p className="mt-2 opacity-80 text-sm md:text-base">
            List your studio in minutes, or find your next shoot day now.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/studios" className="btn btn-neutral">
              Explore Studios
            </Link>
            <Link
              href="/add-studio"
              className="btn btn-outline border-primary-content/40 hover:bg-primary-content/10"
            >
              Host Your Space
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
