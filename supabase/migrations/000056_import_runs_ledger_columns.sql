-- 000056_import_runs_ledger_columns.sql
--
-- WHY THIS EXISTS (found by checking production's schema, not assuming):
-- production ALREADY has an older `import_runs` table:
--   added, error, failed, finished_at, id, idempotency_key, payments, posts,
--   source, source_name, started_at, status, updated, user_id
-- It has NO total / imported / skipped.
--
-- So 000053's `create table if not exists public.import_runs (...)` is a NO-OP on
-- production, and applying it there would NOT create the missing columns. The
-- import routes write total/imported/skipped when they finish a run, so without
-- this every run row would silently stay status='running' with no totals — the
-- import itself still works, the ledger lies.
--
-- Additive and safe: three new integer columns with defaults, so every existing
-- row stays valid and nothing is rewritten.

alter table public.import_runs add column if not exists total    integer not null default 0;
alter table public.import_runs add column if not exists imported integer not null default 0;
alter table public.import_runs add column if not exists skipped  integer not null default 0;

-- production's version of this table already has `status` (default 'running');
-- the branch's copy does not, so add it there too. The routes now set it on the
-- way out, so a finished run reads 'done' on BOTH schemas instead of lying as
-- 'running' forever.
alter table public.import_runs add column if not exists status text not null default 'done';

-- The routes finish a run by flipping status, so keep it honest:
-- a run with a finished_at but still 'running' means a crash between the two.
create index if not exists import_runs_status_idx on public.import_runs (status, started_at desc);
