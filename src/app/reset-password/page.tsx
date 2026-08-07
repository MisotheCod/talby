import type { Metadata } from "next";
import { ResetForm } from "./reset-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new Talby password.",
  alternates: { canonical: "/reset-password" },
};

export default function ResetPasswordPage() {
  return <ResetForm />;
}
