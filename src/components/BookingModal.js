"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock, Coins, ShieldCheck, SquareArrowOutUpRight } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import { bdt } from "@/lib/format";
import Modal from "./Modal";

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

  const field =
    "input input-bordered w-full bg-base-200/50 disabled:opacity-70";

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
        router.push(`/login?redirect=${encodeURIComponent(`/studios/${studio._id}`)}`);
      } else {
        // 409 double-booking etc. → show the server's exact message
        toast.error(err.message || "Booking failed");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} busy={busy} width="max-w-md">
      <form onSubmit={submit} className="p-6 md:p-7 space-y-4">
        <div>
          <h3 className="font-heading font-bold text-xl">Book Workspace Time</h3>
          <p className="text-sm text-base-content/60 mt-1 truncate">
            {studio.title} · {studio.category}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="form-control">
            <span className="label-text text-xs font-medium mb-1 flex items-center gap-1.5">
              <CalendarDays size={13} className="text-primary" /> Date
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
            <label className="form-control">
              <span className="label-text text-xs font-medium mb-1 flex items-center gap-1.5">
                <Clock size={13} className="text-primary" /> Start
              </span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className={field}
              />
            </label>
            <label className="form-control">
              <span className="label-text text-xs font-medium mb-1 flex items-center gap-1.5">
                <Clock size={13} className="text-primary" /> End
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
        </div>

        {/* Read-only customer identity, straight from the session */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="form-control">
            <span className="label-text text-xs font-medium mb-1">Name</span>
            <input
              type="text"
              value={session?.user?.name || ""}
              readOnly
              disabled
              className={field}
            />
          </label>
          <label className="form-control">
            <span className="label-text text-xs font-medium mb-1">Email</span>
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
        <div className="bg-base-200/70 border border-base-300 rounded-xl p-4 space-y-1.5 text-sm">
          <p className="flex justify-between">
            <span className="text-base-content/60">Hourly rate</span>
            <span className="font-medium">{bdt(studio.hourlyRate)} / hr</span>
          </p>
          <p className="flex justify-between">
            <span className="text-base-content/60">Total hours</span>
            <span className="font-medium">{totalHours || "—"}</span>
          </p>
          <p className="flex justify-between border-t border-base-300/70 pt-2">
            <span className="flex items-center gap-1.5 text-base-content/60">
              <Coins size={14} className="text-primary" /> Studio total
            </span>
            <span className="font-heading font-bold text-lg text-primary">
              {bdt(totalCost, { decimals: true })}
            </span>
          </p>
          {Number(studio.securityDeposit) > 0 && (
            <p className="flex justify-between text-xs text-base-content/55">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} /> Refundable security deposit
              </span>
              <span>{bdt(studio.securityDeposit)}</span>
            </p>
          )}
        </div>

        <button type="submit" disabled={busy} className="btn btn-primary w-full">
          {busy ? (
            <span className="loading loading-spinner" />
          ) : (
            <>
              <SquareArrowOutUpRight size={16} /> Confirm Booking
            </>
          )}
        </button>
        <p className="text-[11px] text-base-content/45 text-center leading-relaxed">
          You will not be charged on the platform. Overlapping requests for
          booked hours are rejected automatically by the server.
        </p>
      </form>
    </Modal>
  );
}
