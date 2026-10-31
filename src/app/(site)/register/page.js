import { Suspense } from "react";

import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "Register",
  description:
    "Create your StudioSpace account to book creative workspaces or host your own studio.",
};

export default function RegisterPage() {
  return (
    <div className="section-pad px-4 bg-base-200/40">
      <Suspense
        fallback={
          <div className="w-full max-w-md mx-auto card bg-base-100 border border-base-300 shadow-md h-[28rem]">
            <div className="card-body justify-center gap-4">
              <div className="skeleton h-10 w-44 mx-auto self-center" />
              <div className="skeleton h-5 w-64" />
              <div className="skeleton h-12 w-full" />
              <div className="skeleton h-12 w-full" />
              <div className="skeleton h-12 w-full" />
            </div>
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
