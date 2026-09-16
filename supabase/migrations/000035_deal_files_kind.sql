-- 000035: distinguish deal file kinds so an invoice can be identified and
-- extracted without guessing from the filename.
-- kind values: 'contract' | 'invoice' | 'other'. Set at upload (user-picked,
-- defaulted from extraction only when the extractor is confident — never a
-- silent filename guess). Backfill existing rows to 'other' (we cannot know
-- what an already-uploaded file is without inspecting it).
alter table public.deal_files
  add column if not exists kind text not null default 'other'
    check (kind in ('contract','invoice','other'));