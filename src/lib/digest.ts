import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import type { DigestItem } from "@/emails/daily-digest";

const pad = (n: number) => String(n).padStart(2, "0");
export function isoFor(d: Date): string {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}
export function isoForLocal(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export type DayDigest = {
  payments: DigestItem[];
  deliverables: DigestItem[];
  posts: DigestItem[];
  todos: DigestItem[];
  reminders: DigestItem[];
  total: number;
};

/** Get the user's items for one day, RLS-scoped via the service client. */
export async function getDayItems(userId: string, iso: string): Promise<DayDigest> {
  const supabase = createServiceClient();
  const payments: DigestItem[] = [];
  const deliverables: DigestItem[] = [];
  const posts: DigestItem[] = [];
  const todos: DigestItem[] = [];
  const reminders: DigestItem[] = [];

  const [payRes, dealRes, postRes, todoRes, reminderRes] = await Promise.all([
    supabase
      .from("payments")
      .select("amount, expected_date, status, deal:deals(brand, due_date)")
      .eq("user_id", userId)
      .eq("expected_date", iso),
    supabase
      .from("deals")
      .select("brand, due_date, deliverable")
      .eq("user_id", userId)
      .eq("due_date", iso),
    supabase
      .from("content")
      .select("title, platform")
      .eq("user_id", userId)
      .eq("event_date", iso),
    supabase
      .from("todos")
      .select("title, due_date, done")
      .eq("user_id", userId)
      .eq("due_date", iso),
    supabase
      .from("nudges")
      .select("id, subject, deal_id, payment_id")
      .eq("user_id", userId)
      .eq("status", "ready"),
  ]);

  for (const p of (payRes.data ?? []) as { amount: number; expected_date: string | null; status: string; deal: { brand: string }[] | null }[]) {
    if (p.status === "received") continue;
    const deal = (p.deal && p.deal[0]) || null;
    const brand = deal?.brand ?? "Payment";
    // Expected today: amber "due". (Only today's rows are returned, so none can be past-due here.)
    payments.push({ kind: "payment", label: `${brand} payment expected`, brand, amount: p.amount, status: "due" });
  }

  for (const d of (dealRes.data ?? []) as { brand: string; due_date: string | null; deliverable: string | null }[]) {
    deliverables.push({ kind: "deliverable", label: `${d.brand} deliverable due`, brand: d.brand, detail: d.deliverable ?? undefined });
  }

  for (const c of (postRes.data ?? []) as { title: string; platform: string | null }[]) {
    posts.push({ kind: "post", label: c.title, platform: c.platform ?? undefined });
  }

  for (const t of (todoRes.data ?? []) as { title: string; done: boolean }[]) {
    if (t.done) continue;
    todos.push({ kind: "todo", label: t.title });
  }

  for (const r of (reminderRes.data ?? []) as { subject: string }[]) {
    reminders.push({ kind: "todo", label: r.subject || "A payment reminder is ready" });
  }

  const total = payments.length + deliverables.length + posts.length + todos.length + reminders.length;
  return { payments, deliverables, posts, todos, reminders, total };
}

export function summaryLine(total: number, handler: string): string {
  const firstName = (handler || "there").replace(/[_-]/g, " ").split(" ")[0];
  if (total === 0) return `Nothing scheduled for today, ${firstName}. Enjoy the quiet.`;
  if (total === 1) return `You've got 1 thing on your plate today, ${firstName}.`;
  return `You've got ${total} things on your plate today, ${firstName}.`;
}