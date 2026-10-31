"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/**
 * Branded modal — used for Booking and destructive confirmations.
 * Closes on Escape (unless busy) or backdrop click.
 */
export default function Modal({ open, onClose, children, width = "max-w-lg", busy = false }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) onClose?.();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, busy, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] grid place-items-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={() => !busy && onClose?.()}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${width} bg-base-100 border border-base-300 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto`}
      >
        <button
          type="button"
          onClick={() => !busy && onClose?.()}
          aria-label="Close dialog"
          disabled={busy}
          className="btn btn-ghost btn-sm btn-square absolute right-3 top-3 z-10"
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
