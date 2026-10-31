"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  UserRound,
  FolderOpen,
  CalendarCheck,
  Heart,
  PlusCircle,
  ArrowRight,
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
      label: "My Listings",
      value: stats.listings,
      href: "/my-listings",
      cta: "Manage listings",
    },
    {
      key: "bookings",
      icon: CalendarCheck,
      label: "My Bookings",
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
    <div className="section-pad px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Welcome card */}
      <section className="card bg-gradient-to-br from-primary/15 via-base-100 to-base-100 border border-base-300 p-6 md:p-8 mb-8">
        <div className="flex flex-wrap items-center gap-5">
          <span className="avatar avatar-placeholder">
            <span className="w-16 rounded-full bg-primary/20 text-primary overflow-hidden text-primary">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="font-heading font-bold text-2xl">{initials}</span>
              )}
            </span>
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-2xl md:text-3xl font-bold flex items-center gap-2">
              <UserRound size={22} className="text-primary" />
              {user?.name}
            </h1>
            <p className="text-sm text-base-content/60 truncate">{user?.email}</p>
          </div>
          <Link href="/add-studio" className="btn btn-primary btn-sm md:btn-md">
            <PlusCircle size={16} /> Add a New Studio
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-5 sm:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.key}
            className="card bg-base-100 border border-base-300 p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="grid place-items-center w-11 h-11 rounded-xl bg-primary/10 text-primary">
                <c.icon size={20} />
              </span>
              <span className="font-heading font-bold text-3xl">
                {c.value === null ? <span className="loading loading-dots loading-sm" /> : c.value}
              </span>
            </div>
            <p className="font-heading font-semibold mt-4">{c.label}</p>
            <Link
              href={c.href}
              className="mt-1 text-sm text-primary link link-hover inline-flex items-center gap-1"
            >
              {c.cta} <ArrowRight size={13} />
            </Link>
          </div>
        ))}
      </section>

      {failed && (
        <p className="mt-6 text-sm text-warning">
          Heads up: the Express API returned some errors — totals above marked
          “—” could not be counted.
        </p>
      )}
    </div>
  );
}
