-- LUMINA SaaS — run this in the Supabase SQL editor once.
-- (Project → SQL Editor → New query → paste → Run)

-- ── profiles: one row per auth user ──────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);
create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- ── portfolios: the user's editable, hostable portfolio ───────────────────────
create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text unique not null,
  data jsonb not null default '{}'::jsonb,
  theme text default 'dark',
  published boolean default false,
  custom_domain text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.portfolios enable row level security;

create policy "Published portfolios are public, owners see their own"
  on public.portfolios for select
  using (published = true or auth.uid() = user_id);
create policy "Users manage their own portfolios"
  on public.portfolios for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists portfolios_user_id_idx on public.portfolios (user_id);

-- ── auto-create a profile + starter portfolio on signup ──────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  base_slug text;
begin
  base_slug := regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9_-]', '', 'g');
  insert into public.profiles (id, username) values (new.id, base_slug);
  insert into public.portfolios (user_id, slug, data)
    values (new.id, base_slug || '-' || substr(new.id::text, 1, 6), '{}'::jsonb);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
