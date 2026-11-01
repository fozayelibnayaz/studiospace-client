"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Inbox, CircleCheck, PackageCheck, ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import { bdt } from "@/lib/format";
import RequireSession from "@/components/RequireSession";
import EmptyState from "@/components/EmptyState";
import ConfirmModal from "@/components/ConfirmModal";

export default function BookingRequestsPage() {
  return (
    <RequireSession>
      <Inner />
    </RequireSession>
  );
}

const badgeClass = (status) => {
  const map = {
    Pending: "border-[#e79b23]/35 bg-[#e79b23]/12 text-[#a86a12]",
    Confirmed: "border-success/35 bg-success/12 text-success",
    Completed: "border-info/35 bg-info/12 text-info",
    Cancelled: "border-error/35 bg-error/12 text-error",
  };
  return map[status] || "border-base-content/15 text-muted";
};

function Inner() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [bookings, setBookings] = useState(null);
  const [pendingAction, setPendingAction] = useState(null); // { booking, next, label }
  const [busy, setBusy] = useState(false);

  const email = session?.user?.email;

  const load = useCallback(async () => {
    if (!email) return;
    try {
      const data = await apiRequest(
        `/bookings/owner?email=${encodeURIComponent(email)}`
      );
      setBookings(data);
    } catch (err) {
      if (err.status === 401) {
        toast.error("Session expired — please log in again.");
        router.push("/login?redirect=/booking-requests");
      } else {
        setBookings([]);
        toast.error(err.message || "Failed to load booking requests");
      }
    }
  }, [email, router]);

  useEffect(() => {
    load();
  }, [load]);

  const applyStatus = async () => {
    if (!pendingAction) return;
    setBusy(true);
    try {
      const res = await apiRequest(`/bookings/${pendingAction.booking._id}/status`, {
        method: "PATCH",
        body: { status: pendingAction.next },
      });
      setBookings((b) =>
        b.map((x) =>
          x._id === pendingAction.booking._id ? { ...x, status: pendingAction.next } : x
        )
      );
      toast.success(res.message || `Booking ${pendingAction.next.toLowerCase()}`);
      setPendingAction(null);
    } catch (err) {
      if (err.status === 401) {
        toast.error("Session expired — please log in again.");
        router.push("/login?redirect=/booking-requests");
      } else {
        toast.error(err.message || "Status update failed");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="container-x">
        <header className="border-b border-base-content/10 pb-8">
          <p className="eyebrow mb-4 text-primary">Host inbox</p>
          <h1 className="display text-[2rem] sm:text-4xl md:text-[3rem]">
            Booking <span className="serif italic">requests.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Every reservation made against a studio you own, newest first. Accept
            it while it&apos;s pending, then mark it completed once the session
            happens.
          </p>
        </header>

        <div className="mt-6 rounded-2xl border border-base-content/10 bg-base-200/50 px-5 py-4 text-[12.5px] leading-relaxed text-muted">
          <b className="text-base-content">Lifecycle:</b> Pending (customer booked)
          → <b className="text-base-content">Confirmed</b> (you accept, fees
          settled) → <b className="text-base-content">Completed</b> (session
          delivered). Customers can cancel their pending bookings from their side.
        </div>

        {bookings === null ? (
          <ul className="mt-8 divide-y divide-base-content/10 border-y border-base-content/10">
            {Array.from({ length: 2 }, (_, i) => (
              <li key={i} className="flex gap-4 py-5">
                <div className="skeleton h-24 w-36 rounded-xl" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="skeleton h-5 w-2/3 rounded-md" />
                  <div className="skeleton h-4 w-1/2 rounded-md" />
                  <div className="skeleton h-9 w-44 rounded-full" />
                </div>
              </li>
            ))}
          </ul>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No booking requests yet"
            message="Once creators reserve hours in your studios, they appear here for you to confirm and track."
            ctaLabel="View my listings"
            ctaHref="/my-listings"
          />
        ) : (
          <ul className="mt-8 divide-y divide-base-content/10 border-y border-base-content/10">
            {bookings.map((b) => (
              <li key={b._id} className="py-5">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    href={`/studios/${b.studioId}`}
                    className="shrink-0 overflow-hidden rounded-xl bg-base-200"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.studioImage}
                      alt={b.studioTitle}
                      className="h-40 w-full object-cover sm:h-24 sm:w-36"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-heading text-[15px] font-medium">
                        {b.studioTitle}
                      </h3>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${badgeClass(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[13px] text-muted">
                      {b.customerName} · {b.customerEmail}
                    </p>
                    <p className="text-[12px] text-faint">
                      {b.date} · {b.startTime}–{b.endTime} ({b.totalHours} h) ·{" "}
                      <b className="font-semibold text-base-content/80">
                        {bdt(b.totalCost, { decimals: true })}
                      </b>
                    </p>
                  </div>
                  <div className="flex items-stretch justify-end gap-2 sm:flex-col">
                    {b.status === "Pending" && (
                      <button
                        type="button"
                        onClick={() =>
                          setPendingAction({
                            booking: b,
                            next: "Confirmed",
                            title: "Confirm this booking?",
                            message: `"${b.customerName}" will be holding ${b.studioTitle} on ${b.date} (${b.startTime}–${b.endTime}). Settle the fee off-platform, then confirm.`,
                          })
                        }
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-neutral px-3.5 text-[12px] font-medium text-neutral-content transition-opacity hover:opacity-90"
                      >
                        <CircleCheck size={13} /> Confirm
                      </button>
                    )}
                    {b.status === "Confirmed" && (
                      <button
                        type="button"
                        onClick={() =>
                          setPendingAction({
                            booking: b,
                            next: "Completed",
                            title: "Mark session as completed?",
                            message: `The ${b.date} session (${b.startTime}–${b.endTime}) in ${b.studioTitle} ran as planned.`,
                          })
                        }
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-base-content/15 px-3.5 text-[12px] font-medium transition-colors hover:bg-base-content/5"
                      >
                        <PackageCheck size={13} /> Mark completed
                      </button>
                    )}
                    <Link
                      href={`/studios/${b.studioId}`}
                      className="inline-flex h-9 items-center justify-center gap-1 rounded-full px-3.5 text-[12px] font-medium text-muted transition-colors hover:text-primary"
                    >
                      View studio <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmModal
        open={Boolean(pendingAction)}
        onClose={() => setPendingAction(null)}
        onConfirm={applyStatus}
        busy={busy}
        title={pendingAction?.title || "Confirm"}
        message={pendingAction?.message || ""}
        confirmLabel={pendingAction ? pendingAction.next : "Confirm"}
        destructive={false}
      />
    </div>
  );
}
