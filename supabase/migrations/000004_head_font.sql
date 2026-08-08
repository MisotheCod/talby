-- Heading font selection (themeable), default Lexend.
alter table public.profiles
  add column if not exists head_font text not null default 'Lexend';
