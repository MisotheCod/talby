import type { Metadata } from "next";
import { AuthForm } from "@/app/login/auth-form";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your free Talby account — track brand deals and money in one calm place.",
  alternates: { canonical: "/signup" },
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
