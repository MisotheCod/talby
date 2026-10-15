"use client";

/**
 * Assistant — SAssistant (spec 01 §7) + its states (AsEmpty / AsError /
 * AsLimit / AsOffline). Fab (Ask Talby) bottom-right, panel 400x620 desktop /
 * full screen phone. Header (avatar, title, sub, New chat, Close), body with
 * empty state + suggestions, messages, typing dots, composer, disclaimer.
 * Streams from /api/assistant (SSE) when available; degrades to the error/
 * offline state.
 */

import { useEffect, useRef, useState } from "react";

type Msg = { me: boolean; text: string; label?: string; href?: string };
type State = "ready" | "empty" | "error" | "limit" | "offline";

const SUGGESTIONS = [
  "What payments are late?",
  "What is coming up this week?",
  "When does Dramamine pay?",
  "How much did I make in August?",
];

function BotSparkle({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--t-brand-accent)" strokeWidth="1.8">
      <rect x="3" y="8" width="15" height="12" rx="3.5" />
      <path d="M10.5 8V5.5" />
      <circle cx="10.5" cy="4.5" r="1" fill="var(--t-brand-accent)" stroke="none" />
      <circle cx="8" cy="14" r="1" fill="var(--t-brand-accent)" stroke="none" />
      <circle cx="13" cy="14" r="1" fill="var(--t-brand-accent)" stroke="none" />
      <path d="M19.5 2l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8z" fill="var(--t-brand-accent)" stroke="none" />
    </svg>
  );
}

