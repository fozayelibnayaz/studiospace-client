"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FolderOpen, Pencil, Trash2, Plus } from "lucide-react";
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
    <div className="section-pad px-4 sm:px-6 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2 flex items-center gap-2">
            <FolderOpen size={15} /> Host dashboard
          </p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold">My Studio Listings</h1>
          <p className="mt-2 text-sm text-base-content/60">
            Everything you rent out on StudioSpace, newest first.
          </p>
        </div>
        <Link href="/add-studio" className="btn btn-primary btn-sm md:btn-md px-4">
          <Plus size={16} /> Add New Studio
        </Link>
      </header>

      {studios === null ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="card bg-base-100 border border-base-300 p-4 flex gap-4">
              <div className="skeleton w-40 h-28 rounded-xl" />
              <div className="flex-1 space-y-3 py-1">
                <div className="skeleton h-5 w-2/3" />
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-9 w-40" />
              </div>
            </div>
          ))}
        </div>
      ) : studios.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="You haven't listed a studio yet"
          message="Got a cyc wall, a soundstage, a treated podcast room to share? Create your first listing — it takes about two minutes."
          ctaLabel="Add Your First Studio"
          ctaHref="/add-studio"
        />
      ) : (
        <ul className="space-y-4">
          {studios.map((s) => (
            <li
              key={s._id}
              className="card bg-base-100 border border-base-300 shadow-sm flex flex-col sm:flex-row gap-4 p-4 hover:border-primary/40 transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image}
                alt={s.title}
                className="w-full sm:w-44 h-36 sm:h-28 object-cover rounded-xl border border-base-300 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge badge-primary badge-sm font-semibold uppercase tracking-wide">
                    {s.category}
                  </span>
                  <span className="text-xs text-base-content/50">
                    ★ {Number(s.rating).toFixed(1)}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg mt-1 truncate">{s.title}</h3>
                <p className="text-sm text-base-content/60 truncate">{s.location}</p>
                <p className="font-heading font-semibold mt-0.5">
                  {bdt(s.hourlyRate)}
                  <span className="text-xs font-normal text-base-content/55"> / hr</span>
                </p>
              </div>
              <div className="flex sm:flex-col gap-2 justify-end">
                <Link href={`/studios/edit/${s._id}`} className="btn btn-outline btn-sm flex-1 sm:flex-none">
                  <Pencil size={14} /> Update
                </Link>
                <button
                  type="button"
                  onClick={() => setToDelete(s)}
                  className="btn btn-error btn-outline btn-sm flex-1 sm:flex-none"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

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
        confirmLabel="Delete Studio"
      />
    </div>
  );
}
