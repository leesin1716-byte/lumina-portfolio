-- LUMINA billing — run AFTER schema.sql, in the Supabase SQL editor.
-- Adds columns to store the TossPayments billing key for recurring charges.

alter table public.profiles
  add column if not exists billing_key text,
  add column if not exists customer_key text,
  add column if not exists subscription_status text default 'inactive',
  add column if not exists current_period_end timestamptz;
