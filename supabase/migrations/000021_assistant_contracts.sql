-- 000021: Talby Assistant contract storage + retrieval.
-- Stores the full extracted contract text per deal and per-deal chunk embeddings
-- for grounded Q&A. Every row carries user_id and is RLS-scoped to its owner.
-- Contract text dies with the deal (privacy: no orphaned PII).

create extension if not exists vector;

-- Full contract text (user-scoped, server-written; never exposed to other users).
create table if not exists public.deal_contracts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deal_id uuid not null references public.deals(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);
create index if not exists deal_contracts_user_idx on public.deal_contracts (user_id);
create index if not exists deal_contracts_deal_idx on public.deal_contracts (deal_id);

alter table public.deal_contracts enable row level security;
create policy "deal_contracts_select_own" on public.deal_contracts
  for select using (auth.uid() = user_id);
create policy "deal_contracts_insert_own" on public.deal_contracts
  for insert with check (auth.uid() = user_id);
create policy "deal_contracts_delete_own" on public.deal_contracts
  for delete using (auth.uid() = user_id);

-- Embedding chunks, one row per chunk of a contract, ordered by chunk_idx.
-- embedding is a float vector(1536) produced server-side (never client-supplied).
create table if not exists public.contract_chunks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deal_id uuid not null references public.deals(id) on delete cascade,
  chunk_idx int not null,
  content text not null,
  embedding vector(1536),
  created_at timestamptz not null default now()
);
create index if not exists contract_chunks_user_idx on public.contract_chunks (user_id);
create index if not exists contract_chunks_deal_idx on public.contract_chunks (deal_id);
create index if not exists contract_chunks_embed_idx on public.contract_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

alter table public.contract_chunks enable row level security;

create policy "contract_chunks_select_own" on public.contract_chunks
  for select using (auth.uid() = user_id);
create policy "contract_chunks_insert_own" on public.contract_chunks
  for insert with check (auth.uid() = user_id);
create policy "contract_chunks_delete_own" on public.contract_chunks
  for delete using (auth.uid() = user_id);

-- Semantic retrieval over the caller's own chunks only. The function enforces
-- match_user_id = auth.uid() so a user can never retrieve another user's text,
-- even if the RPC were called with a foreign id. Returns the top-K by cosine.
--
-- HARD INVARIANT (per-account isolation): the WHERE clause below MUST bind to
-- auth.uid() and MUST ignore the caller-supplied match_user_id argument. If this
-- is ever "simplified" to filter on match_user_id, cross-user contract retrieval
-- becomes possible and the assistant's privacy boundary is broken. Do NOT change
-- the auth.uid() binding. (See INVARIANTS note in src/lib/assistant-ai.ts.)
create or replace function public.match_contract_chunks(
  query_embedding vector(1536),
  match_user_id uuid,
  match_count int
)
returns table (id uuid, deal_id uuid, chunk_idx int, content text, similarity real)
language sql stable
as $$
  select cc.id, cc.deal_id, cc.chunk_idx, cc.content,
         1 - (cc.embedding <=> query_embedding) as similarity
  from public.contract_chunks cc
  where cc.user_id = auth.uid()          -- bound to the caller, never the arg
    and cc.embedding is not null
  order by cc.embedding <=> query_embedding
  limit match_count;
$$;