import { Suspense } from "react";

import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login",
  description:
    "Log in to StudioSpace to book creative workspaces or host your own.",
};

export default function LoginPage() {
  return (
    <div className="section-pad px-4 bg-base-200/40">
      <Suspense
        fallback={
          <div className="w-full max-w-md mx-auto card bg-base-100 border border-base-300 shadow-md h-96">
            <div className="card-body justify-center gap-4">
              <div className="skeleton h-10 w-40 mx-auto self-center" />
              <div className="skeleton h-5 w-64" />
              <div className="skeleton h-12 w-full" />
              <div className="skeleton h-12 w-full" />
              <div className="skeleton h-10 w-full" />
            </div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
