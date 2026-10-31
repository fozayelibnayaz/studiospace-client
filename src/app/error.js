"use client";

import { useEffect } from "react";
import { CameraOff, RotateCcw } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Surface the failure in the console for easier debugging
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex-1 grid place-items-center bg-base-200/40 px-4">
      <div className="text-center max-w-lg text-center">
        <div className="inline-grid place-items-center w-16 h-16 rounded-2xl bg-error/10 text-error mb-5">
          <CameraOff size={30} />
        </div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold">
          Something knocked the tripod
        </h1>
        <p className="mt-3 text-sm md:text-base text-base-content/60 leading-relaxed">
          A part of this page could not load — possibly our studio API blinked.
          Give it another take.
        </p>
        <button type="button" onClick={reset} className="btn btn-primary mt-6">
          <RotateCcw size={16} /> Try Again
        </button>
      </div>
    </div>
  );
}
