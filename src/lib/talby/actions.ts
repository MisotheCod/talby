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
          // Post dates are content rows, never deals.post_date (guard trigger rejects it).
          if (f.post) payload.post_dates = [{ date: String(f.post), label: "Post", post_type: "" }];
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
          const { id, changes, extras, checklist } = p as { id: string; changes?: Record<string, unknown>; extras?: Array<{ type: string; value: string }>; checklist?: Array<{ text: string; done: boolean }> };
          const c = { ...(changes ?? {}) };
          // --- collect the deal-panel fields the board sends ---
          const dealUpdate: Record<string, unknown> = {};
          if (c.status !== undefined) {
            const s = String(c.status).toLowerCase();
            const norm = ["active", "archived", "negotiating", "past_due", "paid"].includes(s) ? s : "active";
            if (norm === "archived") { dealUpdate.status = "archived"; dealUpdate.active = false; }
            else if (norm === "negotiating") dealUpdate.status = "pipeline";
            else dealUpdate.status = norm;
          }
          if (c.how !== undefined) {
            const how = String(c.how);
            dealUpdate.payment_structure = how === "All at once" ? "once" : how === "Split" ? "split" : how === "In parts" ? "parts" : how === "Monthly" ? "monthly" : how.toLowerCase();
          }
          if (c.when !== undefined) dealUpdate.pay_terms = c.when ? String(c.when) : null;
          if (c.due !== undefined) dealUpdate.due_date = c.due ? String(c.due) : null;
          if (c.types !== undefined) dealUpdate.deliverable = c.types ? String(c.types) : null;
          if (c.rev !== undefined) dealUpdate.revisions_included = c.rev ? String(c.rev) : null;
          if (c.repName !== undefined) dealUpdate.rep_name = c.repName ? String(c.repName) : null;
          if (c.repEmail !== undefined) dealUpdate.rep_email = c.repEmail ? String(c.repEmail) : null;
          if (c.notes !== undefined) dealUpdate.notes = c.notes ? String(c.notes) : null;
          if (c.amt !== undefined) {
            const n = parseFloat(String(c.amt).replace(/[$,%\s]/g, ""));
            dealUpdate.value = Number.isFinite(n) ? n : null;
          }
          // repPhone + platforms have no deal columns; keep them in the links jsonb.
          const linkPatch: Record<string, unknown> = {};
          if (c.repPhone !== undefined) linkPatch.repPhone = c.repPhone ? String(c.repPhone) : null;
          if (c.plats !== undefined && Array.isArray(c.plats)) linkPatch.platforms = (c.plats as unknown[]).map(String);
          if (Object.keys(dealUpdate).length) {
            const { error } = await supabase.from("deals").update(dealUpdate).eq("id", String(id));
            if (error) throw new Error("deal.update: " + error.message);
          }
          if (Object.keys(linkPatch).length) {
            const { data: cur } = await supabase.from("deals").select("links").eq("id", String(id)).maybeSingle();
            const links = (cur as { links?: unknown } | null)?.links;
            const base = Array.isArray(links) ? {} : (links && typeof links === "object" ? { ...(links as Record<string, unknown>) } : {});
            const merged = { ...base, ...(linkPatch.repPhone !== undefined ? { repPhone: linkPatch.repPhone } : {}), ...(linkPatch.platforms !== undefined ? { platforms: linkPatch.platforms } : {}) };
            const { error } = await supabase.from("deals").update({ links: merged }).eq("id", String(id));
            if (error) throw new Error("deal.update links: " + error.message);
          }
          // post date -> content row (deals.post_date is read-only via a guard trigger)
          if (c.post !== undefined && c.post) {
            const { data: has } = await supabase.from("content").select("id").eq("linked_deal_id", String(id)).eq("post_type", "").limit(1).maybeSingle();
            const row = { user_id: uid, linked_deal_id: String(id), title: String(c.post), event_date: String(c.post), status: "planned", post_type: "" };
            const { error } = has
              ? await supabase.from("content").update({ event_date: String(c.post) }).eq("id", (has as { id: string }).id)
              : await supabase.from("content").insert(row);
            if (error) throw new Error("deal.update post: " + error.message);
          }
          // --- extras: replace the deal's bonus/commission lines ---
          if (Array.isArray(extras)) {
            const del = await supabase.from("deal_extras").delete().eq("deal_id", String(id));
            if (del.error) throw new Error("deal.update extras del: " + del.error.message);
            for (const e of extras) {
              const value = String(e.value ?? "").trim();
              const isComm = String(e.type ?? "").toLowerCase() === "commission";
              const kind = isComm ? "commission" : "bonus";
              const num = parseFloat(value.replace(/[$,%\s]/g, ""));
              const row: Record<string, unknown> = isComm
                ? { user_id: uid, deal_id: String(id), kind, amount: null, condition: null, rate: Number.isFinite(num) ? num : null, on_text: value || null, earned: false }
                : { user_id: uid, deal_id: String(id), kind, amount: Number.isFinite(num) ? num : null, condition: value || null, rate: null, on_text: null, earned: false };
              const { error } = await supabase.from("deal_extras").insert(row as never);
              if (error) throw new Error("deal.update extras: " + error.message);
            }
          }
          // --- checklist: replace the deal's checklist ---
          if (Array.isArray(checklist)) {
            const del = await supabase.from("deal_checklist").delete().eq("deal_id", String(id));
            if (del.error) throw new Error("deal.update checklist del: " + del.error.message);
            for (const item of checklist) {
              const { error } = await supabase.from("deal_checklist").insert({ user_id: uid, deal_id: String(id), title: String(item.text ?? ""), done: !!item.done });
              if (error) throw new Error("deal.update checklist: " + error.message);
            }
          }
          await refresh(); return true;
        }
        case "payment.setStatus": {
          const { dealId, paymentId, index, state } = p as { dealId: string | number; paymentId?: string | number | null; index?: number; state?: string };
          const deal_id = String(dealId);
          if (!deal_id) throw new Error("payment.setStatus: no dealId");
          let pid = paymentId != null && String(paymentId) !== "" ? String(paymentId) : null;
          if (!pid && index != null) {
            const { data: pms } = await supabase.from("payments").select("id").eq("deal_id", deal_id).order("expected_date", { ascending: true });
            const row = (pms ?? [])[index];
            if (row) pid = String(row.id);
          }
          if (!pid) throw new Error("payment.setStatus: no paymentId and index did not match");
          const patch = state === "paid"
            ? { status: "received", pay_status: "paid" }
            : state === "inv"
            ? { status: "expected", pay_status: "invoiced" }
            : { status: "expected", pay_status: "not_invoiced" };
          const { error } = await supabase.from("payments").update(patch).eq("id", pid);
          if (error) throw new Error("payment.setStatus: " + error.message);
          // When every payment on the deal is paid, mark the deal paid too.
          const { data: all } = await supabase.from("payments").select("status, pay_status").eq("deal_id", deal_id);
          const rows = all ?? [];
          if (rows.length && rows.every((x) => x.status === "received" || x.pay_status === "paid")) {
            const { error: de } = await supabase.from("deals").update({ status: "paid", payment_status: "paid" }).eq("id", deal_id);
            if (de) throw new Error("payment.setStatus deal: " + de.message);
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
        case "deal.delete": { const id = String((p as { id?: string | number }).id ?? ""); if (!id) throw new Error("deal.delete: missing deal id"); const { error } = await supabase.from("deals").update({ active: false }).eq("id", id); if (error) return false; await refresh(); return true; }
        case "deal.restore": { const id = String((p as { id?: string | number }).id ?? ""); if (!id) throw new Error("deal.restore: missing deal id"); const { error } = await supabase.from("deals").update({ active: true, status: "active" }).eq("id", id); if (error) return false; await refresh(); return true; }
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
        case "todo.create": { const { text, due, deal } = p as { text: string; due?: string; deal?: string }; const title = String(text ?? "").trim(); if (!title) return false; let deal_id = null; if (deal) { const { data: dm } = await supabase.from("deals").select("id").eq("brand", String(deal)).limit(1).maybeSingle(); if (dm) deal_id = (dm as { id: string }).id; } const { error } = await supabase.from("todos").insert({ user_id: uid, title, due_date: due || null, done: false, deal_id }); if (error) return false; await refresh(); return true; }
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
