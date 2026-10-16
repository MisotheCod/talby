"use client";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * actions.ts — the single onAction dispatcher every page board uses.
 * The board updates optimistically, then calls onAction(type, payload). We do
 * the real write; resolve => done, reject/false => the board shows Try again.
 * All writes go through the user's RLS-scoped client, so ownership is enforced.
 * Canceled/read-only accounts cannot write (the boards also block in the UI).
 */
export function makeOnAction(supabase: SupabaseClient, refresh: () => Promise<void> | void, readOnly = false) {
  const guard = () => { if (readOnly) return false; return true; };

  return async function onAction(type: string, p: Record<string, unknown>): Promise<boolean> {
    try {
      if (type === "look.update") {
        const t = p as { theme?: string; mode?: string; sidebar?: string };
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;
        await supabase.from("profiles").update({ theme: t.theme ?? "studio", mode: t.mode ?? "light", sidebar: t.sidebar ?? "expanded" }).eq("id", user.id);
        return true;
      }
      if (type === "data.reload") { await refresh(); return true; }
      if (!guard()) return false;

      switch (type) {
        case "deal.create": {
          const { form, plan } = p as { form?: Record<string, unknown>; plan?: unknown };
          const payload = { ...(form ?? {}), ...(plan ? { payment_schedule: plan } : {}) } as Record<string, unknown>;
          const brand = String((form as { brand?: string } | undefined)?.brand ?? payload.brand ?? "").trim();
          if (!brand) return false;
          const res = await fetch("/api/deals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brand, payload, idempotencyKey: `manual:${brand}:${Date.now()}` }) });
          if (!res.ok) return false;
          await refresh(); return true;
        }
        case "deals.import": {
          const { deals } = p as { deals?: Array<{ brand: string; amt: number }> };
          for (const d of deals ?? []) {
            const res = await fetch("/api/deals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brand: d.brand, payload: { value: d.amt }, idempotencyKey: `import:${d.brand}:${d.amt}` }) });
            if (!res.ok) return false;
          }
          await refresh(); return true;
        }
        case "deal.update": {
          const { id, changes, extras } = p as { id: string; changes?: Record<string, unknown>; extras?: unknown };
          if (changes && Object.keys(changes).length) { const { error } = await supabase.from("deals").update(changes).eq("id", String(id)); if (error) return false; }
          if (Array.isArray(extras)) {
            await supabase.from("deal_extras").delete().eq("deal_id", String(id));
            for (const e of extras as Array<Record<string, unknown>>) await supabase.from("deal_extras").insert({ deal_id: String(id), kind: e.kind, amount: e.amount ?? null, condition: e.condition ?? null, rate: e.rate ?? null, on_text: e.on ?? null, earned: false });
          }
          await refresh(); return true;
        }
        case "deal.markPaid": {
          const { id } = p as { id: string };
          const { error } = await supabase.from("payments").update({ status: "received", pay_status: "paid" }).eq("deal_id", String(id)).neq("status", "received");
          if (error) return false; await refresh(); return true;
        }
        case "deal.duplicate": {
          const { id } = p as { id: string };
          const { data: src } = await supabase.from("deals").select("*").eq("id", String(id)).single();
          if (!src) return false;
          const copy = { ...(src as Record<string, unknown>) };
          delete copy.id; delete copy.created_at; delete copy.updated_at;
          copy.brand = String(copy.brand) + " (copy)"; copy.idempotency_key = null;
          const { error } = await supabase.from("deals").insert(copy);
          if (error) return false; await refresh(); return true;
        }
        case "deal.archive": { const { error } = await supabase.from("deals").update({ status: "archived", active: false }).eq("id", String((p as { id: string }).id)); if (error) return false; await refresh(); return true; }
        case "deal.unarchive": { const { error } = await supabase.from("deals").update({ status: "active", active: true }).eq("id", String((p as { id: string }).id)); if (error) return false; await refresh(); return true; }
        case "deal.delete": { const { error } = await supabase.from("deals").update({ active: false }).eq("id", String((p as { id: string }).id)); if (error) return false; await refresh(); return true; }
        case "deal.restore": { const { error } = await supabase.from("deals").update({ active: true }).eq("id", String((p as { id: string }).id)); if (error) return false; await refresh(); return true; }
        case "deals.bulk": {
          const { change, ids } = p as { change: string; ids: Array<string | number> };
          const patch = change === "paid" ? { status: "paid", payment_status: "paid" } : change === "invoiced" ? { payment_status: "expected" } : { status: "archived", active: false };
          const { error } = await supabase.from("deals").update(patch).in("id", (ids ?? []).map(String));
          if (error) return false; await refresh(); return true;
        }
        case "payment.markPaid": { const { error } = await supabase.from("payments").update({ status: "received", pay_status: "paid" }).eq("id", String((p as { id: string }).id)); if (error) return false; await refresh(); return true; }
        case "payment.record": {
          const { id, amount, date } = p as { id: string; amount?: number; date?: string };
          const { error } = await supabase.from("payments").update({ amount: amount ?? undefined, expected_date: date ?? undefined, status: "received", pay_status: "paid" }).eq("id", String(id));
          if (error) return false; await refresh(); return true;
        }
        case "event.create": {
          const { date, kind, title, amount } = p as { date: string; kind: string; title: string; amount?: number };
          if (kind === "post") { const { error } = await supabase.from("content").insert({ title, event_date: date, status: "planned" }); if (error) return false; }
          else if (kind === "pay") { const { error } = await supabase.from("payments").insert({ amount: amount ?? 0, expected_date: date, status: "expected", pay_status: "not_invoiced" }); if (error) return false; }
          else { const { error } = await supabase.from("todos").insert({ title, due_date: date, done: false }); if (error) return false; }
          await refresh(); return true;
        }
        case "event.setDone": { const { id, done } = p as { id: string; done: boolean }; const { error } = await supabase.from("todos").update({ done }).eq("id", String(id)); if (error) return false; await refresh(); return true; }
        case "todo.create": { const { text, due } = p as { text: string; due?: string }; const { error } = await supabase.from("todos").insert({ title: text, due_date: due || null, done: false }); if (error) return false; await refresh(); return true; }
        case "todo.setDone": { const { id, done } = p as { id: string; done: boolean }; const { error } = await supabase.from("todos").update({ done }).eq("id", String(id)); if (error) return false; await refresh(); return true; }
        case "todo.delete": { const { id } = p as { id: string }; const { error } = await supabase.from("todos").delete().eq("id", String(id)); if (error) return false; await refresh(); return true; }
        case "todo.restore": { await refresh(); return true; }
        case "idea.create": { const { text } = p as { text: string }; const { error } = await supabase.from("ideas").insert({ title: text, status: "unsorted" }); if (error) return false; await refresh(); return true; }
        case "idea.star": { await refresh(); return true; }
        case "idea.delete": { const { id } = p as { id: string }; const { error } = await supabase.from("ideas").update({ status: "archived" }).eq("id", String(id)); if (error) return false; await refresh(); return true; }
        case "idea.restore": { await refresh(); return true; }
        case "profile.update": {
          const { displayName, handle } = p as { displayName?: string; handle?: string };
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return false;
          const patch: Record<string, unknown> = {};
          if (displayName !== undefined) patch.handler = String(displayName).toLowerCase().replace(/\s+/g, ".").replace(/[^a-z0-9._-]/g, "");
          if (handle !== undefined) patch.handler = String(handle).replace(/^@/, "").toLowerCase();
          if (!Object.keys(patch).length) return true;
          const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
          if (error) return false; await refresh(); return true;
        }
        case "photo.update": {
          const { dataUrl } = p as { dataUrl?: string };
          if (!dataUrl) return false;
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return false;
          const blob = await (await fetch(dataUrl)).blob();
          const path = `${user.id}/avatar-${Date.now()}.png`;
          const up = await supabase.storage.from("avatars").upload(path, blob, { upsert: true, contentType: blob.type || "image/png" });
          if (up.error) return false;
          await supabase.from("profiles").update({ avatar_url: path }).eq("id", user.id);
          await refresh(); return true;
        }
        case "photo.remove": {
          await supabase.from("profiles").update({ avatar_url: null }).eq("id", (await supabase.auth.getUser()).data.user?.id ?? "");
          await refresh(); return true;
        }
        case "notifications.update": {
          const { inapp, digest, overdue, posts } = p as { inapp?: boolean; digest?: boolean; overdue?: boolean; posts?: boolean };
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return false;
          const { error } = await supabase.from("profiles").update({ notify_calendar_inapp: !!inapp, digest_enabled: !!digest }).eq("id", user.id);
          if (error) return false; await refresh(); return true;
        }
        case "password.update": {
          const { next } = p as { current?: string; next?: string };
          if (!next) return false;
          const { error } = await supabase.auth.updateUser({ password: next });
          if (error) return false; return true;
        }
        case "notion.disconnect": {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return false;
          const { error } = await supabase.from("notion_connections").delete().eq("user_id", user.id);
          if (error) return false; await refresh(); return true;
        }
        case "billing.open": {
          const res = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
          if (!res.ok) return false;
          const j = (await res.json().catch(() => ({}))) as { url?: string };
          if (j.url) { window.location.href = j.url; return true; }
          return false;
        }
        case "data.deleteAll": {
          const res = await fetch("/api/account/delete-data", { method: "POST" });
          if (!res.ok) return false; await refresh(); return true;
        }
        case "account.delete": {
          const res = await fetch("/api/account/delete-account", { method: "POST" });
          if (!res.ok) return false;
          await supabase.auth.signOut();
          window.location.href = "/";
          return true;
        }
        default:
          return false; // not wired -> Try again (never a silent save)
      }
    } catch { return false; }
  };
}
