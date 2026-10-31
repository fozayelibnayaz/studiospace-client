import Link from "next/link";
import {
  Target,
  Globe2,
  Aperture,
  Layers,
  HandCoins,
  ArrowRight,
} from "lucide-react";

import SectionHeading from "@/components/SectionHeading";

const STATS = [
  { icon: Layers, value: "5", label: "Craft categories served" },
  { icon: Globe2, value: "6+", label: "Cities with active listings" },
  { icon: Aperture, value: "100%", label: "Owner-verified studio accounts" },
  { icon: HandCoins, value: "$0", label: "Platform commission during beta" },
];

export default function AboutPage() {
  return (
    <>
      {/* Mission hero */}
      <section className="bg-primary/5 border-b border-base-300/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          <span className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-primary text-primary-content mb-5">
            <Aperture size={28} strokeWidth={2} />
          </span>
          <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight">
            Every city already has the studios. We make them visible.
          </h1>
          <p className="mt-5 text-sm md:text-base text-base-content/70 leading-relaxed">
            StudioSpace exists because brilliant work gets postponed over
            logistics. A producer needs a blacked-out stage on Tuesday; a
            window-soft portrait loft goes unused the same Tuesday. Our
            platform puts both in the same calendar — honest rates, exact
            hours, verified owners — so the shoot happens.
          </p>
        </div>
      </section>

      {/* Numbers strip */}
      <section className="border-b border-base-300/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <s.icon size={18} className="mx-auto mb-2 text-primary" />
              <p className="font-heading font-bold text-3xl text-primary">{s.value}</p>
              <p className="text-xs text-base-content/55 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we believe / how we operate */}
      <section className="section-pad px-4 sm:px-6 max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Our approach"
          title="Two users, one honest system"
          subtitle="Marketplaces fail when one side is invisible. We designed for both sides explicitly."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card bg-base-100 border border-base-300 p-7">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2">
              <Aperture size={19} className="text-primary" /> For creators
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-base-content/70 leading-relaxed">
              <li className="flex gap-2.5">
                <ArrowRight size={15} className="text-primary shrink-0 mt-0.5" />
                Compare rooms by the criteria that matter: cyc wall size, gear,
                ceiling height in facts, not vibes.
              </li>
              <li className="flex gap-2.5">
                <ArrowRight size={15} className="text-primary shrink-0 mt-0.5" />
                Reserve exact windows and trust the calendar — overlaps are
                blocked server-side before money is discussed.
              </li>
              <li className="flex gap-2.5">
                <ArrowRight size={15} className="text-primary shrink-0 mt-0.5" />
                Keep every session organised in My Bookings with downloadable
                invoices for confirmed time.
              </li>
            </ul>
          </div>
          <div className="card bg-base-100 border border-base-300 p-7">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2">
              <Target size={19} className="text-primary" /> For owners
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-base-content/70 leading-relaxed">
              <li className="flex gap-2.5">
                <ArrowRight size={15} className="text-primary shrink-0 mt-0.5" />
                Publish the real room — rates, deposits, capacity — in a listing
                form that takes minutes, not a negotiation.
              </li>
              <li className="flex gap-2.5">
                <ArrowRight size={15} className="text-primary shrink-0 mt-0.5" />
                Keep the calendar true automatically: double bookings are
                impossible by design, not by discipline.
              </li>
              <li className="flex gap-2.5">
                <ArrowRight size={15} className="text-primary shrink-0 mt-0.5" />
                Manage everything from your dashboard: update listings
                anytime, see saves on your wishlist, get support around the
                clock.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad px-4 sm:px-6 bg-base-200/50 border-y border-base-300/50">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Terms we keep"
            title="Operating principles"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                t: "Clarity over hype",
                c: "Listings describe rooms in specifics. If the cyc wall is five metres wide, the copy says five metres — not “spacious”.",
              },
              {
                t: "Safety before scale",
                c: "We verify hosts before listings and cap disputes deposit-first so neither side is ever holding an unwinnable bill.",
              },
              {
                t: "Craft is the customer",
                c: "Our five categories map to real production needs: photo, film, audio, music and hands-on art — nothing else clutters the catalog.",
              },
              {
                t: "Payments stay simple",
                c: "During beta the platform adds zero commission. Studio fees are settled directly between creator and host; documents here keep the paper trail.",
              },
            ].map((v) => (
              <div key={v.t} className="card bg-base-100 border border-base-300 p-6">
                <h3 className="font-heading font-bold">{v.t}</h3>
                <p className="mt-2 text-sm text-base-content/65 leading-relaxed">{v.c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founding-with-CTA */}
      <section className="section-pad px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <SectionHeading
          eyebrow="Built by creators"
          title="Made in Dhaka, used wherever hours matter"
          subtitle="StudioSpace started with a photographer who kept losing golden hour to scheduling chaos. It now serves crews across Bangladesh and beyond — Berlin podcasters included."
        />
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/studios" className="btn btn-primary">
            Explore Studios
          </Link>
          <Link href="/add-studio" className="btn btn-outline">
            Host Your Space
          </Link>
        </div>
      </section>
    </>
  );
}