export function AssistantLauncher({ nameFirst = "there" }: { nameFirst?: string }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [state, setState] = useState<State>("empty");
  const [mob, setMob] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = window.matchMedia("(max-width: 639px)");
    const f = () => setMob(q.matches);
    f(); q.addEventListener("change", f);
    return () => q.removeEventListener("change", f);
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, typing]);

  const ask = async (text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    setOpen(true);
    setMsgs((m) => [...m, { me: true, text: t }]);
    setDraft("");
    setTyping(true);
    setState("ready");
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t }),
      });
      if (res.status === 402) { setTyping(false); setState("limit"); return; }
      if (res.status === 429) { setTyping(false); setState("limit"); return; }
      if (!res.ok) { setTyping(false); setState("error"); return; }
      const data = await res.json();
      setMsgs((m) => [...m, { me: false, text: data.answer || "I don't see that in your Talby data." }]);
    } catch {
      setTyping(false);
      setState(navigator.onLine ? "error" : "offline");
      return;
    }
    setTyping(false);
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          className="tb a-fab fixed right-6 bottom-6 z-[70] inline-flex h-11 items-center gap-2 rounded-[22px] border px-4 pl-3 text-sm font-medium hover:-translate-y-0.5"
          style={{ background: "var(--t-card)", color: "var(--t-fg)", borderColor: "var(--t-border)", boxShadow: "var(--t-sh-pop)" }}
          aria-label="Ask Talby Assistant"
          onClick={() => setOpen(true)}
        >
          <BotSparkle />
          {!mob && "Ask Talby"}
        </button>
      )}

      {open && (
        <section
          role="dialog"
          aria-label="Talby Assistant"
          className="a-panel fixed z-[75] flex flex-col overflow-hidden"
          style={{
            right: mob ? 0 : 24, bottom: mob ? 0 : 24, left: mob ? 0 : "auto", top: mob ? 0 : "auto",
            width: mob ? "100%" : 400, height: mob ? "100%" : 620, maxHeight: mob ? "100%" : "calc(100vh - 48px)",
            background: "var(--t-card)", color: "var(--t-fg)",
            border: mob ? "none" : "1px solid var(--t-border)", borderRadius: mob ? 0 : "var(--t-r-dialog)",
            boxShadow: "var(--t-sh-pop)", transformOrigin: "bottom right",
          }}
        >
          <header className="flex items-center gap-3 py-3.5 pr-2.5 pl-4" style={{ borderBottom: "1px solid var(--t-line)" }}>
            <span className="grid size-9 shrink-0 place-items-center rounded-full" style={{ background: "var(--t-fill)" }}><BotSparkle /></span>
            <span className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="font-semibold whitespace-nowrap">Talby Assistant</span>
              <span className="overflow-hidden text-xs text-ellipsis whitespace-nowrap text-[color:var(--t-muted-fg)]">Knows your deals, payments and contracts</span>
            </span>
            <button type="button" aria-label="New chat" className="tb tg inline-flex size-8 items-center justify-center rounded-[var(--t-r-ctl)] text-[color:var(--t-fg)]"
              style={{ ["--hv" as string]: "var(--t-hv)" } as React.CSSProperties}
              onClick={() => { setMsgs([]); setTyping(false); setDraft(""); setState("empty"); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.38 3.62a1 1 0 0 1 3 3L7.37 18.64a2 2 0 0 1-.85.5l-2.87.84a.5.5 0 0 1-.62-.62l.84-2.87a2 2 0 0 1 .5-.85z" /></svg>
            </button>
            <button type="button" aria-label="Close assistant" className="tb tg inline-flex size-8 items-center justify-center rounded-[var(--t-r-ctl)] text-[color:var(--t-fg)]"
              style={{ ["--hv" as string]: "var(--t-hv)" } as React.CSSProperties} onClick={() => setOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </header>

          <div ref={bodyRef} aria-live="polite" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
            {msgs.length === 0 && !typing && state === "empty" && (
              <>
                <div className="flex flex-col gap-1.5 px-1 pt-3 pb-2">
                  <p className="text-lg font-semibold tracking-[-0.3px]">Hi {nameFirst}. What do you want to know?</p>
                  <p className="text-sm text-[color:var(--t-muted-fg)]">Ask about payments, posts, contracts or what is due. Answers come from your Talby data.</p>
                </div>
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => ask(s)}
                    className="tb tg a-msg flex h-10 w-full items-center gap-2.5 overflow-hidden rounded-[var(--t-r-ctl)] border px-3.5 text-left text-sm"
                    style={{ borderColor: "var(--t-border)", background: "var(--t-card)", color: "var(--t-fg)", ["--hv" as string]: "var(--t-hv)" } as React.CSSProperties}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--t-muted-fg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">{s}</span>
                  </button>
                ))}
              </>
            )}

            {msgs.map((m, i) => (
              <div key={i} className="a-msg flex flex-col gap-2" style={{ alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: m.me ? "85%" : "92%" }}>
                <div className="whitespace-pre-line px-3.5 py-2.5 text-sm"
                  style={{ borderRadius: "var(--t-r-card)", background: m.me ? "var(--t-primary)" : "var(--t-tile)", color: m.me ? "var(--t-primary-fg)" : "var(--t-fg)" }}>
                  {m.text}
                </div>
              </div>
            ))}

            {typing && (
              <div role="status" aria-label="Talby is answering" className="inline-flex h-10 items-center gap-1.5 self-start px-4"
                style={{ borderRadius: "var(--t-r-card)", background: "var(--t-tile)" }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="a-dot size-1.5 rounded-full" style={{ background: "var(--t-muted-fg)", animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            )}

            {(state === "error" || state === "offline" || state === "limit") && (
              <div className="a-fade flex flex-col items-center gap-2 px-4 py-6 text-center">
                <span className="grid size-10 place-items-center rounded-full"
                  style={{ background: "var(--t-bad-bg)", color: "var(--t-bad-fg)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" /></svg>
                </span>
                <p className="font-medium">
                  {state === "limit" ? "You have asked a lot of questions today" :
                    state === "offline" ? "You are offline" : "Talby could not answer just now"}
                </p>
                <p className="text-sm text-[color:var(--t-muted-fg)]">
                  {state === "limit" ? "Talby can answer more tomorrow morning." :
                    state === "offline" ? "Check your connection and try again." : "Something went wrong. Try again in a moment."}
                </p>
                {state !== "limit" && (
                  <button type="button" onClick={() => setState("empty")}
                    className="tb mt-1 inline-flex h-8 items-center rounded-[var(--t-r-ctl)] border px-3.5 text-sm font-medium"
                    style={{ borderColor: "var(--t-border)", background: "var(--t-card)", color: "var(--t-fg)" }}>
                    Try again
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 px-4 pt-3 pb-3.5" style={{ borderTop: "1px solid var(--t-line)" }}>
            <div className="flex items-center gap-2">
              <input
                aria-label="Ask Talby a question"
                placeholder="Ask about a deal or payment"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") ask(draft); }}
                className="h-9 min-w-0 flex-1 rounded-[var(--t-r-ctl)] border-0 bg-[color:var(--t-fill)] px-4 text-sm text-[color:var(--t-fg)] outline-none placeholder:text-[color:var(--t-muted-fg)]"
              />
              <button type="button" aria-label="Send" aria-disabled={!draft.trim()} onClick={() => ask(draft)}
                className="tb inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--t-r-ctl)] border-0 hover:opacity-[.88]"
                style={{ background: "var(--t-primary)", color: "var(--t-primary-fg)", opacity: draft.trim() ? 1 : 0.4 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
              </button>
            </div>
            <p className="text-center text-xs text-[color:var(--t-muted-fg)]">Talby can get things wrong. Check anything important.</p>
          </div>
        </section>
      )}
    </>
  );
}
