-- 000060_deals_import_key.sql
-- Add a stable per-import key so CSV/import dedupe does not key on brand alone
-- (a creator can have several real deals under one brand — brand-keyed skip would
-- wrongly drop the second). import_key = hash(normalized brand + amount + post date)
-- for CSV rows; same pattern as notion_page_id. The unique index makes "import the
-- same file twice adds nothing" durable even across concurrent imports.
alter table public.deals add column if not exists import_key text;
create unique index if not exists deals_user_import_key_idx
  on public.deals (user_id, import_key)
  where import_key is not null;
