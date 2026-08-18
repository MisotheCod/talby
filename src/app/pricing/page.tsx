import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";
import { GoUnlimitedButton } from "@/components/marketing/go-unlimited-button";
import { IconCheck } from "@/components/icons";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Talby is free. Upgrade only if you need more than 5 active deals.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <TalbyBrand />
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground">Log in</Link>
          <Link href="/signup" className="text-sm font-semibold px-4 h-9 inline-flex items-center rounded-lg accent-fill">Sign up</Link>
        </div>
      </header>

      <main className="px-6 py-12 max-w-5xl mx-auto w-full flex-1">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold tracking-tight">Simple, honest pricing</h1>
          <p className="text-muted mt-3 max-w-xl mx-auto">
            The complete app is free. The only upgrade is dealing with more active deals at once.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div className="card p-7 flex flex-col">
            <h2 className="text-lg font-semibold">Free</h2>
            <p className="text-sm text-muted mt-1">For trying it out and small workloads.</p>
            <div className="mt-4">
              <span className="text-4xl font-semibold">$0</span>
              <span className="text-muted">/month forever</span>
            </div>
            <ul className="mt-6 space-y-2.5 text-sm flex-1">
              <Feature>Deals + detail drawer</Feature>
              <Feature>Content calendar with recurring scheduling</Feature>
              <Feature>Ideas, notes &amp; to-dos</Feature>
              <Feature>Full payment timeline</Feature>
              <Feature>Live theming</Feature>
              <Feature className="text-muted"><span className="line-through">More than 5 active deals</span> — up to 5 active</Feature>
              <Feature className="text-muted line-through">File uploads</Feature>
            </ul>
            <Link href="/signup" className="mt-8 block text-center px-6 h-12 rounded-lg border border-border bg-surface font-semibold inline-flex items-center justify-center">
              Start free
            </Link>
          </div>

          {/* Paid */}
          <div className="rounded-2xl bg-ink text-canvas p-7 flex flex-col" style={{ background: "var(--ink)", color: "var(--canvas)" }}>
            <span className="inline-flex self-start px-2.5 py-1 rounded-full accent-fill text-xs font-semibold mb-3">Most popular</span>
            <h2 className="text-lg font-semibold">Unlimited</h2>
            <p className="text-sm opacity-70 mt-1">For creators with a growing pipeline.</p>
            <div className="mt-4">
              <span className="text-4xl font-semibold">$9</span>
              <span className="opacity-60">/month</span>
            </div>
            <ul className="mt-6 space-y-2.5 text-sm flex-1">
              <Feature dark>Everything in Free</Feature>
              <Feature dark>Unlimited active deals</Feature>
              <Feature dark>File &amp; attachment uploads</Feature>
              <Feature dark>Priority support</Feature>
            </ul>
            <GoUnlimitedButton />
          </div>
        </div>

        <p className="text-center text-xs text-muted mt-8">
          Cancel anytime. Archived and completed deals never count toward your active-deal limit.
        </p>
      </main>

      <footer className="border-t border-border px-6 py-8">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <span className="text-sm text-muted">Talby</span>
          <div className="flex gap-6 text-sm text-muted">
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ children, dark = false, className = "" }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <li className={`flex items-start gap-2.5 ${className}`}>
      <span className={`h-5 w-5 rounded-full grid place-items-center shrink-0 mt-0.5 ${dark ? "bg-white/10" : "accent-soft"} ${className.includes("line-through") ? "opacity-50" : ""}`}>
        <IconCheck size={12} className={dark ? "text-canvas" : ""} />
      </span>
      <span>{children}</span>
    </li>
  );
}
