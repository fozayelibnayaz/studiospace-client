"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import RequireSession from "@/components/RequireSession";
import StudioForm from "@/components/StudioForm";

export default function AddStudioPage() {
  return (
    <RequireSession>
      <Inner />
    </RequireSession>
  );
}

function Inner() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [busy, setBusy] = useState(false);

  const submit = async (body) => {
    setBusy(true);
    try {
      const res = await apiRequest("/studios", {
        method: "POST",
        body: {
          ...body,
          ownerName: session.user.name || "Studio host",
          ownerEmail: session.user.email,
          ownerPhoto: session.user.image || "",
          rating: 4.5,
          totalReviews: 0,
        },
      });
      toast.success(res.message || "Studio created successfully");
      router.push("/my-listings");
    } catch (err) {
      if (err.status === 401) {
        toast.error("Session expired — please log in again.");
        router.push("/login?redirect=/add-studio");
      } else {
        throw err; // StudioForm shows it inline
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="container-x max-w-3xl">
        <header className="border-b border-base-content/10 pb-8">
          <p className="eyebrow mb-4 text-primary">Host a space</p>
          <h1 className="display text-[2rem] sm:text-4xl md:text-[3rem]">
            Add a <span className="serif italic">studio.</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-[15px]">
            List your creative space with honest detail — clear rates, real
            photos and a candid overview convert far better than superlatives.
          </p>
        </header>

        <div className="mt-8 rounded-[1.5rem] border border-base-content/10 p-6 md:p-8">
          <div className="mb-6 flex flex-wrap gap-x-8 gap-y-2 rounded-xl border border-base-content/10 bg-base-200/50 px-4 py-3 text-[12.5px]">
            <p>
              <span className="text-muted">Host name: </span>
              <b className="font-medium">{session.user.name}</b>
            </p>
            <p>
              <span className="text-muted">Host email: </span>
              <b className="font-medium">{session.user.email}</b>
            </p>
          </div>
          <StudioForm onSubmit={submit} submitLabel="Create listing" busy={busy} />
        </div>
      </div>
    </div>
  );
}
