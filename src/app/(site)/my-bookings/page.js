"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarCheck, FileDown, XCircle, ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import { bdt, bdtPdf } from "@/lib/format";
import RequireSession from "@/components/RequireSession";
import EmptyState from "@/components/EmptyState";
import ConfirmModal from "@/components/ConfirmModal";

export default function MyBookingsPage() {
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
    <div className="pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="container-x">
        <header className="border-b border-base-content/10 pb-8">
          <p className="eyebrow mb-4 text-primary">Your sessions</p>
          <h1 className="display text-[2rem] sm:text-4xl md:text-[3rem]">
            My <span className="serif italic">bookings.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Every studio hour you have reserved — cancel any pending booking with
            one click, or download a PDF invoice once the host confirms.
          </p>
        </header>

        {justBooked && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-success/30 bg-success/10 px-5 py-4 text-[13px] leading-relaxed">
            <CalendarCheck size={17} className="mt-0.5 shrink-0 text-success" />
            <p>
              Your booking is confirmed as <b>Pending</b>. The host sees it
              immediately — check the details below.
            </p>
          </div>
        )}

        {bookings === null ? (
          <ul className="mt-8 space-y-4">
            {Array.from({ length: 2 }, (_, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-2xl border border-base-content/10 p-4"
              >
                <div className="skeleton h-28 w-44 rounded-xl" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="skeleton h-5 w-2/3 rounded-md" />
                  <div className="skeleton h-4 w-1/2 rounded-md" />
                  <div className="skeleton h-4 w-1/3 rounded-md" />
                </div>
              </li>
            ))}
          </ul>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No sessions booked yet"
            message="When you reserve studio time it shows up here with its live status — pending, confirmed, completed or cancelled."
            ctaLabel="Explore studios"
            ctaHref="/studios"
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
                      {b.date} · {b.startTime} – {b.endTime} ({b.totalHours} h)
                    </p>
                    <p className="truncate text-[12px] text-faint">
                      {b.studioLocation}
                    </p>
                    <p className="mt-1.5 font-heading text-[15px] font-semibold">
                      {bdt(b.totalCost, { decimals: true })}
                      {Number(b.securityDeposit) > 0 && (
                        <span className="text-[11px] font-normal text-faint">
                          {" "}
                          + {bdt(b.securityDeposit)} deposit
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-stretch justify-end gap-2 sm:flex-col">
                    {b.status === "Pending" && (
                      <button
                        type="button"
                        onClick={() => setToCancel(b)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-error/30 px-3.5 text-[12px] font-medium text-error transition-colors hover:bg-error/10"
                      >
                        <XCircle size={13} /> Cancel
                      </button>
                    )}
                    {b.status === "Confirmed" && (
                      <button
                        type="button"
                        onClick={() => downloadInvoice(b)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-base-content/15 px-3.5 text-[12px] font-medium transition-colors hover:bg-base-content/5"
                      >
                        <FileDown size={13} /> Invoice PDF
                      </button>
                    )}
                    <Link
                      href={`/studios/${b.studioId}`}
                      className="inline-flex h-9 items-center gap-1 rounded-full px-3.5 text-[12px] font-medium text-muted transition-colors hover:text-primary"
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
        confirmLabel="Yes, cancel it"
        destructive={false}
      />
    </div>
  );
}
