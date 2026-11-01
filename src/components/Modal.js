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
        className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
        onClick={() => !busy && onClose?.()}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${width} max-h-[90vh] overflow-y-auto rounded-[1.5rem] border border-base-content/10 bg-base-100 shadow-2xl`}
      >
        <button
          type="button"
          onClick={() => !busy && onClose?.()}
          aria-label="Close dialog"
          disabled={busy}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-base-content/10 text-muted transition-colors hover:bg-base-content/5 hover:text-base-content disabled:opacity-40"
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
