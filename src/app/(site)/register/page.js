import { Suspense } from "react";

import RegisterForm from "./RegisterForm";
import AuthShell from "@/components/AuthShell";

export const metadata = {
  title: "Register",
  description:
    "Create your StudioSpace account to book creative workspaces or host your own studio.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      image="/studios/gulshan-glasshouse.jpg"
      eyebrow="For makers & hosts"
      quote="“The room in the photo is the room you book. That should not be a radical idea.”"
      byline="StudioSpace · Dhaka, Bangladesh"
    >
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-sm space-y-4">
            <div className="skeleton h-3 w-28 rounded-full" />
            <div className="skeleton h-9 w-64 rounded-md" />
            <div className="skeleton h-4 w-full rounded-md" />
            <div className="skeleton h-12 w-full rounded-xl" />
            <div className="skeleton h-12 w-full rounded-xl" />
            <div className="skeleton h-12 w-full rounded-xl" />
            <div className="skeleton h-12 w-full rounded-full" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
