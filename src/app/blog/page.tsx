import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Blog",
  description: "Practical guides for creators who run brand deals: tracking, money, contracts, and content.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Talby Blog",
    description: "Practical guides for creators who run brand deals.",
    siteName: "Talby",
    type: "website",
  },
};

export default function BlogIndexPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between max-w-3xl mx-auto w-full">
        <TalbyBrand />
        <Link href="/signup" className="text-sm font-semibold px-4 h-9 inline-flex items-center rounded-lg accent-fill">Free to start</Link>
      </header>
      <main className="px-6 py-10 max-w-3xl mx-auto w-full flex-1">
        <h1 className="text-3xl font-semibold tracking-tight">Talby Blog</h1>
        <p className="text-muted text-base mt-4">Notes for creators who run brand deals. No hype, just the practical stuff.</p>

        <div className="mt-8 space-y-4">
          <article className="bg-card border border-line rounded-xl p-6">
            <h2 className="text-lg font-semibold tracking-tight">
              <Link href="/blog/track-brand-deals-without-a-spreadsheet" className="hover:underline">
                How to track brand deals without a spreadsheet
              </Link>
            </h2>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              What you actually need to track, why the sheet keeps failing, and how a command center keeps the deal, the money, and
              the content together.
            </p>
            <p className="text-xs text-muted mt-3">September 21, 2026</p>
          </article>
        </div>
      </main>
    </div>
  );
}