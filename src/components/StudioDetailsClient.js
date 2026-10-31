"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Star,
  Users,
  ShieldCheck,
  Clock,
  CalendarPlus,
  UserRoundCheck,
  BadgeCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import BookingModal from "./BookingModal";
import WishlistButton from "./WishlistButton";

export default function StudioDetailsClient({ studio }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [bookingOpen, setBookingOpen] = useState(false);

  const isOwner =
    session?.user &&
    session.user?.email?.toLowerCase() === String(studio.ownerEmail).toLowerCase();

  const goBook = () => {
    if (!session?.user) {
      const target = `/studios/${studio._id}`;
      toast("Login to book this workspace", { icon: "🔒" });
      router.push(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }
    if (isOwner) {
      toast.error("You cannot book your own studio listing.");
      return;
    }
    setBookingOpen(true);
  };

  return (
    <div className="section-pad px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-xs text-base-content/50 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/studios" className="hover:text-primary">Studios</Link>
        <span>/</span>
        <span className="text-base-content/75">{studio.category}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left: media + content */}
        <div className="lg:col-span-2 space-y-8">
          <figure className="relative rounded-2xl overflow-hidden border border-base-300 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={studio.image?.startsWith("http") ? studio.image : "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1400&q=80"}
              alt={studio.title}
              className="w-full aspect-[16/10] object-cover"
            />
            <span className="absolute top-4 left-4 badge badge-primary font-semibold uppercase tracking-wide text-xs">
              {studio.category}
            </span>
          </figure>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl md:text-4xl font-bold leading-tight">
                {studio.title}
              </h1>
              <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-base-content/65">
                <span className="flex items-center gap-1.5">
                  <Star size={16} className="fill-warning text-warning" />
                  <b className="text-base-content">{Number(studio.rating).toFixed(1)}</b>
                  <span>({studio.totalReviews || 0} reviews)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-primary" /> {studio.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={16} className="text-primary" /> up to {studio.maxCapacity} people
                </span>
              </p>
            </div>
            <WishlistButton studio={studio} className="!ml-0" />
          </div>

          {/* Amenities */}
          <section>
            <h2 className="font-heading text-lg font-bold mb-4">Amenities</h2>
            <ul className="flex flex-wrap gap-2">
              {(studio.amenities || []).map((a) => (
                <li
                  key={a}
                  className="badge badge-lg bg-base-200/60 border-base-300 gap-1.5 font-normal"
                >
                  <BadgeCheck size={13} className="text-primary" /> {a}
                </li>
              ))}
              {!studio.amenities?.length && (
                <li className="text-sm text-base-content/50">
                  Amenities not listed for this space yet.
                </li>
              )}
            </ul>
          </section>

          {/* Overview */}
          <section>
            <h2 className="font-heading text-lg font-bold mb-3">About this space</h2>
            <p className="text-sm md:text-[15px] leading-relaxed text-base-content/75 whitespace-pre-line">
              {studio.overview}
            </p>
          </section>

          {/* Host card */}
          <section className="card bg-base-100 border border-base-300 p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">
              Your host
            </p>
            <div className="flex items-center gap-4">
              <span className="avatar avatar-placeholder">
                <span className="w-14 rounded-full bg-primary/15 text-primary overflow-hidden">
                  {studio.ownerPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={studio.ownerPhoto}
                      alt={studio.ownerName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="font-heading font-bold text-xl">
                      {(studio.ownerName || "S").charAt(0).toUpperCase()}
                    </span>
                  )}
                </span>
              </span>
              <div className="min-w-0">
                <p className="font-heading font-semibold flex items-center gap-1.5">
                  <UserRoundCheck size={16} className="text-success" />
                  {studio.ownerName || "Studio owner"}
                </p>
                <p className="text-sm text-base-content/60 truncate">
                  {studio.ownerEmail}
                </p>
                <p className="text-xs text-base-content/45 mt-0.5">
                  Typically responds within a day · Identity verified
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right: sticky booking panel */}
        <aside className="lg:sticky lg:top-24 card bg-base-100 border border-base-300 shadow-md p-6">
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-bold text-4xl">${studio.hourlyRate}</span>
            <span className="text-base-content/55 text-sm">/ hour</span>
          </div>

          {Number(studio.securityDeposit) > 0 && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-base-content/60">
              <ShieldCheck size={15} className="text-success" />
              ${studio.securityDeposit} security deposit (refundable)
            </p>
          )}

          <ul className="mt-5 space-y-2.5 text-sm border-t border-base-300 pt-5">
            <li className="flex justify-between">
              <span className="text-base-content/55">Category</span>
              <b>{studio.category}</b>
            </li>
            <li className="flex justify-between">
              <span className="text-base-content/55">Capacity</span>
              <b>{studio.maxCapacity} people</b>
            </li>
            <li className="flex justify-between items-center gap-2">
              <span className="text-base-content/55 shrink-0">Location</span>
              <b className="text-right truncate">{studio.location}</b>
            </li>
          </ul>

          {isOwner ? (
            <div className="mt-6 rounded-xl bg-warning/10 border border-warning/30 p-4 text-sm text-warning-content">
              <p className="font-semibold mb-1 flex items-center gap-2">
                <UserRoundCheck size={16} /> You host this studio
              </p>
              <p className="text-base-content/70 text-xs leading-relaxed">
                This listing is yours, so booking is disabled. View your space on{" "}
                <Link href="/my-listings" className="link link-primary">
                  My Studio Listings
                </Link>{" "}
                instead.
              </p>
            </div>
          ) : (
            <button onClick={goBook} className="btn btn-primary w-full mt-6">
              <CalendarPlus size={17} /> Book Workspace Now
            </button>
          )}

          <p className="mt-4 flex items-start gap-2 text-xs text-base-content/50 leading-relaxed">
            <Clock size={14} className="shrink-0 mt-0.5 text-primary" />
            Pick an exact date and window in the booking modal; overlapping
            requests are rejected automatically so your slot stays exclusively
            yours.
          </p>
        </aside>
      </div>

      <BookingModal studio={studio} open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
