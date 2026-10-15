"use client";

/**
 * Appearance — SAppearance (spec 01 §2.12 / spec 05). Dialog with the five
 * theme tiles (each mini-previewed in its own light/dark), a Light / Dark /
 * System mode switch, and the sidebar expanded/icons choice. Every click
 * applies + persists live via useTheme (no Save button).
 */

import { useTheme } from "@/components/theme-provider";
import { THEME_IDS, TH, talby, type ThemeId, type Mode } from "@/lib/theme/talby-themes";

const VIBE: Record<string, string> = {
  studio: "Clean and simple",
  sand: "Warm and soft",
  mac: "Calm and crisp",
  stationery: "Paper and ink",
  editorial: "Sharp and bold",
};

function ThemeTile({ id, active, dark, onPick }: { id: ThemeId; active: boolean; dark: boolean; onPick: () => void }) {
  const t = talby(id, dark);
  const raw = (TH as Record<string, { name?: string }>)[id]?.name ?? id;
  const name = raw.charAt(0).toUpperCase() + raw.slice(1);
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onPick}
      className="tb tc flex flex-col gap-2 rounded-[var(--t-r-tile)] border p-2.5 text-left"
      style={{ borderColor: active ? "var(--t-primary)" : "var(--t-border)", background: "var(--t-card)" }}
    >
      <span className="flex h-16 w-full overflow-hidden rounded-[8px] border" style={{ borderColor: t.border, background: t.page }}>
        <span className="flex w-1/4 flex-col gap-1 p-1.5" style={{ background: t.side }}>
          <span className="h-1.5 w-full rounded-full" style={{ background: t.navOn }} />
          <span className="h-1.5 w-3/4 rounded-full" style={{ background: t.border }} />
          <span className="h-1.5 w-2/3 rounded-full" style={{ background: t.border }} />
        </span>
        <span className="flex flex-1 flex-col gap-1.5 p-2">
          <span className="h-2 w-1/2 rounded-full" style={{ background: t.fg, opacity: 0.85 }} />
          <span className="flex-1 rounded-[6px] border" style={{ borderColor: t.border, background: t.card }} />
          <span className="h-2.5 w-10 rounded-full" style={{ background: t.primary }} />
        </span>
      </span>
      <span className="flex items-center justify-between gap-2">
        <span className="min-w-0">
          <span className="block text-[13px] font-medium">{name}</span>
          <span className="block text-[11px] text-[color:var(--t-muted-fg)]">{VIBE[id]}</span>
        </span>
        {active && (
          <span className="grid size-4 shrink-0 place-items-center rounded-full" style={{ background: "var(--t-primary)", color: "var(--t-primary-fg)" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </span>
        )}
      </span>
    </button>
  );
}

export function AppearanceDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { look, dark, setTheme, setMode, toggleSidebar } = useTheme();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[85] grid place-items-center px-4" style={{ background: "var(--t-overlay)" }} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Appearance"
        className="a-pop flex w-full max-w-[560px] flex-col overflow-hidden rounded-[var(--t-r-dialog)] border"
        style={{ background: "var(--t-card)", color: "var(--t-fg)", borderColor: "var(--t-border)", boxShadow: "var(--t-sh-pop)", maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center gap-2 px-4 py-3.5" style={{ borderBottom: "1px solid var(--t-line)" }}>
          <h2 className="text-[15px] font-semibold">Appearance</h2>
          <span className="flex-1" />
          <button type="button" aria-label="Close" onClick={onClose}
            className="tb tg inline-flex size-8 items-center justify-center rounded-[var(--t-r-ctl)] text-[color:var(--t-fg)]"
            style={{ ["--hv" as string]: "var(--t-hv)" } as React.CSSProperties}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="flex flex-col gap-5 overflow-y-auto p-4">
          <section className="flex flex-col gap-2.5">
            <p className="text-xs font-medium tracking-wide text-[color:var(--t-muted-fg)] uppercase">Theme</p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {THEME_IDS.map((id) => (
                <ThemeTile key={id} id={id} active={look.theme === id} dark={dark} onPick={() => setTheme(id)} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-2.5">
            <p className="text-xs font-medium tracking-wide text-[color:var(--t-muted-fg)] uppercase">Mode</p>
            <div className="inline-flex h-9 items-center gap-0.5 rounded-[var(--t-r-ctl)] p-[3px]" style={{ background: "var(--t-fill)" }}>
              {(["light", "dark", "system"] as Mode[]).map((m) => (
                <button key={m} type="button" aria-pressed={look.mode === m} onClick={() => setMode(m)}
                  className="tb tt inline-flex h-full flex-1 items-center justify-center rounded-[var(--t-r-ctl)] px-3 text-[13px] font-medium capitalize"
                  style={{ background: look.mode === m ? "var(--t-tab-on)" : "transparent", color: look.mode === m ? "var(--t-fg)" : "var(--t-muted-fg)", boxShadow: look.mode === m ? "var(--t-tab-sh)" : "none" }}>
                  {m}
                </button>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-2.5">
            <p className="text-xs font-medium tracking-wide text-[color:var(--t-muted-fg)] uppercase">Sidebar</p>
            <div className="inline-flex h-9 items-center gap-0.5 rounded-[var(--t-r-ctl)] p-[3px]" style={{ background: "var(--t-fill)" }}>
              {(["expanded", "icons"] as const).map((s) => (
                <button key={s} type="button" aria-pressed={look.sidebar === s} onClick={() => { if (look.sidebar !== s) toggleSidebar(); }}
                  className="tb tt inline-flex h-full flex-1 items-center justify-center rounded-[var(--t-r-ctl)] px-3 text-[13px] font-medium capitalize"
                  style={{ background: look.sidebar === s ? "var(--t-tab-on)" : "transparent", color: look.sidebar === s ? "var(--t-fg)" : "var(--t-muted-fg)", boxShadow: look.sidebar === s ? "var(--t-tab-sh)" : "none" }}>
                  {s === "expanded" ? "Expanded" : "Icons only"}
                </button>
              ))}
            </div>
          </section>
        </div>

        <footer className="flex items-center justify-between gap-2 px-4 py-3" style={{ borderTop: "1px solid var(--t-line)" }}>
          <span className="text-xs text-[color:var(--t-muted-fg)]">Saved to your account</span>
          <button type="button" onClick={onClose}
            className="tb inline-flex h-8 items-center rounded-[var(--t-r-ctl)] border-0 px-3.5 text-sm font-medium hover:opacity-[.88]"
            style={{ background: "var(--t-primary)", color: "var(--t-primary-fg)" }}>
            Done
          </button>
        </footer>
      </div>
    </div>
  );
}
