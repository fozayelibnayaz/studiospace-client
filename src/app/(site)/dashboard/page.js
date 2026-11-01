"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderOpen,
  CalendarCheck,
  Heart,
  PlusCircle,
  ArrowUpRight,
} from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import RequireSession from "@/components/RequireSession";

export default function DashboardPage() {
  return (
    <RequireSession>
      <Inner />
    </RequireSession>
  );
}

function Inner() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [stats, setStats] = useState({ listings: null, bookings: null, wishlist: null });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!user) return;
    const email = encodeURIComponent(user.email);
    Promise.allSettled([
      apiRequest(`/my-studios?email=${email}`),
      apiRequest(`/bookings?email=${email}`),
      apiRequest(`/wishlist?email=${email}`),
    ]).then(([l, b, w]) => {
      setStats({
        listings: l.status === "fulfilled" ? l.value.length : "—",
        bookings: b.status === "fulfilled" ? b.value.length : "—",
        wishlist: w.status === "fulfilled" ? w.value.length : "—",
      });
      if (l.status !== "fulfilled" && b.status !== "fulfilled") {
        setFailed(true);
        toast.error("Could not reach the studio server to load your stats");
      }
    });
  }, [user]);

  const initials = (user?.name || "?").charAt(0).toUpperCase();

  const cards = [
    {
      key: "listings",
      icon: FolderOpen,
      label: "My listings",
      value: stats.listings,
      href: "/my-listings",
      cta: "Manage listings",
    },
    {
      key: "bookings",
      icon: CalendarCheck,
      label: "My bookings",
      value: stats.bookings,
      href: "/my-bookings",
      cta: "View bookings",
    },
    {
      key: "wishlist",
      icon: Heart,
      label: "Wishlist",
      value: stats.wishlist,
      href: "/wishlist",
      cta: "Open wishlist",
    },
  ];

  return (
    <div className="pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="container-x">
        {/* Welcome panel */}
        <section className="relative overflow-hidden rounded-[1.75rem] bg-[#0d0d0b] px-6 py-10 text-[#f1eee5] sm:px-10 md:py-14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/studios/banani-blackbox.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0b] via-[#0d0d0b]/85 to-[#0d0d0b]/30" />

          <div className="relative flex flex-wrap items-center gap-5">
            <span className="avatar avatar-placeholder">
              <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-full border border-white/20 bg-[#e79b23]/20 text-[#e79b23]">
                {user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="font-heading text-2xl font-semibold">
                    {initials}
                  </span>
                )}
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="eyebrow mb-2 text-[#e79b23]">Your dashboard</p>
              <h1 className="display text-3xl md:text-4xl">{user?.name}</h1>
              <p className="mt-1 truncate text-[13px] text-[#f1eee5]/55">
                {user?.email}
              </p>
            </div>
            <Link
              href="/add-studio"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#f1eee5] px-5 text-[13px] font-medium text-[#141311] transition-colors hover:bg-white"
            >
              <PlusCircle size={15} /> Add a studio
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-base-content/10 bg-base-content/10 sm:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.key}
              href={c.href}
              className="group bg-base-100 p-6 transition-colors hover:bg-base-200/50"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-base-content/10 text-[#e79b23]">
                  <c.icon size={17} strokeWidth={1.8} />
                </span>
                <span className="font-heading text-4xl font-semibold tracking-[-0.04em]">
                  {c.value === null ? (
                    <span className="inline-block h-8 w-10 animate-pulse rounded bg-base-300" />
                  ) : (
                    c.value
                  )}
                </span>
              </div>
              <p className="mt-5 font-heading text-[15px] font-medium">
                {c.label}
              </p>
              <span className="mt-1 inline-flex items-center gap-1 text-[12px] text-muted transition-colors group-hover:text-primary">
                {c.cta} <ArrowUpRight size={12} />
              </span>
            </Link>
          ))}
        </section>

        {failed && (
          <p className="mt-6 rounded-xl border border-[#e79b23]/30 bg-[#e79b23]/10 px-4 py-3 text-[13px] text-muted">
            Heads up: the Express API returned some errors — totals marked “—”
            could not be counted.
          </p>
        )}
      </div>
    </div>
  );
}
