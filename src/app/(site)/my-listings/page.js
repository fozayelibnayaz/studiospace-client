"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FolderOpen, Pencil, Trash2, Plus, ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { bdt } from "@/lib/format";
import { apiRequest } from "@/lib/api";
import RequireSession from "@/components/RequireSession";
import EmptyState from "@/components/EmptyState";
import ConfirmModal from "@/components/ConfirmModal";

export default function MyListingsPage() {
  return (
    <RequireSession>
      <Inner />
    </RequireSession>
  );
}

function Inner() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [studios, setStudios] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const email = session?.user?.email;

  const load = useCallback(async () => {
    if (!email) return;
    try {
      const data = await apiRequest(`/my-studios?email=${encodeURIComponent(email)}`);
      setStudios(data);
    } catch (err) {
      if (err.status === 401) {
        toast.error("Session expired — please log in again.");
        router.push("/login?redirect=/my-listings");
      } else {
        setStudios([]);
        toast.error(err.message || "Failed to load your listings");
      }
    }
  }, [email, router]);

  useEffect(() => {
    load();
  }, [load]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setBusy(true);
    try {
      await apiRequest(`/studios/${toDelete._id}`, { method: "DELETE" });
      setStudios((s) => s.filter((x) => x._id !== toDelete._id));
      toast.success(`"${toDelete.title}" deleted`);
      setToDelete(null);
    } catch (err) {
      if (err.status === 401) {
        toast.error("Session expired — please log in again.");
        router.push("/login?redirect=/my-listings");
      } else {
        toast.error(err.message || "Delete failed");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="container-x">
        <header className="flex flex-wrap items-end justify-between gap-5 border-b border-base-content/10 pb-8">
          <div>
            <p className="eyebrow mb-4 text-primary">Host dashboard</p>
            <h1 className="display text-[2rem] sm:text-4xl md:text-[3rem]">
              My <span className="serif italic">listings.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              Everything you rent out on StudioSpace, newest first. Update a rate,
              swap a photo or retire a room at any time.
            </p>
          </div>
          <Link
            href="/add-studio"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-neutral px-5 text-[13px] font-medium text-neutral-content transition-opacity hover:opacity-90"
          >
            <Plus size={15} /> Add a studio
          </Link>
        </header>

        {studios === null ? (
          <ul className="mt-8 divide-y divide-base-content/10 border-y border-base-content/10">
            {Array.from({ length: 3 }, (_, i) => (
              <li key={i} className="flex gap-4 py-5">
                <div className="skeleton h-24 w-36 rounded-xl" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="skeleton h-5 w-2/3 rounded-md" />
                  <div className="skeleton h-4 w-1/3 rounded-md" />
                  <div className="skeleton h-9 w-40 rounded-full" />
                </div>
              </li>
            ))}
          </ul>
        ) : studios.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="You haven't listed a studio yet"
            message="Got a cyc wall, a soundstage, a treated podcast room to share? Create your first listing — it takes about two minutes."
            ctaLabel="Add your first studio"
            ctaHref="/add-studio"
          />
        ) : (
          <ul className="mt-8 divide-y divide-base-content/10 border-y border-base-content/10">
            {studios.map((s) => (
              <li
                key={s._id}
                className="group flex flex-col gap-4 py-5 sm:flex-row"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={s.title}
                  className="h-40 w-full shrink-0 rounded-xl object-cover sm:h-24 sm:w-36"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-base-content/12 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                      {s.category}
                    </span>
                    <span className="text-[11px] text-faint">
                      ★ {Number(s.rating).toFixed(1)}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-heading text-[15px] font-medium">
                    <Link
                      href={`/studios/${s._id}`}
                      className="transition-colors hover:text-primary"
                    >
                      {s.title}
                    </Link>
                  </h3>
                  <p className="truncate text-[13px] text-muted">{s.location}</p>
                  <p className="mt-1 font-heading text-[14px] font-semibold">
                    {bdt(s.hourlyRate)}
                    <span className="text-[11px] font-normal text-faint">
                      {" "}
                      / hour
                    </span>
                  </p>
                </div>
                <div className="flex items-stretch justify-end gap-2 sm:flex-col">
                  <Link
                    href={`/studios/edit/${s._id}`}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-base-content/15 px-3.5 text-[12px] font-medium transition-colors hover:bg-base-content/5"
                  >
                    <Pencil size={13} /> Update
                  </Link>
                  <button
                    type="button"
                    onClick={() => setToDelete(s)}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-error/30 px-3.5 text-[12px] font-medium text-error transition-colors hover:bg-error/10"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                  <Link
                    href={`/studios/${s._id}`}
                    className="inline-flex h-9 items-center justify-center gap-1 rounded-full px-3.5 text-[12px] font-medium text-muted transition-colors hover:text-primary"
                  >
                    View <ArrowUpRight size={12} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmModal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        busy={busy}
        title="Delete this studio?"
        message={
          toDelete
            ? `"${toDelete.title}" will be removed permanently. Its pending bookings and wishlist saves are cleaned up too.`
            : ""
        }
        confirmLabel="Delete studio"
      />
    </div>
  );
}
