import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Talby handles your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between max-w-3xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-lg accent-fill grid place-items-center text-xs font-bold">T</span>
          <span className="font-display font-semibold text-lg tracking-tight">Talby</span>
        </Link>
        <Link href="/signup" className="text-sm font-semibold px-4 h-9 inline-flex items-center rounded-lg accent-fill">Sign up</Link>
      </header>
      <main className="px-6 py-10 max-w-3xl mx-auto w-full flex-1 space-y-5">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>

        <p className="text-sm text-muted leading-relaxed">
          This policy describes how Talby collects, uses, and protects your information.
        </p>

        <section className="space-y-2">
          <h2 className="font-semibold">Information we collect</h2>
          <p className="text-muted text-sm leading-relaxed">
            When you create an account we collect your email address and a password (securely hashed).
            You may optionally provide a creator handle. As you use the app, we store the deals, payments,
            content, notes, to-dos, and ideas you create. All of this data belongs to you and is private to
            your account.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">How we use it</h2>
          <p className="text-muted text-sm leading-relaxed">
            We use your data solely to provide and improve the service: to keep you signed in, store your
            content, process payments via Stripe, and support your account. We do not sell, rent, or share
            your personal data with third parties for their own purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Payments</h2>
          <p className="text-muted text-sm leading-relaxed">
            Paid subscriptions are processed by Stripe. We never store your full card details; Stripe handles
            all payment information under its own privacy policy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Security</h2>
          <p className="text-muted text-sm leading-relaxed">
            Your data is protected using row-level security and encrypted in transit. Each account can only
            access its own data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Your choices &amp; deletion</h2>
          <p className="text-muted text-sm leading-relaxed">
            You can delete your account and all associated data at any time by contacting us. We&apos;ll
            remove your data within 30 days of a verified request.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Contact</h2>
          <p className="text-muted text-sm leading-relaxed">
            Privacy questions: privacy@talby.app
          </p>
        </section>
      </main>
    </div>
  );
}
