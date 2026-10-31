"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { serverBaseUrl } from "@/lib/constants";

/**
 * Challenge 1 companion — better-auth handles the session, but the Express
 * API needs its own httpOnly "token" cookie for verifyToken. So whenever a
 * new user signs in (email or Google), we POST /jwt once per email.
 * sessionStorage tracks which email has been synced this tab session.
 */
export default function JwtCookieSync() {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    const email = session?.user?.email;
    if (!email) return;

    let synced = null;
    try {
      synced = sessionStorage.getItem("ss-jwt-synced-email");
    } catch {
      /* non-blocking */
    }
    if (synced === email) return;

    fetch(`${serverBaseUrl}/jwt`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then(() => {
        try {
          sessionStorage.setItem("ss-jwt-synced-email", email);
        } catch {
          /* non-blocking */
        }
      })
      .catch(() => {
        /* the API may be unreachable; protected calls will 401 with a toast */
      });
  }, [isPending, session?.user?.email]);

  return null;
}
