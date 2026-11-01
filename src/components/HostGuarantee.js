import Link from "next/link";
import { ShieldCheck, BadgeCheck, Headset, ArrowUpRight } from "lucide-react";

const POINTS = [
  {
    icon: BadgeCheck,
    title: "Verified spaces",
    copy: "Before a room goes live we check the address, amenities and hourly rate. Hosts and renters both carry photo-verified identities.",
  },
  {
    icon: ShieldCheck,
    title: "Host guarantee",
    copy: "Gear damage is capped at the listed security deposit in taka. Cancellations are transparent — hosts see nothing until you confirm.",
  },
  {
    icon: Headset,
    title: "Creator support",
    copy: "Locked out before a golden-hour shoot in Cox's Bazar? Support answers around the clock, in Bangla or English, with a median reply under ten minutes.",
  },
];

export default function HostGuarantee() {
  return (
    <section className="section container-x">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/studios/banani-blackbox.jpg"
              alt="A film crew preparing a soundstage in Banani, Dhaka"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
            <div className="absolute left-5 right-5 bottom-5 flex items-center justify-between gap-3 rounded-xl border border-white/20 bg-black/35 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-2.5 text-white">
                <span className="grid place-items-center w-9 h-9 rounded-full bg-[#e79b23] text-[#14120c]">
                  <ShieldCheck size={17} />
                </span>
                <div>
                  <p className="text-[13px] font-medium leading-tight">Host guarantee</p>
                  <p className="text-[11px] text-white/60">On every confirmed booking</p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-white/70">24/7</span>
            </div>
          </div>
          <div className="absolute -bottom-5 -right-3 hidden sm:block rounded-2xl border border-base-content/10 bg-base-100 px-4 py-3 shadow-xl">
            <p className="font-heading font-semibold text-xl">300+</p>
            <p className="text-[11px] text-muted">sessions booked</p>
          </div>
        </div>

        <div>
          <p className="eyebrow text-primary mb-4">Built for both sides</p>
          <h2 className="display text-[1.9rem] sm:text-4xl md:text-[3rem] text-balance">
            A marketplace that takes your{" "}
            <span className="serif italic">work seriously.</span>
          </h2>
          <p className="mt-4 max-w-md text-sm md:text-[15px] leading-relaxed text-muted">
            Designed for real productions — not weekend getaways. Owners keep
            their spaces safe; creators keep their shoot days intact.
          </p>

          <ul className="mt-8 divide-y divide-base-content/10 border-y border-base-content/10">
            {POINTS.map((p) => (
              <li key={p.title} className="flex gap-4 py-5">
                <span className="grid place-items-center w-10 h-10 shrink-0 rounded-full bg-primary/10 text-primary">
                  <p.icon size={18} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="font-heading text-[15px] font-medium">{p.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{p.copy}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/how-it-works"
            className="mt-7 inline-flex items-center gap-2 text-sm font-medium border-b border-base-content/25 pb-1 hover:border-primary hover:text-primary transition-colors"
          >
            Read the host guarantee <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
