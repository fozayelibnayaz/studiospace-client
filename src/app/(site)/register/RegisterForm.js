"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Aperture, Eye, EyeOff, Check, X } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

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
    <button type="button" onClick={start} disabled={busy} className="btn btn-outline w-full gap-3">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
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
    <div className="card bg-base-100 border border-base-300 w-full max-w-md mx-auto shadow-md">
      <div className="card-body gap-5">
        <div className="text-center">
          <span className="inline-grid place-items-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-3">
            <Aperture size={26} />
          </span>
          <h1 className="font-heading text-2xl font-bold">Join StudioSpace</h1>
          <p className="text-sm text-base-content/60 mt-1">
            One account to book studios across Bangladesh and host your own room.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="form-control">
            <label className="label pb-1" htmlFor="reg-name">
              <span className="label-text text-sm font-medium">Name</span>
            </label>
            <input
              id="reg-name"
              type="text"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={onChange}
              placeholder="Ayesha Karim"
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label pb-1" htmlFor="reg-email">
              <span className="label-text text-sm font-medium">Email</span>
            </label>
            <input
              id="reg-email"
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
            <label className="label pb-1" htmlFor="reg-image">
              <span className="label-text text-sm font-medium">
                Photo URL <span className="text-base-content/40">(optional)</span>
              </span>
            </label>
            <input
              id="reg-image"
              type="url"
              name="image"
              value={form.image}
              onChange={onChange}
              placeholder="https://i.ibb.co/your-avatar.jpg"
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label pb-1" htmlFor="reg-password">
              <span className="label-text text-sm font-medium">Password</span>
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

          {/* Live password checklist — registration is blocked until all pass */}
          <ul className="space-y-1.5 text-xs">
            {RULES.map((r) => {
              const ok = r.test(form.password);
              return (
                <li
                  key={r.label}
                  className={`flex items-center gap-1.5 ${ok ? "text-success" : "text-base-content/50"}`}
                >
                  {ok ? <Check size={13} /> : <X size={13} />}
                  {r.label}
                </li>
              );
            })}
          </ul>

          {inlineError && (
            <p role="alert" className="text-sm text-error font-medium">
              {inlineError}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn btn-primary w-full">
            {busy ? <span className="loading loading-spinner" /> : "Register"}
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs text-base-content/40">
          <span className="flex-1 h-px bg-base-300" /> OR{" "}
          <span className="flex-1 h-px bg-base-300" />
        </div>

        <GoogleButton />

        <p className="text-sm text-center text-base-content/65">
          Already have an account?{" "}
          <Link
            href="/login"
            className="link link-primary font-medium no-underline hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
