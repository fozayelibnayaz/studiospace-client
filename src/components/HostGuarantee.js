import { ShieldCheck, BadgeCheck, Wrench, Headset } from "lucide-react";
import SectionHeading from "./SectionHeading";

const CARDS = [
  {
    icon: ShieldCheck,
    title: "Liability Protection",
    copy: "Every booking is covered by our shared liability policy: gear damage is capped at the listed security deposit in taka, and hosts see nothing until you hit confirm.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Profiles",
    copy: "Hosts and renters both carry photo-verified identities. Before a studio goes live we check the Dhaka, Chattogram or Sylhet address, the amenities and the hourly rate on the ground.",
  },
  {
    icon: Wrench,
    title: "Equipment Safety",
    copy: "Amenities are declared per room — cyc walls, green screens, lighting grids, mixers — and documented in the overview. You always know what is house gear versus what to bring.",
  },
  {
    icon: Headset,
    title: "24/7 Host Support",
    copy: "Locked out at 6am before a golden-hour shoot at Cox's Bazar? Support is a message away around the clock, with a median first reply under ten minutes during Dhaka hours.",
  },
];

export default function HostGuarantee() {
  return (
    <section className="section-pad px-4 sm:px-6 max-w-7xl mx-auto">
      <SectionHeading
        eyebrow="Host Guarantee & Creator Support"
        title="Built to protect both sides of the studio door"
        subtitle="Owners keep their spaces safe; creators keep their shoot days intact. Two commitments we take seriously from Gulshan to Khulshi."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {CARDS.map((c) => (
          <div
            key={c.title}
            className="flex gap-5 card bg-base-100 border border-base-300 p-6 hover:border-primary/50 transition-colors items-start"
          >
            <span className="shrink-0 grid place-items-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
              <c.icon size={22} strokeWidth={1.9} />
            </span>
            <div>
              <h3 className="font-heading font-bold text-base">{c.title}</h3>
              <p className="mt-2 text-sm text-base-content/65 leading-relaxed">{c.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
