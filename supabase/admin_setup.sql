-- ============================================================================
-- Redirection Innovation Inc. — Admin Console / Book of Accounts setup
-- PAANO: Supabase Dashboard → SQL Editor → New query → i-paste ito → Run
-- ============================================================================

-- 1) ADMIN USERS (server-side allowlist; dito nakabase ang RLS policies) -----
create table if not exists public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

-- 2) SALES / TRANSACTION SUMMARIES --------------------------------------------
create table if not exists public.sales_transactions (
  id uuid primary key default gen_random_uuid(),
  order_code text,
  merchant_name text,
  barangay text,
  gross_amount numeric(12,2) not null default 0,
  commission_rate numeric(5,2) not null default 10,
  commission_amount numeric(12,2) not null default 0,
  net_amount numeric(12,2) not null default 0,
  payment_method text,
  status text not null default 'completed',
  transaction_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- 3) BOOK OF ACCOUNTS LEDGER ---------------------------------------------------
create table if not exists public.financial_records (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null default current_date,
  account_code text not null,
  account_name text not null,
  category text not null default 'Operating',
  description text,
  reference text,
  debit numeric(14,2) not null default 0,
  credit numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

-- ROW LEVEL SECURITY: admin-only read; walang client writes; anon = zero ------
alter table public.admin_users enable row level security;
alter table public.sales_transactions enable row level security;
alter table public.financial_records enable row level security;

-- Membership check function. SECURITY DEFINER: tumatakbo bilang table owner
-- kaya ang select sa loob ay hindi dumadaan sa RLS — iniiwasan nito ang
-- "infinite recursion detected in policy for relation admin_users" na bug
-- kapag ang policy ay direktang nagrereference sa sarili niyang table.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users a
    where a.id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "admins can read admin_users" on public.admin_users;
create policy "admins can read admin_users" on public.admin_users
  for select to authenticated
  using (public.is_admin());

drop policy if exists "admins can read sales_transactions" on public.sales_transactions;
create policy "admins can read sales_transactions" on public.sales_transactions
  for select to authenticated
  using (public.is_admin());

drop policy if exists "admins can read financial_records" on public.financial_records;
create policy "admins can read financial_records" on public.financial_records
  for select to authenticated
  using (public.is_admin());

-- Explicit grants: anon role = walang access; authenticated = via policies lang
revoke all on public.admin_users, public.sales_transactions, public.financial_records from anon;
grant select on public.admin_users, public.sales_transactions, public.financial_records to authenticated;

-- Indexes para sa dashboard queries
create index if not exists sales_transactions_date_idx on public.sales_transactions (transaction_date desc);
create index if not exists financial_records_date_idx on public.financial_records (entry_date desc);

-- ============================================================================
-- 4) I-REGISTER ANG MGA ADMIN LOGIN
--    Step A: Supabase Dashboard → Authentication → Users → "Add user"
--            (email + password, at i-check ang "Auto Confirm User") para sa BAWAT email
--    Step B: i-run ang insert na ito (idempotent; full version + status report
--            ay nasa supabase/register_admins.sql):
-- ============================================================================
insert into public.admin_users (id, email)
select u.id, u.email
from auth.users u
where lower(u.email) in (
  'support@redirectioninnovation.com',
  'lucy_puno@redirectioninnovation.com',
  'joel_puno@redirectioninnovation.com',
  'eliezelmendoza@redirectioninnovation.com'
)
on conflict (id) do update set
  email = excluded.email,
  role = 'admin';

-- ============================================================================
-- OPTIONAL: sample Book of Accounts entries para makita ang dashboard layout
-- (burahin o i-update pagkatapos ng testing)
-- ============================================================================
-- insert into public.financial_records (entry_date, account_code, account_name, category, description, reference, debit, credit) values
--   (current_date, '1000', 'Cash on Hand', 'Assets', 'Opening balance', 'BOA-0001', 50000, 0),
--   (current_date, '4000', 'Commission Revenue', 'Revenue', 'Kabyaw Eats commissions', 'BOA-0002', 0, 12500),
--   (current_date, '6000', 'Rider Payouts', 'Expenses', 'Weekly rider settlements', 'BOA-0003', 8200, 0);