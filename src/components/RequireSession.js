"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

/**
 * Client-side second layer of route protection (pairs with proxy.js).
 * Rule: NEVER redirect while the session is still pending, so a logged-in
 * user reloading a private route never lands on /login (spec requirement).
 */
export default function RequireSession({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  const ready = !isPending;
  const loggedIn = Boolean(session?.user);

  useEffect(() => {
    if (ready && !loggedIn) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [ready, loggedIn, pathname, router]);

  if (isPending || !loggedIn) {
    return (
      <div className="container-x pt-40 pb-32 text-center">
        <span
          className="inline-block h-12 w-12 animate-spin rounded-full border-2 border-base-content/15 border-t-[#e79b23]"
          aria-hidden="true"
        />
        <p className="mt-5 text-sm text-muted">
          {isPending ? "Checking your session…" : "Taking you to login…"}
        </p>
      </div>
    );
  }

  return children;
}
