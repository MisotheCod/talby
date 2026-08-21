import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { accentVars, parseHSL, DEFAULT_HSL, DEFAULT_MODE, type ThemeMode } from "@/lib/accent";
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

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  // A signed-in visitor (e.g. reaching #pricing from an in-app upgrade prompt) sees their
  // own saved accent re-tinted across the page, including the Unlimited pricing card. The
  // accent + on-accent tokens live on :root, so applying them here re-tints the card.
  let accentCss = "";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const p = await supabase.from("profiles").select("accent, theme_mode").eq("id", user.id).single();
      const mode: ThemeMode = (p.data as { theme_mode?: string } | null)?.theme_mode === "dark" ? "dark" : DEFAULT_MODE;
      accentCss = accentVars(parseHSL((p.data as { accent?: string } | null)?.accent) ?? DEFAULT_HSL, mode);
    }
  } catch {
    // signed-out or server error: defer to globals.css defaults
  }

  return (
    <>
      {accentCss && <style>{`:root{${accentCss}}`}</style>}
      <MarketingPage />
    </>
  );
}