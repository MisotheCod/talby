-- Nudge template storage: per-user custom templates (jsonb, keyed by step).
alter table public.profiles
  add column if not exists nudge_templates jsonb;
