"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, Spinner } from "@/components/ui";
import { IconClose, IconDelete, IconDownload, IconError } from "@/components/icons";

type Counts = {
  deals: number;
  payments: number;
  files: number;
  calendar: number;
  ideas: number;
  todos: number;
  inbox: number;
  notes: number;
};

type Summary = { email: string; plan: string; counts: Counts; lines: string[] };
type Mode = "data" | "account" | null;

/**
 * Settings → Account → Danger zone.
 * Two irreversible actions, each behind a modal that:
 *   1. lists exactly what's removed with real counts from /api/account/summary
 *   2. offers a CSV export first (/api/account/export) so the user keeps their data
 *   3. requires typing a confirmation word (DELETE / the account email) to enable the button
 *   4. uses a danger-styled confirm button
 * Both are server-enforced (the routes re-check the confirmation AND the RLS
 * hard stop runs in the DB). Nothing here can fire on a single click.
 */
export function DangerZone() {
  const supabase = createClient();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [mode, setMode] = useState<Mode>(null);
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Load the real counts the moment a modal first opens (lazy, once).
  const openModal = async (m: "data" | "account") => {
    setError("");
    setConfirm("");
    setBusy(false);
    if (!summary) {
      const s = await fetch("/api/account/summary", { cache: "no-store" }).then((r) => r.json()).catch(() => null);
      if (s) setSummary(s);
    }
    setMode(m);
  };

  const expectedWord = mode === "account" ? (summary?.email ?? "") : "DELETE";
  const canConfirm = !busy && confirm === expectedWord && expectedWord.length > 0;

  const run = async () => {
    if (!mode || !canConfirm) return;
    setBusy(true);
    setError("");
    const ep = mode === "account" ? "/api/account/delete-account" : "/api/account/delete-data";
    let res: Response;
    try {
      res = await fetch(ep, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm }),
      });
    } catch {
      setBusy(false);
      setError("Network error — please try again.");
      return;
    }
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setBusy(false);
      setError((j as { error?: string }).error ?? "That didn't go through — please try again.");
      return;
    }
    if (mode === "data") {
      // Account + login stay; land back on an empty dashboard as if newly signed up.
      window.location.href = "/app";
    } else {
      // Account is gone — sign out and send to the confirmation page.
      await supabase.auth.signOut();
      window.location.href = "/deleted";
    }
  };

  return (
    <>
      <section className="mt-8 danzone-hairline pt-7">
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] font-semibold text-late">Danger zone</h2>
        </div>
        <p className="text-sm text-inksoft mt-1">
          Irreversible account actions. Neither can be undone, so both ask you to type a word to confirm.
        </p>

        <div className="mt-5 space-y-3">
          {/* Delete my data */}
          <div className="border border-line rounded-xl p-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold text-sm">Delete my data</div>
              <p className="text-xs text-inksoft mt-1">
                Wipes every deal, payment, calendar event, idea, to-do, inbox item and uploaded file. Keeps your account, login, handle, theme and plan — you land on an empty dashboard.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => openModal("data")}>
              <span className="inline-flex items-center gap-1.5">
                <IconDelete size={15} className="text-late" /> Delete data
              </span>
            </Button>
          </div>

          {/* Delete my account */}
          <div className="border border-line rounded-xl p-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold text-sm">Delete my account</div>
              <p className="text-xs text-inksoft mt-1">
                Everything above, plus the account itself. Cancels your subscription, releases integrations and removes auth. You&apos;re signed out for good.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => openModal("account")}>
              <span className="inline-flex items-center gap-1.5">
                <IconError size={15} className="text-late" /> Delete account
              </span>
            </Button>
          </div>
        </div>
      </section>

      {mode && (
        <DeletionModal
          mode={mode}
          summary={summary}
          confirm={confirm}
          setConfirm={setConfirm}
          canConfirm={canConfirm}
          busy={busy}
          error={error}
          onConfirm={run}
          onClose={() => { if (!busy) { setMode(null); setConfirm(""); setError(""); } }}
        />
      )}
    </>
  );
}

function DeletionModal({
  mode,
  summary,
  confirm,
  setConfirm,
  canConfirm,
  busy,
  error,
  onConfirm,
  onClose,
}: {
  mode: "data" | "account";
  summary: Summary | null;
  confirm: string;
  setConfirm: (v: string) => void;
  canConfirm: boolean;
  busy: boolean;
  error: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const lines = summary?.lines?.length ? summary.lines : ["…"];
  const isAccount = mode === "account";
  const email = summary?.email ?? "";
  const word = isAccount ? email : "DELETE";
  const wordDisplay = isAccount ? email || "your account email" : "DELETE";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md bg-card rounded-2xl border border-line2 shadow-pop fade-up text-left max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-end -mt-2 -mr-2">
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-card2 cursor-pointer">
            <IconClose size={18} />
          </button>
        </div>

        {/* Header */}
        <div className="flex items-start gap-3 px-6 pt-2">
          <div className="h-11 w-11 shrink-0 rounded-xl bg-latebg text-late grid place-items-center">
            <IconDelete size={22} />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-late">
              {isAccount ? "Delete your account" : "Delete your data"}
            </h2>
            <p className="text-sm text-inksoft mt-1">This can&apos;t be undone.</p>
          </div>
        </div>

        {/* Removed, with real counts */}
        <div className="px-6 pt-4">
          <p className="text-sm text-ink">
            You&apos;ll permanently remove:
          </p>
          <p className="text-[15px] font-medium mt-1.5">
            {lines.join(", ")}.
          </p>
          {isAccount && (
            <p className="text-xs text-inksoft mt-1.5">
              Plus the account, login, profile and plan — your subscription is cancelled and connected apps are released.
            </p>
          )}
        </div>

        {/* Export first */}
        <div className="mt-3 border border-line rounded-xl px-4 py-3 flex items-start justify-between gap-2 bg-card2">
          <div className="min-w-0 text-left">
            <div className="text-[13px] font-medium">Export your data first</div>
            <p className="text-xs text-inksoft mt-0.5">Download a CSV of your deals and payments so you keep what&apos;s yours.</p>
          </div>
          <a
            href="/api/account/export"
            download
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-line2 bg-card text-ink hover:bg-card2 text-[13px] shrink-0 cursor-pointer"
          >
            <IconDownload size={15} /> Export CSV
          </a>
        </div>

        {/* Confirmation */}
        <div className="px-6 pt-4">
          <label className="block text-sm text-ink" htmlFor="del-confirm">
            {isAccount ? (
              <>Type your email to confirm: <span className="font-medium break-all">{wordDisplay}</span></>
            ) : (
              <>Type <span className="font-medium">DELETE</span> to confirm</>
            )}
          </label>
          <input
            id="del-confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={isAccount ? (email || "your@email.com") : "DELETE"}
            autoComplete="off"
            spellCheck={false}
            className="mt-2 w-full bg-card border border-line2 rounded-xl px-3.5 h-10 text-sm text-ink placeholder:text-inkfaint focus:outline-none focus:ring-2 focus:ring-accent/30 font-sans"
          />
          {error && <p className="text-sm text-late mt-2 font-medium">{error}</p>}
        </div>

        <div className="flex items-center gap-3 px-6 pb-5 pt-3">
          <Button
            variant="danger"
            className="flex-1"
            size="lg"
            disabled={!canConfirm}
            onClick={onConfirm}
          >
            {busy ? <Spinner /> : isAccount ? "Permanently delete account" : "Permanently delete my data"}
          </Button>
          <Button variant="ghost" size="lg" disabled={busy} onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}