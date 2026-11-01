"use client";

import { useEffect } from "react";
import { CameraOff, RotateCcw } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex-1 grid place-items-center bg-base-200/40 px-4">
      <div className="text-center max-w-lg">
        <div className="inline-grid place-items-center w-16 h-16 rounded-full border border-base-content/10 bg-base-100 text-[#e79b23] mb-5">
          <CameraOff size={30} strokeWidth={1.6} />
        </div>
        <h1 className="display text-2xl md:text-3xl">
          Something knocked the tripod
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          A part of this page could not load — possibly our studio API blinked.
          Give it another take.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-neutral px-6 text-[13px] font-medium text-neutral-content transition-opacity hover:opacity-90"
        >
          <RotateCcw size={14} /> Try again
        </button>
      </div>
    </div>
  );
}
