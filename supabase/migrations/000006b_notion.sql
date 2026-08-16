-- ============================================================
-- TALBY — Notion connection (import source), migration 000006
-- Public OAuth integration. Each user connects their OWN Notion
-- account; token is stored server-side, scoped to the user, and
-- never exposed to the client. Mirrors gmail_connections.
-- ============================================================

create table if not exists public.notion_connections (
  user_id uuid primary key references auth.users(id) on delete cascade,
  access_token text,           -- server-only; Notion tokens are long-lived (no refresh)
  workspace_name text,         -- e.g. "Acme's workspace"
  workspace_id text,
  bot_id text,
  notion_user_id text,         -- the connecting user (owner.user.id)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notion_connections enable row level security;

create policy "notion_select_own" on public.notion_connections
  for select using (auth.uid() = user_id);
create policy "notion_insert_own" on public.notion_connections
  for insert with check (auth.uid() = user_id);
create policy "notion_update_own" on public.notion_connections
  for update using (auth.uid() = user_id);
create policy "notion_delete_own" on public.notion_connections
  for delete using (auth.uid() = user_id);