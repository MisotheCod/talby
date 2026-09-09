import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";

export const metadata: Metadata = {
  title: "Account deleted",
  description: "Your Talby account has been deleted.",
  alternates: { canonical: "/deleted" },
  robots: { index: false, follow: false },
};

/** Post-deletion confirmation page. Reachable after account deletion signs the user out. */
export default function DeletedPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between max-w-3xl mx-auto w-full">
        <TalbyBrand />
        <Link href="/signup" className="text-sm font-semibold px-4 h-9 inline-flex items-center rounded-lg accent-fill">Sign up again</Link>
      </header>
      <main className="px-6 py-16 max-w-3xl mx-auto w-full flex-1 text-center space-y-5">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-latebg text-late grid place-items-center text-3xl">✓</div>
        <h1 className="text-3xl font-semibold tracking-tight">Your account has been deleted.</h1>
        <p className="text-sm text-muted leading-relaxed max-w-xl mx-auto">
          Your data is gone and your subscription has been cancelled — you won&apos;t be billed again.
          We&apos;re sorry to see you go. If this was a mistake, you&apos;re welcome to start fresh.
        </p>
        <Link href="/signup" className="inline-flex items-center h-11 px-5 rounded-xl accent-fill text-sm font-semibold">
          Create a new account
        </Link>
        <p className="text-xs text-muted mt-2">
          <Link href="/" className="underline">Back to Talby home</Link>
        </p>
      </main>
    </div>
  );
}