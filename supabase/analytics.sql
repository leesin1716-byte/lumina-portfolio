-- LUMINA analytics — run AFTER schema.sql in the Supabase SQL editor.
-- Adds a view counter to portfolios + an increment RPC.

alter table public.portfolios
  add column if not exists views bigint not null default 0;

create or replace function public.increment_portfolio_views(p_slug text)
returns void language sql security definer set search_path = public as $$
  update public.portfolios set views = views + 1
  where slug = p_slug and published = true;
$$;
