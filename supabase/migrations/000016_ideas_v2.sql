-- 000016: Ideas v2 — capture field + filters + detail modal + turn-into-deal.
-- Extends the ideas table for the new model (tags, references, linked deal)
-- and migrates the old stage/status values to the new status vocabulary.

-- Drop the old status check first so we can remap values without violating it.
alter table public.ideas drop constraint if exists ideas_status_check;

-- Add the new columns (idempotent; ok if partially applied earlier).
alter table public.ideas
  add column if not exists tags jsonb not null default '[]'::jsonb,
  add column if not exists refs jsonb not null default '[]'::jsonb,
  add column if not exists linked_deal_id uuid references public.deals(id) on delete set null;

-- Migrate old idea statuses (stage / status) to the new vocabulary.
--   bucket/developing      -> unsorted
--   ready                  -> pitch-ready
--   executed               -> parked
--   archived               -> archived
update public.ideas set status = case
  when status in ('bucket', 'developing') then 'unsorted'
  when status = 'ready' then 'pitch-ready'
  when status = 'executed' then 'parked'
  else status
end;

-- Enforce the new vocabulary.
alter table public.ideas add constraint ideas_status_check
  check (status in ('unsorted','pitch-ready','parked','archived'));