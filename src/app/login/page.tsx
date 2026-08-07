import type { Metadata } from "next";
import { AuthForm } from "./auth-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to Talby — your brand deal command center.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
