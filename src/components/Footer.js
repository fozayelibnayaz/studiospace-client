"use client";

import Link from "next/link";
import { Aperture, ArrowUpRight, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

/** X (the rebrand) — NOT the old Twitter bird. */
function XIcon({ size = 15 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    glyph: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    glyph: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.2-1.5 1.5-1.5h1.4V4.9c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.5v7z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    glyph: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8zM10 15.2V8.8l5.4 3.2z" />
      </svg>
    ),
  },
  { label: "X", href: "https://x.com", glyph: <XIcon /> },
];

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/studios", label: "All studios" },
      { href: "/studios?category=Photo%20Studio", label: "Photo studios" },
      { href: "/studios?category=Film%20Stage", label: "Film stages" },
      { href: "/studios?category=Podcast%20Lounge", label: "Podcast lounges" },
      { href: "/studios?category=Music%20Suite", label: "Music suites" },
      { href: "/studios?category=Art%20Workshop", label: "Art workshops" },
    ],
  },
  {
    title: "Host",
    links: [
      { href: "/add-studio", label: "List your space" },
      { href: "/how-it-works", label: "Host guarantee" },
      { href: "/my-listings", label: "My listings" },
      { href: "/booking-requests", label: "Booking requests" },
      { href: "/dashboard", label: "Host dashboard" },
    ],
  },
  {
    title: "StudioSpace",
    links: [
      { href: "/about", label: "About" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/wishlist", label: "Saved spaces" },
      { href: "/my-bookings", label: "My bookings" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setBusy(true);
    // Demo newsletter: acknowledge locally, no third-party list is contacted.
    setTimeout(() => {
      toast.success("Subscribed — new Bangladeshi studios will land in your inbox.");
      setEmail("");
      setBusy(false);
    }, 350);
  };

  return (
    <footer className="bg-[#0d0d0b] text-[#f1eee5]">
      <div className="container-x pt-16 md:pt-24 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_2fr]">
          {/* Brand + newsletter */}
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="grid place-items-center w-10 h-10 rounded-full bg-[#e79b23] text-[#14120c]">
                <Aperture size={21} strokeWidth={2.2} />
              </span>
              <span className="font-heading font-semibold text-xl tracking-tight">
                Studio<span className="text-[#e79b23]">Space</span>
              </span>
            </Link>
            <p className="mt-6 font-heading text-2xl md:text-3xl leading-snug tracking-tight text-[#f1eee5]/90">
              Exceptional spaces for people who make things worth noticing.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#f1eee5]/55">
              Bangladesh&apos;s marketplace for photo floors, film stages, podcasts,
              music rooms and art workshops — priced in taka, booked by the hour.
            </p>

            <form onSubmit={subscribe} className="mt-7">
              <label htmlFor="footer-email" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f1eee5]/45">
                Studio openings, once a month
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] p-1 pl-4 focus-within:border-[#e79b23]/60 transition-colors">
                <Mail size={15} className="shrink-0 text-[#f1eee5]/40" />
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@studio.com.bd"
                  className="h-10 w-full bg-transparent text-sm text-[#f1eee5] placeholder:text-[#f1eee5]/35 outline-none"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="shrink-0 rounded-full bg-[#f1eee5] px-4 h-10 text-[13px] font-medium text-[#141311] hover:bg-white transition-colors disabled:opacity-60"
                >
                  {busy ? "…" : "Subscribe"}
                </button>
              </div>
            </form>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:justify-items-end">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f1eee5]/40">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link href={l.href} className="footer-link">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Giant wordmark */}
        <div className="mt-16 md:mt-20 border-t border-white/10 pt-8">
          <p className="font-heading font-semibold tracking-[-0.055em] leading-none text-[#f1eee5]/90 text-[15vw] lg:text-[11.5rem] select-none">
            Studio<span className="text-[#e79b23]">Space</span>
          </p>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-[#f1eee5]/40">
          <p>
            © {new Date().getFullYear()} StudioSpace · Dhaka, Bangladesh · bKash,
            Nagad &amp; cash on arrival
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="footer-link">
              Terms
            </Link>
            <Link href="/about" className="footer-link">
              Privacy
            </Link>
            <span className="h-3 w-px bg-white/15" />
            <div className="flex items-center gap-1">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid place-items-center w-8 h-8 rounded-full border border-white/10 hover:border-[#e79b23] hover:text-[#e79b23] transition-colors"
                >
                  {s.glyph}
                </a>
              ))}
            </div>
            <Link
              href="/studios"
              className="hidden sm:inline-flex items-center gap-1 text-[#f1eee5]/60 hover:text-[#e79b23] transition-colors"
            >
              Book a room <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
