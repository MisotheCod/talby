import type { Metadata } from "next";
import { MarketingPage } from "@/components/marketing/marketing-page";

export const metadata: Metadata = {
  title: "Talby: your favorite way to run brand deals",
  description:
    "Talby tracks every deal: what's owed, what's paid, what's due. No Notion setup you never finish.",
};

export default function LandingPage() {
  return <MarketingPage />;
}
