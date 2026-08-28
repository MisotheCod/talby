import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Talby handles your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between max-w-3xl mx-auto w-full">
        <TalbyBrand />
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
          <h2 className="font-semibold">Talby Assistant (AI)</h2>
          <p className="text-muted text-sm leading-relaxed">
            On the paid plan, Talby Assistant answers your questions about your own deals, payments, content,
            and contracts. To do so, it sends the specific data relevant to your question &mdash; for example a
            deal&apos;s terms or the text of one of your uploaded contracts &mdash; along with your question to an
            AI provider for processing. This happens only when you ask something, and only so the assistant can
            answer you.
          </p>
          <p className="text-muted text-sm leading-relaxed">
            Your data is <strong>never used to train</strong> the AI model, and we instruct the provider to route
            requests only to hosts that retain no data and do not use your input for training. Talby Assistant is
            isolated per account: it can only read the signed-in user&apos;s own data, and your data is never
            shared with other users.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Email forwarding for brand-deal detection</h2>
          <p className="text-muted text-sm leading-relaxed">
            On the paid plan you can forward brand-deal outreach emails to a unique Talby address. Talby
            analyzes the forwarded message to identify genuine brand-deal opportunities (such as paid
            partnerships, UGC, product seeding, or affiliate offers) and to extract the contact and deal
            details so you can add them as deals. We keep the original email and any attachments only long
            enough to extract what you need (a rolling window we hold for support and review), and the
            extracted deal is stored to your account.
          </p>
          <p className="text-muted text-sm leading-relaxed">
            <strong>Payment reminders:</strong> Talby drafts payment-follow-up emails on your behalf using
            your templates, so you can copy them or open them in your own email app. Talby does not send
            email directly; only you can send a reminder, from your own mailbox. We store the drafted text
            until you act on it or dismiss it.
          </p>
          <p className="text-muted text-sm leading-relaxed">
            We never sell your email data. Access is used only for the purposes described here and you can
            remove forwarded deals, their source messages, and any drafted reminders at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Security</h2>
          <p className="text-muted text-sm leading-relaxed">
            Your data is protected using row-level security and encrypted in transit. Each account can only
            access its own data. OAuth tokens are stored server-side, encrypted, and never exposed to your
            browser or to other users.
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
