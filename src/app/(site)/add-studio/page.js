"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
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
    <div className="section-pad px-4 sm:px-6 max-w-3xl mx-auto">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2 flex items-center gap-2">
          <PlusCircle size={15} /> Host a space
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold">Add New Studio</h1>
        <p className="mt-2 text-sm md:text-base text-base-content/60 leading-relaxed">
          List your creative space with honest detail — clear rates, real photos
          and a candid overview convert far better than superlatives.
        </p>
      </header>

      <div className="card bg-base-100 border border-base-300 shadow-sm p-6 md:p-8">
        <StudioForm
          onSubmit={submit}
          submitLabel="Create Listing"
          busy={busy}
        />
      </div>
    </div>
  );
}
