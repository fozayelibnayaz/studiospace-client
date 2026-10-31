import { Search, Clock, CalendarCheck, Sparkles } from "lucide-react";
import SectionHeading from "./SectionHeading";

const STEPS = [
  {
    icon: Search,
    n: "01",
    title: "Discover Spaces",
    copy: "Search the catalog by craft, city and budget. Every listing shows the real floor plan, gear list and hourly price — no guesswork, no phone tag.",
  },
  {
    icon: Clock,
    n: "02",
    title: "Select Shoot Hours",
    copy: "Drag your date into the booking modal and pick exact start and end times. The live total updates as you choose hours, deposit shown upfront.",
  },
  {
    icon: CalendarCheck,
    n: "03",
    title: "Book Instantly",
    copy: "Confirm from your account — the studio is locked to you the moment the slot is free. Overlapping requests are auto-rejected, so double bookings can't happen.",
  },
  {
    icon: Sparkles,
    n: "04",
    title: "Create & Produce",
    copy: "Show up, plug in and make the thing. When the session wraps, your invoice and receipt land in My Bookings — ready to download as a PDF.",
  },
];

export default function HowBookingWorks() {
  return (
    <section className="section-pad px-4 sm:px-6 bg-base-200/50 border-y border-base-300/50">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="How Booking Works"
          title="Four steps from idea to final frame"
          subtitle="StudioSpace handles the schedule so you can spend your energy on the work."
        />
        <BookingSteps />
      </div>
    </section>
  );
}

/** Steps grid alone — reused on the How It Works page. */
export function BookingSteps() {
  return (
    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((s) => (
        <li
          key={s.n}
          className="card bg-base-100 border border-base-300 p-6 relative overflow-hidden group hover:border-primary/50 transition-colors"
        >
          <span className="absolute -top-3 -right-1 font-heading font-bold text-6xl text-base-content/5 select-none">
            {s.n}
          </span>
          <span className="inline-grid place-items-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-content transition-colors">
            <s.icon size={22} strokeWidth={1.9} />
          </span>
          <h3 className="font-heading font-bold text-base">{s.title}</h3>
          <p className="mt-2 text-sm text-base-content/65 leading-relaxed">{s.copy}</p>
        </li>
      ))}
    </ol>
  );
}
