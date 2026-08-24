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
          <h2 className="font-semibold">Connected accounts (Google / Gmail)</h2>
          <p className="text-muted text-sm leading-relaxed">
            On the paid plan you may connect your own Google (Gmail) account so Talby can (a) prepare and
            send payment-follow-up emails from your address to your brand contacts, and (b) detect
            brand-deal outreach in your inbox to suggest new deals. If you connect Gmail, we store an
            OAuth access token and refresh token on our servers.
          </p>
          <p className="text-muted text-sm leading-relaxed">
            <strong>Inbox deal detection:</strong> when enabled, Talby scans the subject lines, senders, and
            message bodies of recent messages in your inbox to identify genuine brand-deal outreach (such
            as paid partnerships, UGC, product seeding, or affiliate offers) and to extract the contact and
            deal details so you can add them as deals. We analyse outreach only to recommend deals and to
            fill in their details; we do not use your inbox data for advertising, and we do not share it
            with third parties.
          </p>
          <p className="text-muted text-sm leading-relaxed">
            We never sell your Gmail data. Access is used only for the purposes described here and is fully
            revocable: you can disconnect Gmail from Settings at any time, which deletes the stored tokens
            and stops further inbox scanning.
          </p>
          <p className="text-muted text-sm leading-relaxed">
            Talby&apos;s use and transfer of information received from Google APIs complies with the{" "}
            <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer" className="text-accentink underline">
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements. Restricted scopes (including Gmail read access) are
            used only for the specific, disclosed purpose of deal detection, are never used for
            advertising, and you can revoke this access at any time.
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
