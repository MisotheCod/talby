import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/app/login/auth-form";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your free Talby account — track brand deals and money in one calm place.",
  alternates: { canonical: "/signup" },
};

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-full flex items-center justify-center">
          <div className="skeleton h-8 w-40" />
        </div>
      }
    >
      <AuthForm mode="signup" />
    </Suspense>
  );
}
