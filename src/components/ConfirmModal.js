"use client";

import { Trash2, TriangleAlert, LoaderCircle } from "lucide-react";

import Modal from "./Modal";

/**
 * Custom confirmation dialog (never window.confirm).
 * busy streets the backdrop; onClose is suppressed while a request runs.
 */
export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  busy = false,
  destructive = true,
}) {
  return (
    <Modal open={open} onClose={onClose} busy={busy} width="max-w-sm">
      <div className="p-7">
        <span
          className={`mb-4 grid h-12 w-12 place-items-center rounded-full ${
            destructive
              ? "bg-error/10 text-error"
              : "bg-[#e79b23]/12 text-[#a86a12]"
          }`}
        >
          {destructive ? <Trash2 size={21} /> : <TriangleAlert size={21} />}
        </span>
        <h3 className="font-heading text-lg font-semibold tracking-[-0.02em]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="h-11 flex-1 rounded-full border border-base-content/15 text-[13px] font-medium transition-colors hover:bg-base-content/5 disabled:opacity-50"
          >
            Keep it
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-[13px] font-medium transition-opacity hover:opacity-90 disabled:opacity-60 ${
              destructive
                ? "bg-error text-error-content"
                : "bg-neutral text-neutral-content"
            }`}
          >
            {busy ? <LoaderCircle size={15} className="animate-spin" /> : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
