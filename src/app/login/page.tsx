import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "./auth-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to Talby — your brand deal command center.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-full flex items-center justify-center">
          <div className="skeleton h-8 w-40" />
        </div>
      }
    >
      <AuthForm mode="login" />
    </Suspense>
  );
}
