-- Allow to-dos to show on the calendar: add an optional due date.
alter table public.todos
  add column if not exists due_date date;
