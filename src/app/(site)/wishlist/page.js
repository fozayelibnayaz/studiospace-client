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
  const [syncedCards, setSyncedCards] = useState(false);

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
      setSyncedCards(true);
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
    <div className="section-pad px-4 sm:px-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2 flex items-center gap-2">
          <Heart size={15} /> Saved for later
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold">Your Wishlist</h1>
        <p className="mt-2 text-sm text-base-content/60">
          Studios you starred while browsing. Tap the heart on a card to remove.
        </p>
      </header>

      {items === null ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <StudioCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Nothing saved yet"
          message="Tap the heart on any studio card while browsing and it will wait for you here."
          ctaLabel="Explore Studios"
          ctaHref="/studios"
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <StudioCard key={s._id} studio={s} />
          ))}
        </div>
      )}
    </div>
  );
}
