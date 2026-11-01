import Link from "next/link";
import {
  Target,
  Globe2,
  Aperture,
  Layers,
  HandCoins,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

const STATS = [
  { icon: Layers, value: "5", label: "Craft categories served" },
  { icon: Globe2, value: "6+", label: "Bangladeshi cities with listings" },
  { icon: Aperture, value: "100%", label: "Owner-verified studio accounts" },
  { icon: HandCoins, value: "৳0", label: "Platform commission during beta" },
];

const BELIEFS = [
  {
    icon: Aperture,
    title: "For creators",
    points: [
      "Compare rooms by the criteria that matter: cyc wall size, gear, ceiling height and city — facts, not vibes.",
      "Reserve exact windows and trust the calendar — overlaps are blocked server-side before money is discussed.",
      "Keep every session organised in My Bookings with downloadable PDF invoices in BDT for confirmed time.",
    ],
  },
  {
    icon: Target,
    title: "For owners",
    points: [
      "Publish the real room — rates, deposits, capacity — in a listing form that takes minutes, not a negotiation.",
      "Keep the calendar true automatically: double bookings are impossible by design, not by discipline.",
      "Manage everything from your dashboard: update listings anytime, see saves on your wishlist, get support around the clock.",
    ],
  },
];

const PRINCIPLES = [
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
    c: "During beta the platform adds zero commission. Studio fees are settled directly with the host by bKash, Nagad or cash, and the invoice in BDT keeps the paper trail.",
  },
];

export const metadata = {
  title: "About",
  description:
    "Why StudioSpace exists: making Bangladesh's best creative rooms visible, bookable and honest — for creators and hosts alike.",
};

export default function AboutPage() {
  return (
    <>
      {/* Mission hero */}
      <section className="relative overflow-hidden bg-[#0d0d0b] text-[#f1eee5]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/studios/old-dhaka-baul.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0b] via-[#0d0d0b]/85 to-[#0d0d0b]/35" />
        <div className="container-x relative pt-36 pb-20 md:pt-44 md:pb-28">
          <p className="eyebrow mb-5 text-[#e79b23]">About StudioSpace</p>
          <h1 className="display max-w-3xl text-[2.4rem] leading-[0.98] sm:text-5xl md:text-[4.4rem]">
            Every city already has the studios.{" "}
            <span className="serif italic text-[#f7f3e9]">
              We make them visible.
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-relaxed text-[#f1eee5]/65 md:text-base">
            StudioSpace exists because brilliant work in Bangladesh gets
            postponed over logistics. A producer in Tejgaon needs a blacked-out
            stage on Tuesday; a window-soft portrait loft in Dhanmondi sits
            unused the same Tuesday. Our platform puts both in one calendar —
            honest taka rates, exact hours, verified owners — so the shoot
            happens.
          </p>
        </div>
      </section>

      {/* Numbers strip */}
      <section className="border-b border-base-content/10 bg-base-200/40">
        <div className="container-x grid grid-cols-2 gap-px overflow-hidden md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="px-4 py-8 text-center">
              <s.icon size={17} className="mx-auto mb-2 text-[#e79b23]" />
              <p className="font-heading text-3xl font-semibold tracking-[-0.04em]">
                {s.value}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-faint">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Two users, one system */}
      <section className="section container-x">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow mb-4 text-primary">Our approach</p>
          <h2 className="display text-[1.8rem] sm:text-4xl md:text-[2.9rem] text-balance">
            Two users, <span className="serif italic">one honest system.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Marketplaces fail when one side is invisible. We designed for both
            sides explicitly.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-base-content/10 bg-base-content/10 md:grid-cols-2">
          {BELIEFS.map((b) => (
            <div key={b.title} className="bg-base-100 p-7 md:p-8">
              <h3 className="flex items-center gap-2 font-heading text-lg font-medium">
                <b.icon size={18} className="text-[#e79b23]" /> {b.title}
              </h3>
              <ul className="mt-5 space-y-4">
                {b.points.map((p) => (
                  <li
                    key={p}
                    className="flex gap-2.5 text-[13.5px] leading-relaxed text-muted"
                  >
                    <ArrowRight
                      size={14}
                      className="mt-1 shrink-0 text-[#e79b23]"
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="section border-y border-base-content/10 bg-base-200/50">
        <div className="container-x">
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow mb-4 text-primary">Terms we keep</p>
            <h2 className="display text-[1.8rem] sm:text-4xl md:text-[2.9rem]">
              Operating <span className="serif italic">principles.</span>
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-base-content/10 bg-base-content/10 sm:grid-cols-2">
            {PRINCIPLES.map((v, i) => (
              <div key={v.t} className="bg-base-100 p-7">
                <span className="font-heading text-[11px] font-semibold tracking-[0.18em] text-faint">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-heading text-[15px] font-medium">
                  {v.t}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  {v.c}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="section container-x">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-4 justify-center text-primary">
            Built by creators
          </p>
          <h2 className="display text-[1.9rem] sm:text-4xl md:text-[3rem] text-balance">
            Made in Dhaka,{" "}
            <span className="serif italic">built for Bangladesh.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
            StudioSpace started with a Dhaka photographer who kept losing golden
            hour to scheduling chaos. It now serves crews from Cox&apos;s Bazar to
            Rajshahi — and every studio between.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/studios"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-neutral px-6 text-sm font-medium text-neutral-content transition-opacity hover:opacity-90"
            >
              Explore studios <ArrowRight size={15} />
            </Link>
            <Link
              href="/add-studio"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-base-content/20 px-6 text-sm font-medium transition-colors hover:bg-base-content/5"
            >
              Host your space <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
