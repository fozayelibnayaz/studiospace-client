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

  if (isPending) {
    return (
      <div className="section-pad px-4 max-w-7xl mx-auto text-center">
        <span className="loading loading-infinity text-primary w-16" style={{ borderTopWidth: 2 }} />
        <p className="mt-4 text-sm text-base-content/55">Checking your session…</p>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="section-pad px-4 max-w-7xl mx-auto text-center">
        <span className="loading loading-infinity text-primary w-16" style={{ borderTopWidth: 2 }} />
        <p className="mt-4 text-sm text-base-content/55">Redirecting you to login…</p>
      </div>
    );
  }

  return children;
}
