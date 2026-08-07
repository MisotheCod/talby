"use client";

/**
 * DashboardPreview — a fake, static mockup of the Talby dashboard used
 * during onboarding theme selection. It re-tints live as the user hovers
 * / selects accent colors, so "which color suits you?" is concrete.
 *
 * It uses the same accent CSS vars (--accent, --accent-tint, --accent-ink,
 * --on-accent, --brand) as the real app, so it reacts to applyAccent().
 */
export function DashboardPreview() {
  return (
    <div
      className="bg-canvas border border-line rounded-2xl overflow-hidden shadow-card flex"
      aria-hidden
    >
      {/* Fake sidebar */}
      <div className="w-[150px] bg-rail border-r border-line p-3 flex flex-col gap-1.5 flex-none">
        <div className="flex items-center gap-1.5 pb-2">
          <span className="sb-mark" />
          <span className="font-bold text-sm tracking-tight">Talby</span>
        </div>
        <div className="flex items-center gap-1.5 pb-2 border-b border-line">
          <span className="h-5 w-5 rounded-md accent-tint-bg accent-ink flex items-center justify-center text-[10px] font-bold">C</span>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold leading-tight text-ink">Creator</div>
          </div>
        </div>
        {/* Active nav item re-tints */}
        <PreviewNav active label="Overview" />
        <PreviewNav label="Deals" />
        <PreviewNav label="Calendar" />
        <PreviewNav label="Payments" />
        {/* Theme dot */}
        <div className="mt-auto flex items-center gap-1.5 px-1 text-[9px] text-inkfaint">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--accent)" }} />
          Theme
        </div>
      </div>

      {/* Fake main */}
      <div className="flex-1 p-3 space-y-2 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-[13px] font-semibold text-ink">Good afternoon, Creator</div>
            <div className="text-[9px] text-inkfaint">You&apos;ve got $2,500 coming in.</div>
          </div>
          {/* Primary button re-tints */}
          <span className="accent-fill text-[10px] font-semibold px-2.5 py-1.5 rounded-lg">Add deal</span>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-4 gap-1.5">
          <FakeStat label="Booked" value="$8,400" compact />
          <FakeStat label="Paid" value="$5,150" color="var(--paid)" compact />
          <FakeStat label="Outstanding" value="$3,250" color="var(--due)" compact />
          {/* Capacity card re-tints */}
          <div className="accent-tint-bg border border-line rounded-xl p-1.5 min-w-0" style={{ borderColor: "var(--accent-tint-2)" }}>
            <div className="text-[7px] font-semibold uppercase tracking-wide text-inkfaint truncate">Capacity</div>
            <div className="text-[13px] font-bold accent-ink money mt-0.5 leading-none">3/5</div>
            <div className="h-1 rounded-full mt-1 overflow-hidden" style={{ background: "rgba(255,255,255,0.6)" }}>
              <div className="h-full rounded-full" style={{ width: "60%", background: "var(--accent)" }} />
            </div>
          </div>
        </div>

        {/* Deal row */}
        <div className="bg-card border border-line rounded-xl px-2 py-1.5 flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-card2 border border-line text-[8px] font-bold text-inksoft grid place-items-center">G</span>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold text-ink truncate">Glow Ritual</div>
            <div className="text-[8px] text-inkfaint">1 Reel + 2 Stories · due Aug 12</div>
          </div>
          <div className="text-right">
            <div className="money text-[10px] font-medium text-ink">$1,800</div>
            {/* Status pill re-tints */}
            <span className="accent-soft text-[8px] font-semibold px-1.5 py-0.5 rounded-full">Active</span>
          </div>
        </div>

        {/* Week strip */}
        <div className="grid grid-cols-7 gap-1 pt-0.5">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
            <div key={d} className={i === 2 ? "accent-tint-bg rounded-md text-center py-0.5" : "text-center py-0.5"}>
              <div className="text-[7px] uppercase text-inkfaint">{d}</div>
              <div className={i === 2 ? "text-[10px] font-semibold accent-ink" : "text-[10px] font-semibold text-ink"}>{4 + i}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PreviewNav({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div className={`px-2 py-1 rounded-md text-[10px] font-medium ${active ? "accent-tint-bg accent-ink font-semibold" : "text-inksoft"}`}>
      {label}
    </div>
  );
}

function FakeStat({ label, value, color, compact = false }: { label: string; value: string; color?: string; compact?: boolean }) {
  return (
    <div className="bg-card border border-line rounded-xl p-1.5 min-w-0">
      <div className="text-[7px] font-semibold uppercase tracking-wide text-inkfaint truncate">{label}</div>
      <div className={compact ? "text-[13px] font-bold text-ink money leading-none mt-0.5 truncate" : "text-[15px] font-bold text-ink money"} style={color ? { color } : undefined}>{value}</div>
    </div>
  );
}
