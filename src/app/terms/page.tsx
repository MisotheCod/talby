import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of Talby.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between max-w-3xl mx-auto w-full">
        <TalbyBrand />
        <Link href="/signup" className="text-sm font-semibold px-4 h-9 inline-flex items-center rounded-lg accent-fill">Sign up</Link>
      </header>
      <main className="px-6 py-10 max-w-3xl mx-auto w-full flex-1 prose-sm space-y-5">
        <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>

        <section className="space-y-2">
          <h2 className="font-semibold">1. The service</h2>
          <p className="text-muted text-sm leading-relaxed">
            Talby provides a command center for creators to track brand deals, payments, and content.
            By creating an account or using the service, you agree to these terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">2. Your account</h2>
          <p className="text-muted text-sm leading-relaxed">
            You are responsible for safeguarding your account credentials and for all activity under your
            account. You must provide accurate information and keep it up to date. Your data is private to you.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">3. Your content</h2>
          <p className="text-muted text-sm leading-relaxed">
            You retain ownership of the data you enter into Talby. You grant us the limited right to store,
            process, and display that data solely to provide the service to you. We do not sell your data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">4. Subscriptions &amp; billing</h2>
          <p className="text-muted text-sm leading-relaxed">
            The service is free with optional paid plans. Payments are processed by Stripe. You can cancel
            anytime; access continues until the end of the billing period. Fees are non-refundable except
            where required by law.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">5. Acceptable use</h2>
          <p className="text-muted text-sm leading-relaxed">
            You agree not to misuse the service, attempt unauthorized access, interfere with other users&apos;
            accounts, or use the service for any unlawful purpose.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">6. Disclaimers &amp; liability</h2>
          <p className="text-muted text-sm leading-relaxed">
            The service is provided &quot;as is&quot; without warranties of any kind. To the maximum extent
            permitted by law, Talby is not liable for indirect, incidental, or consequential damages.
            Our total liability is limited to the amount you paid us in the prior twelve months.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">7. Changes</h2>
          <p className="text-muted text-sm leading-relaxed">
            We may update these terms from time to time. Material changes will be communicated. Continued use
            of the service after changes constitutes acceptance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">8. Contact</h2>
          <p className="text-muted text-sm leading-relaxed">
            Questions about these terms: support@talby.app
          </p>
        </section>
      </main>
    </div>
  );
}
