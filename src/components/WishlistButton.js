"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";

/**
 * Heart toggle on studio cards (Optional wishlist feature).
 * - Guests → toast + redirect to /login (preserving this page)
 * - Logged in → checks GET /wishlist to learn initial state, then
 *   POST /wishlist (save) or DELETE /wishlist/:id (unsave) via JWT cookie.
 */
export default function WishlistButton({ studio, className = "" }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [saved, setSaved] = useState(false); // undefined = unknown
  const [wishlistId, setWishlistId] = useState(null);
  const [busy, setBusy] = useState(false);

  const userEmail = session?.user?.email;

  const loadState = useCallback(async () => {
    if (!userEmail) return;
    try {
      const items = await apiRequest(
        `/wishlist?email=${encodeURIComponent(userEmail)}`
      );
      const mine = items.find((w) => w.studioId === String(studio._id));
      setWishlistId(mine?._id || null);
      setSaved(Boolean(mine));
    } catch {
      /* heart just stays neutral if the check fails */
    }
  }, [userEmail, studio._id]);

  useEffect(() => {
    if (!isPending && userEmail) loadState();
  }, [isPending, userEmail, loadState]);

  if (isPending) {
    return (
      <button
        type="button"
        aria-label="Loading wishlist state"
        disabled
        className={`grid place-items-center w-9 h-9 rounded-full border border-white/40 bg-white/80 backdrop-blur text-[#141311] shadow-sm ${className}`}
      >
        <span className="loading loading-spinner loading-xs" />
      </button>
    );
  }

  const toggle = async (e) => {
    e.preventDefault(); // keep the wrapping card Link from firing
    e.stopPropagation();

    if (!userEmail) {
      toast("Login to save studios to your wishlist", { icon: "🔒" });
      router.push(
        `/login?redirect=${encodeURIComponent(`/studios/${studio._id}`)}`
      );
      return;
    }

    setBusy(true);
    try {
      if (saved && wishlistId) {
        await apiRequest(`/wishlist/${wishlistId}`, { method: "DELETE" });
        setSaved(false);
        setWishlistId(null);
        toast.success("Removed from your wishlist");
      } else {
        await apiRequest("/wishlist", {
          method: "POST",
          body: { studioId: studio._id, ...studio },
        });
        setSaved(true);
        toast.success("Saved to your wishlist");
      }
    } catch (err) {
      if (err.status === 401) {
        toast.error("Your session expired — please log in again");
        router.push("/login");
      } else {
        toast.error(err.message || "Could not update wishlist");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      title={saved ? "Remove from wishlist" : "Add to wishlist"}
      className={`grid place-items-center w-9 h-9 rounded-full border border-white/40 bg-white/80 backdrop-blur text-[#141311] shadow-sm hover:bg-white transition-colors ${className}`}
    >
      <Heart
        size={15}
        className={saved ? "fill-[#a33b2c] text-[#a33b2c]" : "text-[#141311]/70"}
      />
    </button>
  );
}
