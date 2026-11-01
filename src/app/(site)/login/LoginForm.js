"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

const field =
  "h-12 w-full rounded-xl border border-base-content/15 bg-base-200/40 px-4 text-sm text-base-content outline-none transition-colors placeholder:text-faint focus:border-[#e79b23] focus:bg-base-100";

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
      className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-base-content/15 text-sm font-medium transition-colors hover:bg-base-content/5 disabled:opacity-60"
    >
      <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
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
    <div className="mx-auto w-full max-w-sm">
      <p className="eyebrow mb-3 text-primary">Welcome back</p>
      <h1 className="display text-3xl">Log in to book.</h1>
      <p className="mt-3 text-[13px] leading-relaxed text-muted">
        Pick up where you left off — book studios in Dhaka, host your own space
        and manage every session in one place.
      </p>

      <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
        <div>
          <label
            className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-faint"
            htmlFor="login-email"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@studio.com.bd"
            className={field}
          />
        </div>

        <div>
          <label
            className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-faint"
            htmlFor="login-password"
          >
            Password
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
              className={`${field} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-base-content/5"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {inlineError && (
          <p
            role="alert"
            className="rounded-lg border border-error/25 bg-error/10 px-3.5 py-2 text-[13px] font-medium text-error"
          >
            {inlineError}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral text-sm font-medium text-neutral-content transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {busy ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <>
              Log in <ArrowRight size={15} />
            </>
          )}
        </button>

        <p className="text-center text-[11px] leading-relaxed text-faint">
          Forgot password? Reach out at support@studiospace.dev — recovery is not
          enabled in this build.
        </p>
      </form>

      <div className="my-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-faint">
        <span className="h-px flex-1 bg-base-content/10" /> or{" "}
        <span className="h-px flex-1 bg-base-content/10" />
      </div>

      <GoogleButton label="Continue with Google" />

      <p className="mt-6 text-center text-[13px] text-muted">
        New to StudioSpace?{" "}
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
