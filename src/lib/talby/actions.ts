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

      const { data: { user } } = await supabase.auth.getUser();
      const uid = user?.id ?? null;
      if (!uid) return false; // no session -> RLS rejects every owner-scoped write

      switch (type) {
        case "deal.create": {
          const { form, plan, contract } = p as { form?: Record<string, unknown>; plan?: unknown; contract?: string | null };
          const f = (form ?? {}) as Record<string, unknown>;
          const brand = String(f["brand"] ?? "").trim();
          if (!brand) return false;
          const num = (v: unknown): number | string => {
            if (typeof v === "number") return v;
            const n = parseFloat(String(v ?? "").replace(/[,$\\s]/g, ""));
            return Number.isFinite(n) ? n : String(v ?? "");
          };
          // The board's form uses amt as a string like "2,400"; the route/RPC need a number,
          // and form.status is the display value "Active" while deals_status_check wants lowercase.
          const payload: Record<string, unknown> = { ...f, brand };
          if (f.amt !== undefined) payload.value = num(f.amt);
          if (f.paid !== undefined) payload.payment_structure = String(f.paid);
          if (f.rep) payload.rep_name = String(f.rep);
          if (f.repEmail) payload.rep_email = String(f.repEmail);
          if (f.post) payload.post_date = String(f.post);
          const s = String(f.status ?? "active").toLowerCase();
          payload.status = ["active", "archived", "negotiating", "past_due", "paid"].includes(s) ? s : "active";
          if (plan) payload.payment_schedule = plan;
          const res = await fetch("/api/deals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brand, payload, idempotencyKey: `manual:${brand}:${Date.now()}` }) });
          if (!res.ok) throw new Error("Could not create the deal."); // reject -> board shows its error toast
          // A deal read from a contract keeps that file attached to it.
          if (contract) {
            const j = (await res.json().catch(() => ({}))) as { deal?: { id?: string } };
            const dealId = j?.deal?.id;
            if (dealId) {
              await supabase.from("deal_files").insert({
                user_id: uid,
                deal_id: dealId,
                name: String(contract).split("/").pop() || "contract",
                path: contract,
              });
            }
          }
          await refresh(); return true;
        }
        case "deals.import": {
          // saved: true means the import route already wrote the rows — only reload.
          if ((p as { saved?: boolean }).saved) { await refresh(); return true; }
          const { deals } = p as { deals?: Array<{ brand: string; amt: number }> };
          for (const d of deals ?? []) {
            const res = await fetch("/api/deals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brand: d.brand, payload: { value: d.amt }, idempotencyKey: `import:${d.brand}:${d.amt}` }) });
            if (!res.ok) return false;
          }
          await refresh(); return true;
        }
        case "deal.update": {
          const { id, changes, extras } = p as { id: string; changes?: Record<string, unknown>; extras?: unknown };
          if (changes && Object.keys(changes).length) {
            // Normalize the board's display status value ("Active"/"Negotiating") to the DB value.
            const c = { ...changes };
            if (c.status !== undefined) {
              const s = String(c.status).toLowerCase();
              c.status = ["active", "archived", "negotiating", "past_due", "paid"].includes(s) ? s : "active";
            }
            const { error } = await supabase.from("deals").update(c).eq("id", String(id)); if (error) return false;
          }
          if (Array.isArray(extras)) {
            await supabase.from("deal_extras").delete().eq("deal_id", String(id));
            for (const e of extras as Array<Record<string, unknown>>) await supabase.from("deal_extras").insert({ user_id: uid, deal_id: String(id), kind: e.kind, amount: e.amount ?? null, condition: e.condition ?? null, rate: e.rate ?? null, on_text: e.on ?? null, earned: false });
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
        case "deal.setPayBy": {
          const { brand, date } = p as { brand?: string; date?: string };
          if (!brand) return false;
          const { data: deals } = await supabase.from("deals").select("id").eq("brand", brand);
          const ids = ((deals as Array<{ id: string }> | null) ?? []).map((x) => x.id);
          if (ids.length) { const { error } = await supabase.from("payments").update({ expected_date: date || null }).in("deal_id", ids); if (error) return false; }
          await refresh(); return true;
        }
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
          if (kind === "post") { const { error } = await supabase.from("content").insert({ user_id: uid, title, event_date: date, status: "planned" }); if (error) return false; }
          else if (kind === "pay") { const { error } = await supabase.from("payments").insert({ user_id: uid, amount: amount ?? 0, expected_date: date, status: "expected", pay_status: "not_invoiced" }); if (error) return false; }
          else { const { error } = await supabase.from("todos").insert({ user_id: uid, title, due_date: date, done: false }); if (error) return false; }
          await refresh(); return true;
        }
        case "event.setDone": { const { id, done } = p as { id: string; done: boolean }; const { error } = await supabase.from("todos").update({ done }).eq("id", String(id)); if (error) return false; await refresh(); return true; }
        case "todo.create": { const { text, due } = p as { text: string; due?: string }; const { error } = await supabase.from("todos").insert({ user_id: uid, title: text, due_date: due || null, done: false }); if (error) return false; await refresh(); return true; }
        case "todo.setDone": { const { id, done } = p as { id: string; done: boolean }; const { error } = await supabase.from("todos").update({ done }).eq("id", String(id)); if (error) return false; await refresh(); return true; }
        case "todo.delete": { const { id } = p as { id: string }; const { error } = await supabase.from("todos").delete().eq("id", String(id)); if (error) return false; await refresh(); return true; }
        case "todo.restore": { await refresh(); return true; }
        case "idea.create": { const { text } = p as { text: string }; const { error } = await supabase.from("ideas").insert({ user_id: uid, title: text, status: "unsorted" }); if (error) return false; await refresh(); return true; }
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
        case "assistant.ask": {
          // The board handles the state and stores the reply itself; we just need to return the result.
          // The board passes the payload and expects { text, label, href } back.
          return true;
        }
        default:
          { const e = new Error("Unhandled onAction type: " + type) as Error & { __unhandled?: boolean }; e.__unhandled = true; throw e; }
      }
    } catch (e) {
      // Unhandled actions REJECT so the board shows its error toast (never a quiet no-op).
      if ((e as Error & { __unhandled?: boolean })?.__unhandled) throw e;
      return false; // real handler errors -> Try again
    }
  };
}
