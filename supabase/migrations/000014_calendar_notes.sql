-- Calendar notes: allow pinning a note to a specific day on the calendar.
alter table public.notes
  add column if not exists event_date date;

create index if not exists notes_event_date_idx on public.notes (user_id, event_date);