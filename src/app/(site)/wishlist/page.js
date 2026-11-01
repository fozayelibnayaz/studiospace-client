"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import RequireSession from "@/components/RequireSession";
import StudioCard from "@/components/StudioCard";
import StudioCardSkeleton from "@/components/StudioCardSkeleton";
import EmptyState from "@/components/EmptyState";

export default function WishlistPage() {
  return (
    <RequireSession>
      <Inner />
    </RequireSession>
  );
}

function Inner() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [items, setItems] = useState(null);

  const email = session?.user?.email;

  const load = useCallback(async () => {
    if (!email) return;
    try {
      const data = await apiRequest(`/wishlist?email=${encodeURIComponent(email)}`);
      // shape wishlist rows into studio-like objects for the shared card
      const studios = data.map((w) => ({
        _id: w.studioId,
        title: w.title,
        category: w.category,
        image: w.image,
        location: w.location,
        hourlyRate: w.hourlyRate,
        rating: w.rating,
        ownerEmail: w.ownerEmail,
      }));
      setItems(studios);
    } catch (err) {
      if (err.status === 401) {
        toast.error("Session expired — please log in again.");
        router.push("/login?redirect=/wishlist");
      } else {
        setItems([]);
        toast.error(err.message || "Failed to load wishlist");
      }
    }
  }, [email, router]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="container-x">
        <header className="border-b border-base-content/10 pb-8">
          <p className="eyebrow mb-4 text-primary">Saved for later</p>
          <h1 className="display text-[2rem] sm:text-4xl md:text-[3rem]">
            Your <span className="serif italic">wishlist.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Studios you starred while browsing. Tap the heart on a card to remove
            it, or open a room to book it.
          </p>
        </header>

        {items === null ? (
          <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 md:gap-x-6">
            {Array.from({ length: 3 }, (_, i) => (
              <StudioCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Nothing saved yet"
            message="Tap the heart on any studio card while browsing and it will wait for you here."
            ctaLabel="Explore studios"
            ctaHref="/studios"
          />
        ) : (
          <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 md:gap-x-6">
            {items.map((s) => (
              <StudioCard key={s._id} studio={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
