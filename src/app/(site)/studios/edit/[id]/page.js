"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
        setState("notfound");
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
    <div className="pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="container-x max-w-3xl">
        <Link
          href="/my-listings"
          className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-medium text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft size={13} /> Back to my listings
        </Link>

        <header className="border-b border-base-content/10 pb-8">
          <p className="eyebrow mb-4 text-primary">Keep your listing honest</p>
          <h1 className="display text-[2rem] sm:text-4xl md:text-[3rem]">
            Update <span className="serif italic">studio.</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-[15px]">
            Changed the paint, the gear or the rate? Publish it so renters always
            see the real room.
          </p>
        </header>

        {state === "loading" && (
          <div className="mt-8 space-y-4 rounded-[1.5rem] border border-base-content/10 p-6 md:p-8">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="skeleton h-11 w-full rounded-xl" />
            ))}
          </div>
        )}

        {state === "notfound" && (
          <EmptyState
            title="Studio not found"
            message="This listing doesn't exist anymore — it may have been deleted."
            ctaLabel="Back to my listings"
            ctaHref="/my-listings"
          />
        )}

        {state === "forbidden" && (
          <EmptyState
            title="Not your listing"
            message="Only the studio's owner can edit it. If this is you, log in with the owner account."
            ctaLabel="Go to my listings"
            ctaHref="/my-listings"
          />
        )}

        {state === "ready" && studio && (
          <div className="mt-8 rounded-[1.5rem] border border-base-content/10 p-6 md:p-8">
            {/* read-only host identity, from session */}
            <div className="mb-6 flex flex-wrap gap-x-8 gap-y-2 rounded-xl border border-base-content/10 bg-base-200/50 px-4 py-3 text-[12.5px]">
              <p>
                <span className="text-muted">Host name: </span>
                <b className="font-medium">{session?.user?.name}</b>
              </p>
              <p>
                <span className="text-muted">Host email: </span>
                <b className="font-medium">{session?.user?.email}</b>
              </p>
            </div>
            <StudioForm
              initial={studio}
              onSubmit={submit}
              submitLabel={busy ? "Saving…" : "Save changes"}
              busy={busy}
            />
          </div>
        )}
      </div>
    </div>
  );
}
