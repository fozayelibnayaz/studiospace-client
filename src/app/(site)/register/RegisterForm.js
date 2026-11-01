"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Check, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

const field =
  "h-12 w-full rounded-xl border border-base-content/15 bg-base-200/40 px-4 text-sm text-base-content outline-none transition-colors placeholder:text-faint focus:border-[#e79b23] focus:bg-base-100";

/* Inline password rule feedback — validated BEFORE submit, blocks registration */
const RULES = [
  { label: "At least one UPPERCASE letter", test: (v) => /[A-Z]/.test(v) },
  { label: "At least one lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "Minimum 6 characters", test: (v) => v.length >= 6 },
];

function GoogleButton() {
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
      {busy ? "Redirecting to Google…" : "Sign up with Google"}
    </button>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp } = authClient;

  const [form, setForm] = useState({ name: "", email: "", image: "", password: "" });
  const [inlineError, setInlineError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setInlineError("");
  };

  const invalid = RULES.filter((r) => !r.test(form.password));

  const submit = async (e) => {
    e.preventDefault();
    setInlineError("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setInlineError("Name, email and password are all required.");
      return;
    }
    if (invalid.length > 0) {
      setInlineError("Password does not meet the requirements yet.");
      return;
    }

    setBusy(true);
    const { data, error } = (await signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      image: form.image.trim() || undefined,
      callbackURL: "/",
    })) || {};

    if (error) {
      toast.error(error.message || "Registration failed");
      setInlineError(error.message || "Registration failed");
      setBusy(false);
      return;
    }

    // The account exists; land on Login to sign in for real.
    try {
      await authClient.signOut({ fetchOptions: { throw: false } });
    } catch {
      /* ignore */
    }
    toast.success(
      `Account created for ${data?.user?.name || form.email}. Please log in.`
    );
    router.push("/login");
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <p className="eyebrow mb-3 text-primary">Join StudioSpace</p>
      <h1 className="display text-3xl">Create your account.</h1>
      <p className="mt-3 text-[13px] leading-relaxed text-muted">
        One account to book studios across Bangladesh — and to host your own
        room when you&apos;re ready.
      </p>

      <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
        <div>
          <label
            className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-faint"
            htmlFor="reg-name"
          >
            Full name
          </label>
          <input
            id="reg-name"
            type="text"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={onChange}
            placeholder="Ayesha Karim"
            className={field}
          />
        </div>

        <div>
          <label
            className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-faint"
            htmlFor="reg-email"
          >
            Email
          </label>
          <input
            id="reg-email"
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
            className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-faint"
            htmlFor="reg-image"
          >
            Photo URL
            <span className="font-normal normal-case tracking-normal text-faint">
              optional
            </span>
          </label>
          <input
            id="reg-image"
            type="url"
            name="image"
            value={form.image}
            onChange={onChange}
            placeholder="https://i.ibb.co/your-avatar.jpg"
            className={field}
          />
        </div>

        <div>
          <label
            className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-faint"
            htmlFor="reg-password"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPw ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              value={form.password}
              onChange={onChange}
              placeholder="Create a strong password"
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

        {/* Live password checklist — registration is blocked until all pass */}
        <ul className="space-y-1.5 text-[11.5px]">
          {RULES.map((r) => {
            const ok = r.test(form.password);
            return (
              <li
                key={r.label}
                className={`flex items-center gap-1.5 ${
                  ok ? "text-success" : "text-faint"
                }`}
              >
                <span
                  className={`grid h-4 w-4 place-items-center rounded-full border ${
                    ok
                      ? "border-success/40 bg-success/15"
                      : "border-base-content/20"
                  }`}
                >
                  <Check size={9} className={ok ? "opacity-100" : "opacity-30"} />
                </span>
                {r.label}
              </li>
            );
          })}
        </ul>

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
              Create account <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-faint">
        <span className="h-px flex-1 bg-base-content/10" /> or{" "}
        <span className="h-px flex-1 bg-base-content/10" />
      </div>

      <GoogleButton />

      <p className="mt-6 text-center text-[13px] text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
