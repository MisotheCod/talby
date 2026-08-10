import type { Metadata } from "next";
import { MarketingPage } from "@/components/marketing/marketing-page";

export const metadata: Metadata = {
  title: "Talby: your favorite way to run brand deals",
  description:
    "Talby is the command center for creators to organize brand deals, track what's owed and paid, and plan content — including preparing payment-follow-up emails from your own Gmail.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Talby — organize your brand deals",
    description:
      "Talby helps creators track brand deals and payments, plan content, and follow up on invoices from their own Gmail.",
    type: "website",
  },
};

export default function LandingPage() {
  return <MarketingPage />;
}
