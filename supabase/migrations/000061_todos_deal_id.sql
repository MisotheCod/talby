-- ============================================================
-- 000061_todos_deal_id.sql
-- Additive: link a to-do to a deal so the to-do can show which
-- brand it belongs to ("Open the deal"). The board sends the deal
-- brand name; we resolve it to deals.id on todo.create.
-- FK is set-null on deal delete so a to-do survives the deal.
-- ============================================================
alter table public.todos
  add column if not exists deal_id uuid references public.deals(id) on delete set null;

create index if not exists todos_deal_id_idx on public.todos (deal_id);
