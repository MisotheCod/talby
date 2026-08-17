-- To-dos: optional from-until time block on each to-do (start_time .. end_time).
alter table public.todos
  add column if not exists start_time time,
  add column if not exists end_time time;