"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Coins,
  ShieldCheck,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import { bdt } from "@/lib/format";
import Modal from "./Modal";

const field =
  "h-11 w-full rounded-xl border border-base-content/15 bg-base-200/50 px-3.5 text-sm text-base-content outline-none transition-colors focus:border-[#e79b23] disabled:opacity-70";

export default function BookingModal({ studio, open, onClose }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [busy, setBusy] = useState(false);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const toMinutes = (t) => {
    const [h, m] = String(t).split(":").map(Number);
    return h * 60 + (m || 0);
  };

  const totalHours = useMemo(() => {
    if (!startTime || !endTime) return 0;
    const mins = toMinutes(endTime) - toMinutes(startTime);
    return mins > 0 ? Number((mins / 60).toFixed(2)) : 0;
  }, [startTime, endTime]);

  const totalCost = totalHours * (Number(studio.hourlyRate) || 0);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await apiRequest("/bookings", {
        method: "POST",
        body: {
          studioId: studio._id,
          date,
          startTime,
          endTime,
        },
      });
      toast.success("Booking created — it is now pending confirmation!");
      onClose?.();
      router.push(`/my-bookings?justBooked=${studio._id}`);
    } catch (err) {
      if (err.status === 401) {
        toast.error("Your session expired — please log in again.");
        router.push(
          `/login?redirect=${encodeURIComponent(`/studios/${studio._id}`)}`
        );
      } else {
        // 409 double-booking etc. → show the server's exact message
        toast.error(err.message || "Booking failed");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} busy={busy} width="max-w-lg">
      <form onSubmit={submit} className="p-6 md:p-7">
        <p className="eyebrow text-primary mb-3">Reserve time</p>
        <h3 className="display text-2xl">Book this room</h3>
        <p className="mt-2 truncate text-sm text-muted">
          {studio.title} · {studio.category}
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
              <CalendarDays size={13} className="text-[#e79b23]" /> Date
            </span>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={field}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                <Clock size={13} className="text-[#e79b23]" /> Start
              </span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className={field}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                <Clock size={13} className="text-[#e79b23]" /> End
              </span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className={field}
              />
            </label>
          </div>

          {/* Read-only customer identity, straight from the session */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                Name
              </span>
              <input
                type="text"
                value={session?.user?.name || ""}
                readOnly
                disabled
                className={field}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                Email
              </span>
              <input
                type="email"
                value={session?.user?.email || ""}
                readOnly
                disabled
                className={field}
              />
            </label>
          </div>

          {/* Live cost breakdown */}
          <div className="rounded-2xl border border-base-content/10 bg-base-200/60 p-4 text-[13px]">
            <p className="flex justify-between">
              <span className="text-muted">Hourly rate</span>
              <span className="font-medium">{bdt(studio.hourlyRate)} / hr</span>
            </p>
            <p className="mt-1.5 flex justify-between">
              <span className="text-muted">Total hours</span>
              <span className="font-medium tabular-nums">
                {totalHours || "—"}
              </span>
            </p>
            <p className="mt-3 flex items-center justify-between border-t border-base-content/10 pt-3">
              <span className="flex items-center gap-1.5 text-muted">
                <Coins size={14} className="text-[#e79b23]" /> Studio total
              </span>
              <span className="font-heading text-lg font-semibold text-primary">
                {bdt(totalCost, { decimals: true })}
              </span>
            </p>
            {Number(studio.securityDeposit) > 0 && (
              <p className="mt-1.5 flex justify-between text-[11.5px] text-faint">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={12} /> Refundable deposit
                </span>
                <span>{bdt(studio.securityDeposit)}</span>
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral text-sm font-medium text-neutral-content transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {busy ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <>
              Confirm booking <ArrowRight size={15} />
            </>
          )}
        </button>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-faint">
          Nothing is charged on the platform. Overlapping requests for booked
          hours are rejected automatically by the server.
        </p>
      </form>
    </Modal>
  );
}
