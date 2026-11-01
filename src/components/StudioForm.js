"use client";

import { useMemo, useState } from "react";
import { ImagePlus, LoaderCircle, Link2, Plus, X } from "lucide-react";

import { CATEGORIES, AMENITY_OPTIONS } from "@/lib/constants";
import { uploadToImgbb } from "@/lib/api";

const field =
  "h-11 w-full rounded-xl border border-base-content/15 bg-base-200/40 px-3.5 text-sm text-base-content outline-none transition-colors placeholder:text-faint focus:border-[#e79b23] focus:bg-base-100";
const labelTx =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-faint";
const previewable = (src) =>
  typeof src === "string" && (src.startsWith("http") || src.startsWith("/"));

function emptyStudio() {
  return {
    title: "",
    category: "",
    hourlyRate: "",
    securityDeposit: "",
    maxCapacity: "",
    location: "",
    image: "",
    amenities: [],
    overview: "",
  };
}

/**
 * Shared studio form — Add New Studio and Update Studio (pre-filled).
 * Host name / email are rendered read-only from the session by the parent.
 */
export default function StudioForm({
  initial,
  onSubmit,
  submitLabel = "Create listing",
  busy = false,
}) {
  const [form, setForm] = useState(() => ({ ...emptyStudio(), ...(initial || {}) }));
  const [customAmenity, setCustomAmenity] = useState("");
  const [uploading, setUploading] = useState(false);
  const [inlineError, setInlineError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleAmenity = (a) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));
  };

  const addCustomAmenity = () => {
    const v = customAmenity.trim();
    if (!v) return;
    if (!form.amenities.includes(v)) set("amenities", [...form.amenities, v]);
    setCustomAmenity("");
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setInlineError("");
    try {
      const url = await uploadToImgbb(file);
      set("image", url);
    } catch (err) {
      setInlineError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setInlineError("");
    if (!form.title.trim() || !form.category) {
      setInlineError("Title and category are required.");
      return;
    }
    if (!form.hourlyRate || Number(form.hourlyRate) <= 0) {
      setInlineError("Hourly rate must be a positive number.");
      return;
    }
    if (!form.image?.trim()) {
      setInlineError("Add a photo — upload a file to imgbb or paste an image URL.");
      return;
    }
    if (!form.location.trim()) {
      setInlineError("Location is required so renters can find your space.");
      return;
    }
    if (!form.overview.trim() || form.overview.trim().length < 60) {
      setInlineError("Write an overview of at least 60 characters describing the space.");
      return;
    }
    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        location: form.location.trim(),
        overview: form.overview.trim(),
        amenities: form.amenities,
        hourlyRate: Number(form.hourlyRate),
        securityDeposit: Number(form.securityDeposit) || 0,
        maxCapacity: Number(form.maxCapacity) || 1,
      });
    } catch (err) {
      setInlineError(err.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-8" noValidate>
      {inlineError && (
        <p
          role="alert"
          className="rounded-xl border border-error/25 bg-error/10 px-4 py-2.5 text-[13px] font-medium text-error"
        >
          {inlineError}
        </p>
      )}

      {/* Basics */}
      <fieldset>
        <legend className="mb-4 font-heading text-[15px] font-medium">
          The basics
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelTx} htmlFor="sf-title">
              Title
            </label>
            <input
              id="sf-title"
              className={field}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Gulshan Glasshouse Photo Studio"
              maxLength={90}
            />
          </div>

          <div>
            <label className={labelTx} htmlFor="sf-category">
              Category
            </label>
            <select
              id="sf-category"
              className={`${field} ${form.category ? "" : "text-muted"}`}
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              <option value="" disabled>
                Select category…
              </option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelTx} htmlFor="sf-location">
              Location / address
            </label>
            <input
              id="sf-location"
              className={field}
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="House 34, Road 12, Banani, Dhaka 1213"
            />
          </div>

          <div>
            <label className={labelTx} htmlFor="sf-rate">
              Hourly rate (৳ BDT)
            </label>
            <input
              id="sf-rate"
              type="number"
              min="1"
              step="1"
              className={field}
              value={form.hourlyRate}
              onChange={(e) => set("hourlyRate", e.target.value)}
              placeholder="4500"
            />
          </div>

          <div>
            <label className={labelTx} htmlFor="sf-deposit">
              Security deposit (৳ BDT){" "}
              <span className="font-normal normal-case tracking-normal text-faint">
                refundable
              </span>
            </label>
            <input
              id="sf-deposit"
              type="number"
              min="0"
              step="1"
              className={field}
              value={form.securityDeposit}
              onChange={(e) => set("securityDeposit", e.target.value)}
              placeholder="15000"
            />
          </div>

          <div>
            <label className={labelTx} htmlFor="sf-cap">
              Max capacity (people)
            </label>
            <input
              id="sf-cap"
              type="number"
              min="1"
              step="1"
              className={field}
              value={form.maxCapacity}
              onChange={(e) => set("maxCapacity", e.target.value)}
              placeholder="12"
            />
          </div>
        </div>
      </fieldset>

      {/* Photo — imgbb upload OR pasted URL */}
      <fieldset className="rounded-2xl border border-base-content/10 bg-base-200/40 p-5">
        <legend className="px-1 font-heading text-[15px] font-medium">
          Studio photo
        </legend>
        <div className="mt-2 flex flex-col items-stretch gap-4 sm:flex-row">
          <label className="flex-1">
            <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
              <ImagePlus size={13} className="text-[#e79b23]" /> Upload (imgbb)
            </span>
            <input
              id="studio-image-file"
              type="file"
              accept="image/*"
              onChange={onFile}
              className="block w-full text-[12px] text-muted file:mr-3 file:h-9 file:rounded-full file:border-0 file:bg-neutral file:px-4 file:text-[12px] file:font-medium file:text-neutral-content hover:file:opacity-90"
            />
          </label>
          <label className="flex-1">
            <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
              <Link2 size={13} className="text-[#e79b23]" /> …or paste a URL
            </span>
            <input
              type="url"
              className={field}
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://i.ibb.co/… or /studios/room.jpg"
            />
          </label>
        </div>
        {uploading && (
          <p className="mt-3 flex items-center gap-2 text-[12px] text-primary">
            <LoaderCircle size={13} className="animate-spin" /> Uploading to
            imgbb…
          </p>
        )}
        {previewable(form.image) && (
          <div className="mt-4 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.image}
              alt="Studio preview"
              className="h-20 w-28 rounded-lg border border-base-content/10 object-cover"
            />
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-base-content/15 px-3 py-1.5 text-[11px] text-error transition-colors hover:bg-error/10"
              onClick={() => set("image", "")}
            >
              <X size={12} /> Remove
            </button>
          </div>
        )}
      </fieldset>

      {/* Amenities */}
      <fieldset>
        <legend className="mb-3 font-heading text-[15px] font-medium">
          Amenities
        </legend>
        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((a) => {
            const on = form.amenities.includes(a);
            return (
              <button
                type="button"
                key={a}
                aria-pressed={on}
                onClick={() => toggleAmenity(a)}
                className={`h-8 rounded-full border px-3.5 text-[12px] font-medium transition-colors ${
                  on
                    ? "border-neutral bg-neutral text-neutral-content"
                    : "border-base-content/15 text-muted hover:border-base-content/35 hover:text-base-content"
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex max-w-sm gap-2">
          <input
            type="text"
            className={field}
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomAmenity();
              }
            }}
            placeholder="Add custom amenity (e.g. cyclorama repaint)"
          />
          <button
            type="button"
            onClick={addCustomAmenity}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-base-content/15 transition-colors hover:bg-base-content/5"
            aria-label="Add custom amenity"
          >
            <Plus size={15} />
          </button>
        </div>
      </fieldset>

      {/* Overview */}
      <div>
        <label className={labelTx} htmlFor="sf-overview">
          Detailed overview
        </label>
        <textarea
          id="sf-overview"
          className="h-36 w-full rounded-xl border border-base-content/15 bg-base-200/40 px-3.5 py-3 text-sm leading-relaxed text-base-content outline-none transition-colors placeholder:text-faint focus:border-[#e79b23] focus:bg-base-100"
          value={form.overview}
          onChange={(e) => set("overview", e.target.value)}
          placeholder="Describe the room, the gear renters get, load-in access and house rules — e.g. generator backup, lift access, parking, repaint service…"
        />
        <p className="mt-1.5 text-[11px] text-faint">
          {form.overview.length} characters (minimum 60)
        </p>
      </div>

      <div className="flex gap-3 border-t border-base-content/10 pt-6">
        <button
          type="submit"
          disabled={busy || uploading}
          className="inline-flex h-11 min-w-44 items-center justify-center gap-2 rounded-full bg-neutral px-6 text-[13px] font-medium text-neutral-content transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {busy || uploading ? (
            <LoaderCircle size={15} className="animate-spin" />
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
