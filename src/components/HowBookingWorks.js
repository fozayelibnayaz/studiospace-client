import { Search, ShieldCheck, CalendarCheck, DoorOpen } from "lucide-react";
import SectionHeading from "./SectionHeading";

const STEPS = [
  {
    icon: Search,
    n: "01",
    title: "Discover Spaces",
    copy: "Filter by craft, city, capacity and budget. Every listing shows the real room, gear list and hourly rate in taka — no guesswork, no phone tag.",
  },
  {
    icon: ShieldCheck,
    n: "02",
    title: "Select Shoot Hours",
    copy: "Know what you're getting: clear rates, verified amenities, honest reviews and a refundable deposit shown upfront. The room in the photo is the room you book.",
  },
  {
    icon: CalendarCheck,
    n: "03",
    title: "Book Instantly",
    copy: "Reserve exact hours with transparent BDT pricing. Overlapping requests are rejected server-side, so your slot stays exclusively yours.",
  },
  {
    icon: DoorOpen,
    n: "04",
    title: "Create & Produce",
    copy: "Settle with the host by bKash, Nagad or cash on arrival, coordinate load-in, and download your PDF invoice from My Bookings.",
  },
];

export default function HowBookingWorks() {
  return (
    <section className="section container-x">
      <SectionHeading
        eyebrow="From idea to action"
        title={
          <>
            Booking, without the{" "}
            <span className="serif italic">production drama.</span>
          </>
        }
        subtitle="StudioSpace handles the calendar, the deposit and the paperwork, so your energy goes into the work."
        action={
          <span className="hidden md:block text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
            04 steps · one afternoon
          </span>
        }
      />
      <BookingSteps />
    </section>
  );
}

/** Steps grid alone — reused on the How It Works page. */
export function BookingSteps() {
  return (
    <ol className="grid gap-px overflow-hidden rounded-2xl border border-base-content/10 bg-base-content/10 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((s) => (
        <li
          key={s.n}
          className="group relative bg-base-100 p-6 md:p-7 transition-colors hover:bg-base-200/60"
        >
          <div className="flex items-center justify-between">
            <span className="grid place-items-center w-10 h-10 rounded-full border border-base-content/12 text-primary transition-colors group-hover:bg-primary group-hover:border-primary group-hover:text-primary-content">
              <s.icon size={18} strokeWidth={1.8} />
            </span>
            <span className="font-heading text-xs font-semibold tracking-[0.18em] text-faint">
              {s.n}
            </span>
          </div>
          <h3 className="mt-6 font-heading text-[1.05rem] font-medium tracking-[-0.02em]">
            {s.title}
          </h3>
          <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{s.copy}</p>
        </li>
      ))}
    </ol>
  );
}
