"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Aperture, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

function GoogleButton({ label }) {
  const { signIn } = authClient;
  const searchParams = useSearchParams();
  const [busy, setBusy] = useState(false);

  const start = async () => {
    setBusy(true);
    const redirect = searchParams.get("redirect");
    const { error } =
      (await signIn.social({
        provider: "google",
        callbackURL: redirect || "/",
      })) || {};
    if (error) {
      toast.error(error.message || "Google sign-in is not configured yet");
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={start}
      disabled={busy}
      className="btn btn-outline w-full gap-3"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.23c0-.68-.06-1.36-.19-2.02H12v3.83h5.92a5.07 5.07 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.27-4.74 3.27-7.89z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06z" />
      </svg>
      {busy ? "Redirecting to Google…" : label}
    </button>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = authClient;

  const [form, setForm] = useState({ email: "", password: "" });
  const [inlineError, setInlineError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  // Where the user came from → return them there after login
  const redirectTo = searchParams.get("redirect") || "/";

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setInlineError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setInlineError("");
    if (!form.email.trim() || !form.password) {
      setInlineError("Email and password are required.");
      return;
    }
    setBusy(true);
    const { data, error } = (await signIn.email({
      email: form.email.trim(),
      password: form.password,
      rememberMe: true,
    })) || {};

    if (error) {
      toast.error(error.message || "Could not log in");
      setInlineError(error.message || "Could not log in");
      setBusy(false);
      return;
    }
    toast.success(`Welcome back, ${data?.user?.name || form.email}!`);
    router.replace(redirectTo);
    router.refresh();
  };

  return (
    <div className="card bg-base-100 border border-base-300 w-full max-w-md mx-auto shadow-md">
      <div className="card-body gap-5">
        <div className="text-center">
          <span className="inline-grid place-items-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-3">
            <Aperture size={26} />
          </span>
          <h1 className="font-heading text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-base-content/60 mt-1">
            Log in to book studios in Dhaka, host your own space and manage sessions.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="form-control">
            <label className="label pb-1" htmlFor="login-email">
              <span className="label-text text-sm font-medium">Email</span>
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@studio.com.bd"
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label pb-1" htmlFor="login-password">
              <span className="label-text text-sm font-medium">Password</span>
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPw ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={onChange}
                placeholder="Your password"
                className="input input-bordered w-full pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="btn btn-ghost btn-sm btn-square absolute right-1 top-1/2 -translate-y-1/2"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {inlineError && (
            <p role="alert" className="text-sm text-error font-medium">
              {inlineError}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn btn-primary w-full"
          >
            {busy ? <span className="loading loading-spinner" /> : "Login"}
          </button>
          <p className="text-xs text-base-content/50 text-center">
            Forgot password? Reach out at support@studiospace.dev (recovery not
            enabled in this build).
          </p>
        </form>

        <div className="flex items-center gap-3 text-xs text-base-content/40">
          <span className="flex-1 h-px bg-base-300" /> OR{" "}
          <span className="flex-1 h-px bg-base-300" />
        </div>

        <GoogleButton label="Continue with Google" />

        <p className="text-sm text-center text-base-content/65">
          New to StudioSpace?{" "}
          <Link
            href="/register"
            className="link link-primary font-medium no-underline hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
