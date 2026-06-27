-- LUMINA — visitor contact messages. Run in the Supabase SQL editor once
-- (after schema.sql). Inserts happen via the service-role API route, so no
-- anon insert policy is needed; owners read their own messages.

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) on delete cascade,
  portfolio_slug text not null,
  name text,
  email text,
  message text not null,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "Owners read their own messages"
  on public.messages for select
  using (auth.uid() = owner_id);

create policy "Owners delete their own messages"
  on public.messages for delete
  using (auth.uid() = owner_id);

create index if not exists messages_owner_idx
  on public.messages (owner_id, created_at desc);
