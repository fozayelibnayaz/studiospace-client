"use client";

import { useMemo, useState } from "react";
import { ImagePlus, LoaderCircle, Link2, Plus, X } from "lucide-react";

import { CATEGORIES, AMENITY_OPTIONS } from "@/lib/constants";
import { uploadToImgbb } from "@/lib/api";

const field = "input input-bordered w-full bg-base-200/50";
const labelTx = "label-text text-sm font-medium";

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
export default function StudioForm({ initial, onSubmit, submitLabel = "Create Listing", busy = false }) {
  const [form, setForm] = useState(() => ({ ...emptyStudio(), ...(initial || {}) }));
  const [customAmenity, setCustomAmenity] = useState("");
  const [uploading, setUploading] = useState(false);
  const [inlineError, setInlineError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const numeric = useMemo(
    () => new Set(["hourlyRate", "securityDeposit", "maxCapacity"]),
    []
  );

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
      document.getElementById("studio-image-file")?.classList.remove("file-input-error");
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
    <form onSubmit={submit} className="space-y-6" noValidate>
      {inlineError && (
        <p role="alert" className="text-sm text-error font-medium bg-error/10 border border-error/30 rounded-lg px-4 py-2.5">
          {inlineError}
        </p>
      )}

      {/* Basics */}
      <section className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label pb-1" htmlFor="sf-title">
            <span className={labelTx}>Title</span>
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
          <label className="label pb-1" htmlFor="sf-category">
            <span className={labelTx}>Category</span>
          </label>
          <select
            id="sf-category"
            className={`${field} ${form.category ? "" : "text-base-content/50"}`}
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
          <label className="label pb-1" htmlFor="sf-location">
            <span className={labelTx}>Location / Address</span>
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
          <label className="label pb-1" htmlFor="sf-rate">
            <span className={labelTx}>Hourly Rate (৳ BDT)</span>
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
          <label className="label pb-1" htmlFor="sf-deposit">
            <span className={labelTx}>Security Deposit (৳ BDT) <span className="text-base-content/40">(refundable)</span></span>
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
          <label className="label pb-1" htmlFor="sf-cap">
            <span className={labelTx}>Max Capacity (people)</span>
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
      </section>

      {/* Photo — imgbb upload OR pasted URL */}
      <section className="bg-base-200/40 border border-base-300 rounded-xl p-4 space-y-3">
        <p className="font-heading font-semibold text-sm">Studio Photo</p>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <label className="form-control flex-1">
            <span className={labelTx + " flex items-center gap-1.5 mb-1"}>
              <ImagePlus size={14} className="text-primary" /> Upload file (imgbb)
            </span>
            <input
              id="studio-image-file"
              type="file"
              accept="image/*"
              onChange={onFile}
              className="file-input file-input-bordered file-input-sm w-full text-base-content"
            />
          </label>
          <label className="form-control flex-1">
            <span className={labelTx + " flex items-center gap-1.5 mb-1"}>
              <Link2 size={14} className="text-primary" /> …or paste image URL
            </span>
            <input
              type="url"
              className={field}
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://i.ibb.co/… or https://images.unsplash.com/photo-…"
            />
          </label>
        </div>
        {uploading && (
          <p className="text-xs text-primary flex items-center gap-2">
            <LoaderCircle size={13} className="loading" /> Uploading to imgbb…
          </p>
        )}
        {form.image?.startsWith("http") && (
          <div className="flex gap-3 items-center pt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.image}
              alt="Studio preview"
              className="w-24 h-18 aspect-[4/3] object-cover rounded-lg border border-base-300"
            />
            <button
              type="button"
              className="btn btn-ghost btn-xs text-error"
              onClick={() => set("image", "")}
            >
              <X size={13} /> Remove
            </button>
          </div>
        )}
      </section>

      {/* Amenities */}
      <section>
        <label className={labelTx + " block mb-2"}>Amenities</label>
        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((a) => (
            <button
              type="button"
              key={a}
              aria-pressed={form.amenities.includes(a)}
              onClick={() => toggleAmenity(a)}
              className={`btn btn-xs sm:btn-sm rounded-full border ${
                form.amenities.includes(a)
                  ? "btn-primary border-primary"
                  : "btn-outline border-base-300 hover:border-primary hover:text-primary"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
        <div className="join mt-3 max-w-sm">
          <input
            type="text"
            className="input input-bordered join-item input-sm w-full bg-base-200/50"
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomAmenity();
              }
            }}
            placeholder="Add custom amenity (e.g. Cyclorama repaint service)"
          />
          <button
            type="button"
            onClick={addCustomAmenity}
            className="btn btn-outline join-item btn-sm px-3"
            aria-label="Add custom amenity"
          >
            <Plus size={15} />
          </button>
        </div>
      </section>

      {/* Overview */}
      <section>
        <label className={labelTx + " block mb-1"} htmlFor="sf-overview">
          Detailed Overview
        </label>
        <textarea
          id="sf-overview"
          className={`${field} h-36 leading-relaxed`}
          value={form.overview}
          onChange={(e) => set("overview", e.target.value)}
          placeholder="Describe the room, the gear renters get, load-in access and house rules — e.g. generator backup, lift access, parking, repaint service…"
        />
        <p className="text-xs text-base-content/45 mt-1">
          {form.overview.length} characters (minimum 60)
        </p>
      </section>

      <div className="flex gap-3">
        <button type="submit" disabled={busy || uploading} className="btn btn-primary min-w-44">
          {busy || uploading ? (
            <LoaderCircle size={16} className="loading" />
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
