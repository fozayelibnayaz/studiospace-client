"use client";

import Link from "next/link";
import { Aperture } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

import { CATEGORIES, CATEGORY_META } from "@/lib/constants";

/** X (the rebrand) — NOT the old Twitter bird. */
function XIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com", icon: "f" },
  { label: "Instagram", href: "https://instagram.com", icon: "ig" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "in" },
  { label: "YouTube", href: "https://youtube.com", icon: "yt" },
  { label: "X (formerly Twitter)", href: "https://x.com", icon: "x" },
];

function SocialGlyph({ icon }) {
  if (icon === "x") return <XIcon />;
  if (icon === "f")
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.2-1.5 1.5-1.5h1.4V4.9c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.5v7z" />
      </svg>
    );
  if (icon === "ig")
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  if (icon === "in")
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05A4.2 4.2 0 0 1 16.6 9c4 0 4.7 2.6 4.7 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V21H9z" />
      </svg>
    );
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8zM10 15.2V8.8l5.4 3.2z" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");

  const subscribe = (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Subscribed! Studio openings will land in your inbox.");
    setEmail("");
  };

  return (
    <footer className="bg-base-200 border-t border-base-300/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5 w-max">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary text-primary-content">
              <Aperture size={20} strokeWidth={2.2} />
            </span>
            <span className="font-heading font-bold text-lg">
              Studio<span className="text-primary">Space</span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-base-content/70 leading-relaxed max-w-xs">
            Our mission is simple: every city already has the creative spaces
            it needs — they are just invisible. StudioSpace connects working
            photographers, filmmakers, podcasters, musicians and artists with
            verified owners who rent their spaces out by the hour.
          </p>
        </div>

        {/* Quick links */}
        <nav>
          <h3 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-sm text-base-content/70">
            {[
              { href: "/studios", label: "Explore Studios" },
              { href: "/add-studio", label: "Host Your Studio" },
              { href: "/my-bookings", label: "My Bookings" },
              { href: "/how-it-works", label: "How It Works" },
              { href: "/about", label: "About Us" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-primary transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Categories */}
        <nav>
          <h3 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4">
            Popular Categories
          </h3>
          <ul className="space-y-2.5 text-sm text-base-content/70">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link
                  href={`/studios?category=${encodeURIComponent(c)}`}
                  className="hover:text-primary transition-colors"
                >
                  {c}
                  <span className="block text-xs text-base-content/45">
                    {CATEGORY_META[c]?.blurb}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Newsletter + socials */}
        <div>
          <h3 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4">
            Newsletter
          </h3>
          <p className="text-sm text-base-content/70 mb-3">
            New studios on the platform, once a week. No spam.
          </p>
          <form onSubmit={subscribe} className="join w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input input-bordered join-item input-sm w-full bg-base-100"
              aria-label="Email for newsletter"
            />
            <button type="submit" className="btn btn-primary join-item btn-sm">
              Subscribe
            </button>
          </form>
          <div className="flex items-center gap-2.5 mt-5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
                className="btn btn-ghost btn-sm btn-circle border border-base-300 hover:bg-primary hover:text-primary-content hover:border-primary transition-colors"
              >
                <SocialGlyph icon={s.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-base-300/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-base-content/55">
          <p>© {new Date().getFullYear()} StudioSpace. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <Link href="/about" className="hover:text-primary">Terms</Link>
            <span aria-hidden="true">·</span>
            <Link href="/about" className="hover:text-primary">Privacy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
