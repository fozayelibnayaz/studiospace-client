"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarCheck, FileDown, XCircle } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import { BOOKING_STATUS_STYLES } from "@/lib/constants";
import { bdt, bdtPdf } from "@/lib/format";
import RequireSession from "@/components/RequireSession";
import EmptyState from "@/components/EmptyState";
import ConfirmModal from "@/components/ConfirmModal";
import StudioCardSkeleton from "@/components/StudioCardSkeleton";

export default function MyBookingsPage() {
  return (
    <RequireSession>
      <Inner />
    </RequireSession>
  );
}

function Inner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = authClient.useSession();
  const [bookings, setBookings] = useState(null);
  const [toCancel, setToCancel] = useState(null);
  const [busy, setBusy] = useState(false);
  const [justBooked] = useState(() => searchParams.get("justBooked"));

  const email = session?.user?.email;

  const load = useCallback(async () => {
    if (!email) return;
    try {
      const data = await apiRequest(`/bookings?email=${encodeURIComponent(email)}`);
      setBookings(data);
    } catch (err) {
      if (err.status === 401) {
        toast.error("Session expired — please log in again.");
        router.push("/login?redirect=/my-bookings");
      } else {
        setBookings([]);
        toast.error(err.message || "Failed to load bookings");
      }
    }
  }, [email, router]);

  useEffect(() => {
    load();
  }, [load]);

  const confirmCancel = async () => {
    if (!toCancel) return;
    setBusy(true);
    try {
      await apiRequest(`/bookings/${toCancel._id}/cancel`, { method: "PATCH" });
      setBookings((b) =>
        b.map((x) => (x._id === toCancel._id ? { ...x, status: "Cancelled" } : x))
      );
      toast.success("Booking cancelled — the slot is free again");
      setToCancel(null);
    } catch (err) {
      if (err.status === 409 || err.status === 401) {
        toast.error(err.message || "Only pending bookings can be cancelled");
      } else {
        toast.error(err.message || "Cancel failed");
      }
    } finally {
      setBusy(false);
    }
  };

  /** Optional: PDF invoice for confirmed bookings via jsPDF. */
  const downloadInvoice = async (b) => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a5" });
      const W = doc.internal.pageSize.getWidth();

      doc.setFillColor(24, 24, 27);
      doc.rect(0, 0, W, 64, "F");
      doc.setTextColor(245, 158, 11);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("StudioSpace", 40, 40);
      doc.setTextColor(230, 230, 230);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Booking Invoice", W - 40, 40, { align: "right" });

      doc.setTextColor(24, 24, 27);
      doc.setFontSize(10);
      let y = 96;
      doc.text(`Invoice #SS-${b._id.slice(-8).toUpperCase()}`, 40, y);
      doc.text(`Issued: ${new Date(b.createdAt).toLocaleDateString()}`, W - 40, y, {
        align: "right",
      });
      y += 28;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(b.studioTitle, 40, y);
      y += 20;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(b.studioLocation, 40, y, { maxWidth: W - 80 });

      y += 24;
      doc.setDrawColor(220);
      doc.line(40, y, W - 40, y);
      y += 18;
      doc.text("Billed to:", 40, y);
      doc.setFont("helvetica", "bold");
      doc.text(`${b.customerName} <${b.customerEmail}>`, 130, y);
      doc.setFont("helvetica", "normal");

      const rows = [
        ["Date", b.date],
        ["Time slot", `${b.startTime} – ${b.endTime} (${b.totalHours} h)`],
        ["Hourly rate", `${bdtPdf(b.totalCost / b.totalHours)} × ${b.totalHours} h`],
        ["Security deposit", Number(b.securityDeposit) > 0 ? `${bdtPdf(b.securityDeposit)} (refundable, billed on-site)` : "—"],
        ["Status", b.status],
      ];
      y += 26;
      rows.forEach(([k, v]) => {
        doc.setTextColor(105);
        doc.text(k, 40, y);
        doc.setTextColor(24);
        doc.text(String(v ?? "—"), 150, y);
        y += 19;
      });

      y += 8;
      doc.setFillColor(250, 245, 230);
      doc.roundedRect(40, y, W - 80, 42, 6, 6, "F");
      doc.setTextColor(146, 64, 14);
      doc.setFont("helvetica", "bold");
      doc.text("Total", 56, y + 26);
      doc.setFontSize(16);
      doc.text(bdtPdf(b.totalCost), W - 56, y + 26, { align: "right" });

      y += 70;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(
        "StudioSpace is a booking marketplace — studio fees are settled directly with the host.",
        40,
        y,
        { maxWidth: W - 80 }
      );

      doc.save(`studiospace-invoice-${b._id.slice(-8)}.pdf`);
      toast.success("Invoice downloaded");
    } catch (err) {
      toast.error("Could not generate the invoice PDF");
    }
  };

  return (
    <div className="section-pad px-4 sm:px-6 max-w-5xl mx-auto">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2 flex items-center gap-2">
          <CalendarCheck size={15} /> Your sessions
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold">My Bookings</h1>
        <p className="mt-2 text-sm text-base-content/60">
          Every studio hour you have reserved — cancel any pending booking with
          one click.
        </p>
      </header>

      {justBooked && (
        <div className="alert alert-success mb-6">
          <span>
            Your booking is confirmed as <b>Pending</b>. The host sees it
            immediately — check the details below.
          </span>
        </div>
      )}

      {bookings === null ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }, (_, i) => (
            <div key={i} className="card bg-base-100 border border-base-300 p-4 flex gap-4">
              <div className="skeleton w-40 h-28 rounded-xl" />
              <div className="flex-1 space-y-3 py-1">
                <div className="skeleton h-5 w-2/3" />
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No sessions booked yet"
          message="When you reserve studio time it shows up here with its live status — pending, confirmed, completed or cancelled."
          ctaLabel="Explore Studios"
          ctaHref="/studios"
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
                    {b.date} · {b.startTime} – {b.endTime} ({b.totalHours} h)
                  </p>
                  <p className="text-xs text-base-content/50 truncate">
                    {b.studioLocation}
                  </p>
                  <p className="mt-1.5 font-heading font-semibold text-lg">
                    {bdt(b.totalCost, { decimals: true })}
                    {Number(b.securityDeposit) > 0 && (
                      <span className="text-xs font-normal text-base-content/50">
                        {" "}
                        + {bdt(b.securityDeposit)} deposit
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex sm:flex-col gap-2 justify-end items-stretch">
                  {b.status === "Pending" && (
                    <button
                      type="button"
                      onClick={() => setToCancel(b)}
                      className="btn btn-error btn-outline btn-sm"
                    >
                      <XCircle size={14} /> Cancel Booking
                    </button>
                  )}
                  {b.status === "Confirmed" && (
                    <button
                      type="button"
                      onClick={() => downloadInvoice(b)}
                      className="btn btn-outline btn-sm"
                    >
                      <FileDown size={14} /> Download Invoice (PDF)
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
        open={Boolean(toCancel)}
        onClose={() => setToCancel(null)}
        onConfirm={confirmCancel}
        busy={busy}
        title="Cancel this booking?"
        message={
          toCancel
            ? `\u201C${toCancel.studioTitle}\u201D on ${toCancel.date} (${toCancel.startTime}–${toCancel.endTime}) will be released back to other creators.`
            : ""
        }
        confirmLabel="Yes, Cancel It"
        destructive={false}
      />
    </div>
  );
}
