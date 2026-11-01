"use client";

import { useEffect, useState } from "react";
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
  ArrowUpRight,
  Ruler,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import { bdt } from "@/lib/format";
import BookingModal from "./BookingModal";
import WishlistButton from "./WishlistButton";
import SectionHeading from "./SectionHeading";
import StudioCard from "./StudioCard";

const FALLBACK_IMAGE = "/studios/gulshan-glasshouse.jpg";

const imageFor = (studio) => {
  const src = studio.image?.trim();
  if (!src) return FALLBACK_IMAGE;
  return src.startsWith("http") || src.startsWith("/") ? src : FALLBACK_IMAGE;
};

const areaOf = (studio) => {
  const parts = String(studio.location || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length >= 2 ? parts.slice(-2).join(", ") : parts[0] || "Bangladesh";
};

export default function StudioDetailsClient({ studio }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [similar, setSimilar] = useState(null);

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

  /* Related rooms from the same discipline — progressive enhancement. */
  useEffect(() => {
    let cancelled = false;
    apiRequest(`/studios?category=${encodeURIComponent(studio.category)}`)
      .then((data) => {
        if (cancelled) return;
        setSimilar(data.filter((s) => s._id !== studio._id).slice(0, 3));
      })
      .catch(() => !cancelled && setSimilar([]));
    return () => {
      cancelled = true;
    };
  }, [studio._id, studio.category]);

  const amenities = studio.amenities || [];

  return (
    <div className="pt-28 md:pt-32">
      <div className="container-x">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-faint">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="text-base-content/25">/</span>
          <Link href="/studios" className="hover:text-primary transition-colors">
            Studios
          </Link>
          <span className="text-base-content/25">/</span>
          <span className="text-base-content/55">{studio.category}</span>
        </nav>

        {/* Title block */}
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p className="eyebrow text-primary mb-4">{studio.category}</p>
            <h1 className="display text-[2rem] sm:text-4xl md:text-[3.2rem] text-balance">
              {studio.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-muted">
              <span className="flex items-center gap-1.5">
                <Star size={14} className="fill-[#e79b23] text-[#e79b23]" />
                <b className="font-semibold text-base-content">
                  {Number(studio.rating || 0).toFixed(1)}
                </b>
                <span className="text-faint">
                  ({studio.totalReviews || 0} reviews)
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#e79b23]" /> {studio.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} className="text-[#e79b23]" /> up to{" "}
                {studio.maxCapacity} people
              </span>
            </div>
          </div>

          <WishlistButton studio={studio} className="!ml-0" />
        </header>

        {/* Hero image */}
        <figure className="relative mt-8 overflow-hidden rounded-[1.75rem] bg-base-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageFor(studio)}
            alt={studio.title}
            className="aspect-[16/10] w-full object-cover md:aspect-[16/8.2]"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 p-5 md:p-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/35 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
              <Sparkles size={12} className="text-[#e79b23]" /> Verified host ·
              Identity checked
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3.5 py-1.5 text-[11px] text-white/85 backdrop-blur-md">
              <MapPin size={12} className="text-[#e79b23]" /> {areaOf(studio)}
            </span>
          </div>
        </figure>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.55fr_1fr] lg:gap-14">
          {/* Left: story */}
          <div className="space-y-12">
            {/* Quick facts */}
            <section className="grid gap-px overflow-hidden rounded-2xl border border-base-content/10 bg-base-content/10 sm:grid-cols-3">
              {[
                { icon: Ruler, k: "Rate", v: `${bdt(studio.hourlyRate)} / hr` },
                { icon: Users, k: "Capacity", v: `${studio.maxCapacity} people` },
                {
                  icon: ShieldCheck,
                  k: "Deposit",
                  v:
                    Number(studio.securityDeposit) > 0
                      ? bdt(studio.securityDeposit)
                      : "None",
                },
              ].map((f) => (
                <div key={f.k} className="bg-base-100 px-5 py-5">
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">
                    <f.icon size={12} className="text-[#e79b23]" /> {f.k}
                  </span>
                  <p className="mt-2 font-heading text-[15px] font-medium">
                    {f.v}
                  </p>
                </div>
              ))}
            </section>

            <section>
              <h2 className="display text-xl md:text-2xl">
                About this <span className="serif italic">space.</span>
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted md:text-[15px]">
                {studio.overview}
              </p>
            </section>

            <section>
              <h2 className="display text-xl md:text-2xl">
                What&apos;s <span className="serif italic">in the room.</span>
              </h2>
              {amenities.length ? (
                <ul className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-base-content/10 bg-base-content/10 sm:grid-cols-2">
                  {amenities.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-2.5 bg-base-100 px-4 py-3.5 text-[13px]"
                    >
                      <BadgeCheck
                        size={15}
                        className="shrink-0 text-[#e79b23]"
                      />
                      {a}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  Amenities have not been listed for this space yet — ask the
                  host before you book.
                </p>
              )}
            </section>

            {/* Host */}
            <section className="panel p-6 md:p-7">
              <p className="eyebrow text-primary mb-5">Your host</p>
              <div className="flex flex-wrap items-center gap-4">
                <span className="avatar avatar-placeholder">
                  <span className="w-14 rounded-full overflow-hidden bg-primary/15 text-primary">
                    {studio.ownerPhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={studio.ownerPhoto}
                        alt={studio.ownerName}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="font-heading text-xl font-semibold">
                        {(studio.ownerName || "S").charAt(0).toUpperCase()}
                      </span>
                    )}
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 font-heading text-[15px] font-medium">
                    <UserRoundCheck size={15} className="text-[#e79b23]" />
                    {studio.ownerName || "Studio owner"}
                  </p>
                  <p className="truncate text-sm text-muted">
                    {studio.ownerEmail}
                  </p>
                  <p className="mt-1 text-xs text-faint">
                    Typically responds within a day · Identity verified
                  </p>
                </div>
              </div>
            </section>

            {/* Payment note */}
            <section className="rounded-2xl border border-base-content/10 bg-base-200/50 p-6">
              <h2 className="font-heading text-[15px] font-medium">
                Settling the fee
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                StudioSpace does not charge your card. You settle the studio fee
                directly with the host on the day — by bKash, Nagad or cash. The
                security deposit, when listed, is refundable after the session.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                <span className="rounded-full border border-[#E2136E]/25 bg-[#E2136E]/10 px-3 py-1 text-[#E2136E]">
                  bKash
                </span>
                <span className="rounded-full border border-[#F7941D]/30 bg-[#F7941D]/10 px-3 py-1 text-[#C86B05]">
                  Nagad
                </span>
                <span className="rounded-full border border-base-content/15 px-3 py-1 font-medium text-muted">
                  Cash on arrival
                </span>
              </div>
            </section>
          </div>

          {/* Right: sticky booking panel */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="panel overflow-hidden">
              <div className="border-b border-base-content/10 p-6">
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-4xl font-semibold tracking-[-0.04em]">
                    {bdt(studio.hourlyRate)}
                  </span>
                  <span className="text-sm text-muted">/ hour</span>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-[13px] text-muted">
                  <ShieldCheck size={14} className="text-[#e79b23]" />
                  {Number(studio.securityDeposit) > 0
                    ? `${bdt(studio.securityDeposit)} refundable deposit`
                    : "No security deposit"}
                </p>
              </div>

              <dl className="divide-y divide-base-content/10 px-6 text-[13px]">
                <div className="flex items-center justify-between gap-3 py-3.5">
                  <dt className="text-muted">Discipline</dt>
                  <dd className="font-medium">{studio.category}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 py-3.5">
                  <dt className="text-muted">Capacity</dt>
                  <dd className="font-medium">{studio.maxCapacity} people</dd>
                </div>
                <div className="flex items-start justify-between gap-3 py-3.5">
                  <dt className="shrink-0 text-muted">Where</dt>
                  <dd className="text-right font-medium">{studio.location}</dd>
                </div>
              </dl>

              <div className="p-6 pt-2">
                {isOwner ? (
                  <div className="rounded-xl border border-[#e79b23]/35 bg-[#e79b23]/10 p-4 text-[13px]">
                    <p className="mb-1 flex items-center gap-2 font-semibold">
                      <UserRoundCheck size={15} /> You host this studio
                    </p>
                    <p className="leading-relaxed text-muted">
                      Booking is disabled on your own listing. Manage it from{" "}
                      <Link
                        href="/my-listings"
                        className="font-medium text-primary hover:underline"
                      >
                        My listings
                      </Link>
                      .
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={goBook}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral text-[14px] font-medium text-neutral-content transition-opacity hover:opacity-90"
                  >
                    <CalendarPlus size={17} /> Book Workspace Now
                  </button>
                )}

                <p className="mt-4 flex items-start gap-2 text-[11.5px] leading-relaxed text-faint">
                  <Clock size={13} className="mt-0.5 shrink-0 text-[#e79b23]" />
                  Choose an exact date and window in the booking modal —
                  overlapping requests are rejected automatically, so your slot
                  stays exclusively yours.
                </p>
              </div>
            </div>

            <Link
              href="/how-it-works"
              className="mt-4 flex items-center justify-between rounded-2xl border border-base-content/10 px-5 py-4 text-[13px] transition-colors hover:border-base-content/25"
            >
              How booking works
              <ArrowUpRight size={15} className="text-[#e79b23]" />
            </Link>
          </aside>
        </div>

        {/* Similar rooms */}
        {similar && similar.length > 0 && (
          <section className="section border-t border-base-content/10 mt-16">
            <SectionHeading
              eyebrow="Same discipline"
              title={
                <>
                  More <span className="serif italic">{studio.category}</span>{" "}
                  rooms
                </>
              }
              action={
                <Link
                  href={`/studios?category=${encodeURIComponent(studio.category)}`}
                  className="group inline-flex items-center gap-2 border-b border-base-content/25 pb-1 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                >
                  View all
                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              }
            />
            <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 md:gap-x-6">
              {similar.map((s) => (
                <StudioCard key={s._id} studio={s} />
              ))}
            </div>
          </section>
        )}
      </div>

      <BookingModal
        studio={studio}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}
