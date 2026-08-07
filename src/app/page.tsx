import Link from "next/link";
import { IconArrowRight, IconCheck } from "@/components/icons";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Nav */}
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-lg accent-fill grid place-items-center text-xs font-bold">T</span>
          <span className="font-display font-semibold text-lg tracking-tight">Talby</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
          <Link href="/#features" className="hover:text-foreground">Features</Link>
          <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground">Log in</Link>
          <Link href="/signup" className="text-sm font-semibold px-4 h-9 inline-flex items-center rounded-lg accent-fill">Sign up</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-16 pb-20 text-center max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-xs text-muted mb-6">
          Built for creators drowning in Notion
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
          Brand deals &amp; money,
          <br />
          in one calm place.
        </h1>
        <p className="text-muted mt-5 text-lg max-w-2xl mx-auto">
          Talby is a simpler, friendlier command center for creators — track your
          deals, payments, and content without the Notion chaos.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Link href="/signup" className="inline-flex items-center gap-2 px-6 h-12 rounded-lg accent-fill font-semibold text-base">
            Start free <IconArrowRight size={18} />
          </Link>
          <Link href="/login" className="inline-flex items-center px-6 h-12 rounded-lg border border-border bg-surface font-semibold text-base">
            Log in
          </Link>
        </div>
        <p className="text-xs text-muted mt-4">Free forever for up to 5 active deals. No credit card.</p>
      </section>

      {/* Feature highlights */}
      <section id="features" className="px-6 py-14 max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-3 gap-5">
          <FeatureCard title="Money at a glance" desc="Booked, paid, and outstanding — plus past-due alerts, all in one row." icon="money" />
          <FeatureCard title="Calm content calendar" desc="Plan posts and deliverables by day, set recurring schedules, drag to reschedule." icon="calendar" />
          <FeatureCard title="Deals, fully tracked" desc="Every deal with its checklist, notes, files, and payments in a clean detail view." icon="deal" />
        </div>
      </section>

      {/* Theming highlight */}
      <section className="px-6 py-14 max-w-6xl mx-auto w-full">
        <div className="rounded-2xl bg-dark text-white p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Make it feel like yours</h2>
            <p className="text-white/70 mt-3">
              Pick a preset or drag across a live palette. Talby recolors the accents —
              never your readability.
            </p>
            <div className="flex gap-2 mt-5">
              {["#ff6f42", "#2f6fed", "#3c9d64", "#7c5ce0", "#e34f8f", "#e8a012"].map((c) => (
                <span key={c} className="h-8 w-8 rounded-full" style={{ background: c }} />
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <CheckLine>Active nav, buttons &amp; pills</CheckLine>
            <CheckLine>Status highlights &amp; rings</CheckLine>
            <CheckLine>Text &amp; surfaces stay neutral</CheckLine>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="px-6 py-14 max-w-4xl mx-auto w-full text-center">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Simple pricing</h2>
        <p className="text-muted mt-3 max-w-xl mx-auto">
          The whole app is free. Upgrade only if you need more than 5 active deals at once.
        </p>
        <Link href="/pricing" className="inline-flex items-center gap-2 mt-6 accent-text font-semibold">
          See pricing <IconArrowRight size={16} />
        </Link>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Stop juggling spreadsheets</h2>
        <p className="text-muted mt-3">Set up your command center in under a minute.</p>
        <Link href="/signup" className="inline-flex items-center gap-2 px-8 h-12 rounded-lg accent-fill font-semibold mt-6">
          Create your free account <IconArrowRight size={18} />
        </Link>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="card p-6 flex flex-col gap-3">
      <span className="h-11 w-11 rounded-xl accent-soft grid place-items-center text-lg">
        {icon === "money" ? "$" : icon === "calendar" ? "▦" : "◈"}
      </span>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted text-sm flex-1">{desc}</p>
      <Link href="/signup" className="inline-flex items-center gap-1 text-sm accent-text font-medium">
        Learn more <IconArrowRight size={14} />
      </Link>
    </div>
  );
}

function CheckLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-6 w-6 rounded-full bg-white/10 grid place-items-center"><IconCheck size={14} /></span>
      <span className="text-sm text-white/90">{children}</span>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10 mt-auto">
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-start justify-between gap-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-md accent-fill grid place-items-center text-[10px] font-bold">T</span>
            <span className="font-semibold">Talby</span>
          </div>
          <p className="text-sm text-muted mt-3 max-w-xs">
            The calm command center for creators tracking brand deals and money.
          </p>
        </div>
        <div className="flex gap-12">
          <div className="space-y-2 text-sm">
            <div className="font-semibold mb-1">Product</div>
            <Link href="/#features" className="block text-muted hover:text-foreground">Features</Link>
            <Link href="/pricing" className="block text-muted hover:text-foreground">Pricing</Link>
            <Link href="/signup" className="block text-muted hover:text-foreground">Sign up</Link>
          </div>
          <div className="space-y-2 text-sm">
            <div className="font-semibold mb-1">Company</div>
            <Link href="/terms" className="block text-muted hover:text-foreground">Terms</Link>
            <Link href="/privacy" className="block text-muted hover:text-foreground">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
