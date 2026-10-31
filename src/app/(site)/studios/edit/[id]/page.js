"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Pencil, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import RequireSession from "@/components/RequireSession";
import StudioForm from "@/components/StudioForm";
import EmptyState from "@/components/EmptyState";

export default function EditStudioPage() {
  return (
    <RequireSession>
      <Inner />
    </RequireSession>
  );
}

function Inner() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [studio, setStudio] = useState(null);
  const [state, setState] = useState("loading"); // loading | ready | notfound | forbidden
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    apiRequest(`/studios/${id}`)
      .then((data) => {
        if (
          String(data.ownerEmail).toLowerCase() !==
          session.user.email.toLowerCase()
        ) {
          setState("forbidden");
          toast.error("You can only edit your own studios.");
          return;
        }
        setStudio(data);
        setState("ready");
      })
      .catch((err) => {
        setState(err.status === 404 ? "notfound" : "notfound");
        toast.error(err.message || "Failed to load studio");
      });
  }, [id, session?.user]);

  const submit = async (body) => {
    setBusy(true);
    try {
      const res = await apiRequest(`/studios/${id}`, { method: "PATCH", body });
      toast.success(res.message || "Studio updated successfully");
      router.push("/my-listings");
    } catch (err) {
      if (err.status === 401) {
        toast.error("Session expired — please log in again.");
        router.push(`/login?redirect=/studios/edit/${id}`);
      } else {
        throw err;
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="section-pad px-4 sm:px-6 max-w-3xl mx-auto">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2 flex items-center gap-2">
          <Pencil size={15} /> Keep your listing honest
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold">Update Studio</h1>
        <p className="mt-2 text-sm md:text-base text-base-content/60">
          Changed the paint, the gear or the rate? Publish it so renters always
          see the real room.
        </p>
      </header>

      {state === "loading" && (
        <div className="card bg-base-100 border border-base-300 shadow-sm p-6 md:p-8 space-y-4">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="skeleton h-11 w-full" />
          ))}
        </div>
      )}

      {state === "notfound" && (
        <EmptyState
          title="Studio not found"
          message="This listing doesn't exist anymore — it may have been deleted."
          ctaLabel="Back to My Listings"
          ctaHref="/my-listings"
        />
      )}

      {state === "forbidden" && (
        <EmptyState
          title="Not your listing"
          message="Only the studio's owner can edit it. If this is you, log in with the owner account."
          ctaLabel="Go to My Listings"
          ctaHref="/my-listings"
        />
      )}

      {state === "ready" && studio && (
        <div className="card bg-base-100 border border-base-300 shadow-sm p-6 md:p-8">
          <div className="gap-6 grid">
            {/* read-only host identity, from session */}
            <div className="flex flex-wrap gap-x-8 gap-y-2 bg-base-200/50 border border-base-300 rounded-xl px-4 py-3 text-sm">
              <p>
                <span className="text-base-content/55">Host name: </span>
                <b>{session?.user?.name}</b>
              </p>
              <p>
                <span className="text-base-content/55">Host email: </span>
                <b>{session?.user?.email}</b>
              </p>
            </div>
            <StudioForm
              initial={studio}
              onSubmit={submit}
              submitLabel={busy ? "Saving…" : "Save Changes"}
              busy={busy}
            />
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-base-content/45 justify-center">
            <LoaderCircle size={12} className="hidden" />
            <Link href="/my-listings" className="link link-hover">
              ← Back to My Studio Listings
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
