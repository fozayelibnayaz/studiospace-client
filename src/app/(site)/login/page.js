import { Suspense } from "react";

import LoginForm from "./LoginForm";
import AuthShell from "@/components/AuthShell";

export const metadata = {
  title: "Login",
  description:
    "Log in to StudioSpace to book creative workspaces or host your own.",
};

export default function LoginPage() {
  return (
    <AuthShell
      image="/studios/dhanmondi-loft.jpg"
      eyebrow="Back on set"
      quote="“We shot three lookbooks in one day because every room was on the same calendar.”"
      byline="Nusrat Jahan · producer, Dhaka"
    >
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-sm space-y-4">
            <div className="skeleton h-3 w-24 rounded-full" />
            <div className="skeleton h-9 w-56 rounded-md" />
            <div className="skeleton h-4 w-full rounded-md" />
            <div className="skeleton h-12 w-full rounded-xl" />
            <div className="skeleton h-12 w-full rounded-xl" />
            <div className="skeleton h-12 w-full rounded-full" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
