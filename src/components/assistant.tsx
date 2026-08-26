"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button, Input, Spinner } from "@/components/ui";
import { IconClose, IconSend } from "@/components/icons";
import { FluentBotSparkle28Regular } from "@/components/fluent-icons";
import ReactMarkdown from "react-markdown";

/** Render assistant markdown (bold/italic/lists) without showing literal **. */
function Md({ text }: { text: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <span className="leading-relaxed">{children}</span>,
        strong: ({ children }) => <strong className="font-semibold text-inksoft">{children}</strong>,
        em: ({ children }) => <em>{children}</em>,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

/**
 * Talby Assistant launcher (paid tier). Floating control in the bottom-right.
 * Opens a chat panel that answers grounded questions about the user's own
 * deals, payments, contracts, and calendar via POST /api/assistant.
 * The panel is collision-safe to the viewport: opens upward, caps its height,
 * and scrolls internally. Free users get a growth-framed upgrade prompt.
 */

const STARTERS = [
  "How much am I owed this month?",
  "What's my biggest deal this year?",
  "What are my usage rights for a contract?",
  "Can I take a competing brand deal?",
  "What to do next?",
];

type Citation = { dealId: string; brand: string };
type Msg = { role: "user" | "assistant"; text: string; citations?: Citation[] };

export function AssistantLauncher() {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<"paid" | "free" | "loading">("loading");
  const [history, setHistory] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState(""); // streaming assistant text (plain, no markdown yet)
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) { setPlan("free"); return; }
      const p = await supabase.from("profiles").select("plan").eq("id", user.id).single();
      setPlan(((p.data as unknown as { plan?: string })?.plan === "paid") ? "paid" : "free");
    })();
  }, [supabase]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history]);

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    setError(""); setBusy(true);
    setInput(""); // clear the composer after sending
    setHistory((h) => [...h, { role: "user", text: q }]);
    setLive("");
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: q }),
      });
      const ctype = res.headers.get("content-type") || "";
      // Off-topic / hard errors come back as JSON (not a stream).
      if (!ctype.includes("event-stream")) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 402 || data?.error === "paid_required") { window.location.href = "/#pricing"; return; }
        if (res.status === 401) { window.location.href = "/login"; return; }
        if (!res.ok) { setError(data?.error || "Something went wrong. Try again."); return; }
        if (data.answer) {
          setHistory((h) => [...h, { role: "assistant", text: data.answer, citations: data.citations || [] }]);
        }
        return;
      }
      // SSE stream: accumulate into `live`, finalize on "done".
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        while (buf.includes("\n")) {
          const nl = buf.indexOf("\n");
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload) continue;
          try {
            const ev = JSON.parse(payload);
            if (ev.type === "delta") {
              const t = typeof ev.text === "string" ? ev.text : "";
              if (t) setLive((p) => p + t);
            } else if (ev.type === "done") {
              setHistory((h) => [...h, { role: "assistant", text: ev.answer || live, citations: ev.citations || [] }]);
              setLive("");
            } else if (ev.type === "error") {
              setError(ev.error || "Something went wrong. Try again.");
            }
          } catch { /* partial */ }
        }
      }
    } catch {
      setError("Could not reach the assistant. Try again.");
    } finally {
      setBusy(false);
      setLive("");
    }
  };

  const launcher = (
    <button
      onClick={() => setOpen((o) => !o)}
      aria-label="Talby Assistant"
      aria-expanded={open}
      data-tour="assistant"
      className="assistant-fab"
    >
      <span className="assistant-fab-svg">
        <FluentBotSparkle28Regular width={22} height={22} className="text-accent" />
      </span>
    </button>
  );

  return (
    <>
      {launcher}
      {open && (
        <>
          <div className="assistant-overlay" onClick={() => setOpen(false)} />
          <div className="assistant-panel sticky-scroll" onClick={(e) => e.stopPropagation()}>
          <div className="assistant-head">
            <div className="flex items-center gap-2">
              <FluentBotSparkle28Regular width={17} height={17} className="text-accentink" />
              <span className="font-semibold text-[14px]">Talby Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant" className="p-1 rounded-lg hover:bg-subtle cursor-pointer">
              <IconClose size={16} />
            </button>
          </div>

          {plan !== "paid" ? (
            <div className="px-4 py-4 text-sm text-muted">
              {plan === "loading" ? (
                <div className="flex items-center gap-2"><Spinner /> Checking your plan</div>
              ) : (
                <div className="rounded-xl border border-line p-4 space-y-2">
                  <p className="font-medium">The assistant is on the Unlimited plan.</p>
                  <p className="text-[13px] text-muted">Ask about your deals, payments, contracts, and calendar.</p>
                  <Button size="sm" onClick={() => { window.location.href = "/#pricing"; }} className="w-full mt-1">Go unlimited</Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="assistant-body">
                {history.length === 0 ? (
                  <div className="px-4 py-4">
                    <p className="text-sm">Ask about the money you're owed, a contract clause, or what's due next.</p>
                    <div className="flex flex-col gap-1.5 mt-2">
                      {STARTERS.map((s) => (
                        <button key={s} onClick={() => ask(s)} className="text-left px-3 py-2 rounded-lg border border-line text-[13px] text-inksoft hover:text-ink hover:border-line2 cursor-pointer">{s}</button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 px-3 py-3">
                    {history.map((m, i) => (
                      <div key={i} className={cn("flex w-full", m.role === "user" ? "justify-end" : "justify-start")}>
                        <div className={cn("chat-bubble", m.role === "user" ? "chat-user" : "chat-ai")}>
                          {m.role === "assistant" ? (
                            <Md text={m.text} />
                          ) : (
                            <span>{m.text}</span>
                          )}
                          {m.role === "assistant" && m.citations && m.citations.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {m.citations.map((c) => (
                                <a key={c.dealId} href={`/app/deals?open=${c.dealId}`} className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full bg-accenttint text-accentink hover:bg-accenttint2 no-underline">
                                  {c.brand}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {live && (
                      <div className="flex w-full justify-start">
                        <div className="chat-bubble chat-ai">
                          <span className="whitespace-pre-wrap">{live}</span>
                          <span className="live-caret" />
                        </div>
                      </div>
                    )}
                    {busy && live === "" && <div className="flex items-center gap-2 text-[13px] text-inksoft"><Spinner className="h-3.5 w-3.5" /> Checking your data</div>}
                    {error && <p className="text-[13px] text-bad" role="alert">{error}</p>}
                  </div>
                )}
              </div>
              <form
                className="assistant-input"
                onSubmit={(e) => { e.preventDefault(); ask(input); }}
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your deals, payments, etc."
                  aria-label="Ask Talby Assistant"
                  autoFocus
                />
                <Button type="submit" disabled={busy || !input.trim()} aria-label="Send" className="px-3 send-btn">
                  {busy ? (
                    <svg className="send-spin" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="40" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <IconSend size={16} />
                  )}
                </Button>
              </form>
            </>
          )}
            </div>
          </>
        )}
      </>
  );
}