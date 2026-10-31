"use client";

import { useState } from "react";
import { Trash2, TriangleAlert, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

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
      <div className="p-6 text-center">
        <span
          className={`inline-grid place-items-center w-14 h-14 rounded-2xl mb-3 ${
            destructive ? "bg-error/10 text-error" : "bg-warning/10 text-warning"
          }`}
        >
          {destructive ? <Trash2 size={24} /> : <TriangleAlert size={24} />}
        </span>
        <h3 className="font-heading font-bold text-lg">{title}</h3>
        <p className="mt-2 text-sm text-base-content/65 leading-relaxed">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="btn btn-outline flex-1"
          >
            Keep it
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`btn flex-1 ${destructive ? "btn-error" : "btn-warning"}`}
          >
            {busy ? <LoaderCircle size={16} className="loading" /> : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
