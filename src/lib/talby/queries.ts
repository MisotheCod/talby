import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * queries.ts — server-side row fetches for each page board (Overview, Deals,
 * Payments, Calendar, To-dos, Ideas, Settings). Claude is adding a `data` prop
 * with exact TS types to each board; these functions return the raw Supabase
 * rows (RLS-scoped to the signed-in user) that the /app pages will map into
 * that data via to-board.ts. Nothing here touches real accounts — always the
 * caller's own rows.
 *
 * Every function takes the user-scoped server client (cookie/auth) so RLS
 * enforces ownership; it does not pass a raw userId for cross-account reads.
 */

/* ------------------------------ rows ------------------------------ */

export interface DealRow {
  id: string; user_id: string; brand: string; status: string;
  deliverable: string | null; value: number | null; due_date: string | null;
  notes: string | null; links: unknown; active: boolean; created_at: string;
  rep_name: string | null; rep_email: string | null; nudge_mode: string | null;
  deal_type: string | null; payment_status: string | null; pay_terms: string | null;
  exclusivity_days: number | null; idempotency_key: string | null; post_date: string | null;
  revisions_included: string | null; revisions_used: number | null;
  payment_structure: string | null; structure_timing: string | null;
  structure_timing_set_date: string | null; structure_upfront_pct: number | null;
  structure_balance_timing: string | null; structure_months: number | null;
  structure_start_date: string | null;
}

export interface DealExtrasRow { id: string; deal_id: string; kind: "bonus" | "commission"; amount: number | null; condition: string | null; rate: number | null; on_text: string | null; earned: boolean; }

export interface PaymentRow {
  id: string; deal_id: string | null; amount: number; expected_date: string | null;
  status: string; notes: string | null; invoice_state: string | null;
  pay_status: string | null; bonus_confirmed: boolean | null;
  deal?: { id: string; brand: string } | null;
}

export interface ContentRow {
  id: string; linked_deal_id: string | null; title: string; platform: string | null;
  post_type: string | null; status: string | null; event_date: string | null;
  caption: string | null; notes: string | null; repeat_type: string | null;
  repeat_until: string | null; scheduled_time: string | null; media_refs: unknown;
}

export interface TodoRow {
  id: string; title: string; done: boolean; due_date: string | null;
  start_time: string | null; end_time: string | null; created_at: string;
}

export interface IdeaRow {
  id: string; title: string; stage: string | null; notes: string | null;
  platform: string | null; status: string; tags: unknown; refs: unknown;
  linked_deal_id: string | null; created_at: string; updated_at: string;
}

export interface NoteRow { id: string; body: string; event_date: string | null; done: boolean; }

export interface ProfileRow {
  id: string; handler: string | null; accent: string | null; plan: string;
  plan_status: string | null; trial_end: string | null; head_font: string | null;
  avatar_url: string | null; theme_mode: string | null; theme: string | null;
  mode: string | null; sidebar: string | null; onboarding_step: number | null;
  tour_seen: boolean | null; notify_calendar_inapp: boolean | null;
  digest_enabled: boolean | null; platforms: unknown; deal_volume: string | null;
}

/* --------------------------- page fetches ------------------------- */

export async function fetchOverview(supabase: SupabaseClient) {
  const [deals, payments, content, todos, notes] = await Promise.all([
    supabase.from("deals").select("*").order("created_at", { ascending: false }),
    supabase.from("payments").select("*, deal:deals(id, brand)").order("expected_date", { ascending: true }),
    supabase.from("content").select("*").order("event_date", { ascending: true }),
    supabase.from("todos").select("*"),
    supabase.from("notes").select("id, body, event_date, done"),
  ]);
  return {
    deals: (deals.data ?? []) as DealRow[],
    payments: (payments.data ?? []) as PaymentRow[],
    content: (content.data ?? []) as ContentRow[],
    todos: (todos.data ?? []) as TodoRow[],
    notes: (notes.data ?? []) as NoteRow[],
  };
}

export async function fetchDealsPage(supabase: SupabaseClient) {
  const [deals, payments, extras, content] = await Promise.all([
    supabase.from("deals").select("*").order("created_at", { ascending: false }),
    supabase.from("payments").select("*, deal:deals(id, brand)"),
    supabase.from("deal_extras").select("*"),
    supabase.from("content").select("id, linked_deal_id, title, event_date, post_type, platform, status"),
  ]);
  return {
    deals: (deals.data ?? []) as DealRow[],
    payments: (payments.data ?? []) as PaymentRow[],
    extras: (extras.data ?? []) as DealExtrasRow[],
    content: (content.data ?? []) as ContentRow[],
  };
}

export async function fetchPaymentsPage(supabase: SupabaseClient) {
  const [payments, deals] = await Promise.all([
    supabase.from("payments").select("*, deal:deals(id, brand)").order("expected_date", { ascending: true }),
    supabase.from("deals").select("id, brand, value, status, active, due_date"),
  ]);
  return {
    payments: (payments.data ?? []) as PaymentRow[],
    deals: (deals.data ?? []) as Pick<DealRow, "id" | "brand" | "value" | "status" | "active" | "due_date">[],
  };
}

export async function fetchCalendar(supabase: SupabaseClient) {
  const [content, payments, todos, notes, deals] = await Promise.all([
    supabase.from("content").select("*, deal:deals(id, brand)"),
    supabase.from("payments").select("*, deal:deals(id, brand)"),
    supabase.from("todos").select("*"),
    supabase.from("notes").select("id, body, event_date, done"),
    supabase.from("deals").select("id, brand, value, due_date, active"),
  ]);
  return {
    content: (content.data ?? []) as ContentRow[],
    payments: (payments.data ?? []) as PaymentRow[],
    todos: (todos.data ?? []) as TodoRow[],
    notes: (notes.data ?? []) as NoteRow[],
    deals: (deals.data ?? []) as Pick<DealRow, "id" | "brand" | "value" | "due_date" | "active">[],
  };
}

export async function fetchTodosPage(supabase: SupabaseClient) {
  const [todos, deals, notes] = await Promise.all([
    supabase.from("todos").select("*").order("created_at", { ascending: true }),
    supabase.from("deals").select("id, brand, status").eq("active", true).not("status", "eq", "archived"),
    supabase.from("notes").select("id, body, event_date, done"),
  ]);
  return {
    todos: (todos.data ?? []) as TodoRow[],
    deals: (deals.data ?? []) as Pick<DealRow, "id" | "brand" | "status">[],
    notes: (notes.data ?? []) as NoteRow[],
  };
}

export async function fetchIdeas(supabase: SupabaseClient) {
  const [ideas, deals] = await Promise.all([
    supabase.from("ideas").select("*").order("created_at", { ascending: false }),
    supabase.from("deals").select("id, brand").eq("active", true).not("status", "eq", "archived"),
  ]);
  return {
    ideas: (ideas.data ?? []) as IdeaRow[],
    deals: (deals.data ?? []) as Pick<DealRow, "id" | "brand">[],
  };
}

export async function fetchSettings(supabase: SupabaseClient) {
  const [profile, notion] = await Promise.all([
    supabase.from("profiles").select("*").maybeSingle(),
    supabase.from("notion_connections").select("workspace_name, workspace_id, notion_user_id").maybeSingle(),
  ]);
  return {
    profile: (profile.data ?? null) as ProfileRow | null,
    notion: notion.data as { workspace_name: string | null; workspace_id: string | null; notion_user_id: string | null } | null,
  };
}
