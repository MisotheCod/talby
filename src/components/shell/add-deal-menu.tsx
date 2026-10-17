"use client";

/**
 * AddDealMenu — STopbar §4.5. New deal / Upload (contract or CSV) / Import
 * from Notion. Anchored under the Add deal button; on phone it is a fixed
 * panel at the top-right. Click outside closes.
 */

import { useEffect, useRef } from "react";

export type AddKind = "new" | "upload" | "notion";

function PlusIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5v14" /></svg>;
}
function UploadIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>;
}

export function AddDealMenu({
  open,
  mob = false,
  onClose,
  onPick,
}: {
  open: boolean;
  mob?: boolean;
  onClose: () => void;
  onPick: (k: AddKind) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, onClose]);

  if (!open) return null;

  const items: { key: AddKind; label: string; sub: string; tile: React.ReactNode; tileStyle: React.CSSProperties }[] = [
    { key: "new", label: "New deal", sub: "Start from scratch", tile: <PlusIcon />, tileStyle: { background: "var(--t-primary)", color: "var(--t-primary-fg)" } },
    { key: "upload", label: "Upload", sub: "Contract or CSV", tile: <UploadIcon />, tileStyle: { background: "var(--t-fill)", color: "var(--t-fg)" } },
    {
      key: "notion", label: "Import from Notion", sub: "Connect and pull deals",
      tile: <span style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700 }}>N</span>,
      tileStyle: { background: "#FFFFFF", border: "1px solid #E5E5E5", color: "#191919" },
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[1]" onMouseDown={onClose} />
      <div
        ref={ref}
        role="menu"
        aria-label="Add a deal"
        className="a-drop absolute z-[2] w-[300px] rounded-[var(--t-r-tile)] p-1.5"
        style={{ top: 42, right: 0, background: "var(--t-card)", color: "var(--t-fg)", border: "1px solid var(--t-border)", boxShadow: "var(--t-sh-pop)", transformOrigin: "top right" }}
      >
        {items.map((it) => (
          <button
            key={it.key}
            type="button"
            role="menuitem"
            onClick={() => { onClose(); onPick(it.key); }}
            className="tb tg flex min-h-14 w-full items-center gap-3 rounded-[var(--t-r-item)] py-2 pl-2 pr-2.5 text-left"
            style={{ ["--hv" as string]: "var(--t-hv)" } as React.CSSProperties}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-[var(--t-r-sm)]" style={it.tileStyle}>{it.tile}</span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="font-medium whitespace-nowrap">{it.label}</span>
              <span className="overflow-hidden text-[13px] text-ellipsis whitespace-nowrap text-[color:var(--t-muted-fg)]">{it.sub}</span>
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
