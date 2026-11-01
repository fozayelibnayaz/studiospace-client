"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Inbox, CircleCheck, PackageCheck } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import { BOOKING_STATUS_STYLES } from "@/lib/constants";
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
    <div className="section-pad px-4 sm:px-6 max-w-5xl mx-auto">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2 flex items-center gap-2">
          <Inbox size={15} /> Host inbox
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold">Booking Requests</h1>
        <p className="mt-2 text-sm md:text-base text-base-content/60 leading-relaxed">
          Every reservation made against a studio you own, newest first. It is
          <b> you</b> who carries each booking forward: accept it while it is
          Pending, then mark it Completed once the session happens.
        </p>
      </header>

      <div className="alert alert-info mb-6">
        <span className="text-sm leading-relaxed">
          <b>Lifecycle:</b> Pending (customer booked) → <b>Confirmed</b> (you
          accept, fees settled) → <b>Completed</b> (session delivered).
          Customers can cancel their Pending bookings from their side.
        </span>
      </div>

      {bookings === null ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }, (_, i) => (
            <div key={i} className="card bg-base-100 border border-base-300 p-4 flex gap-4">
              <div className="skeleton w-40 h-28 rounded-xl" />
              <div className="flex-1 space-y-3 py-1">
                <div className="skeleton h-5 w-2/3" />
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-9 w-44" />
              </div>
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No booking requests yet"
          message="Once creators reserve hours in your studios, they appear here for you to confirm and track."
          ctaLabel="View My Listings"
          ctaHref="/my-listings"
        />
      ) : (
        <ul className="space-y-4">
          {bookings.map((b) => (
            <li
              key={b._id}
              className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row gap-4 p-4">
                <Link href={`/studios/${b.studioId}`} className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.studioImage}
                    alt={b.studioTitle}
                    className="w-full h-40 sm:h-28 sm:w-44 object-cover rounded-xl border border-base-300"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-heading font-bold text-lg truncate">
                      {b.studioTitle}
                    </h3>
                    <span
                      className={`badge badge-sm font-semibold ${
                        BOOKING_STATUS_STYLES[b.status] || "badge-ghost"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-base-content/65">
                    {b.customerName} · {b.customerEmail}
                  </p>
                  <p className="text-xs text-base-content/55">
                    {b.date} · {b.startTime}–{b.endTime} ({b.totalHours} h) ·{" "}
                    <b className="text-base-content/75">${Number(b.totalCost).toFixed(2)}</b>
                  </p>
                </div>
                <div className="flex sm:flex-col gap-2 justify-end items-stretch">
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
                      className="btn btn-primary btn-sm"
                    >
                      <CircleCheck size={14} /> Confirm Booking
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
                      className="btn btn-outline btn-sm"
                    >
                      <PackageCheck size={14} /> Mark Completed
                    </button>
                  )}
                  <Link href={`/studios/${b.studioId}`} className="btn btn-ghost btn-sm">
                    View studio
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

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
