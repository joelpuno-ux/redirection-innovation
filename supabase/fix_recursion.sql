-- ============================================================================
-- Redirection Innovation Inc. — FIX: "infinite recursion detected in policy
-- for relation admin_users"
--
-- ROOT CAUSE: ang dating policy ng admin_users ay nagrereference sa sarili
-- niyang table (exists (select 1 from admin_users ...)) → tuwing ine-evaluate
-- ni Postgres ang policy, binubuksan ulit niya ang parehong table → parehong
-- policy ulit → infinite recursion. Kaya kahit ang sales_transactions at
-- financial_records queries ay bumabagsak (ang policies nila ay bumubukas ng
-- admin_users).
--
-- FIX: SECURITY DEFINER function na public.is_admin() — tumatakbo ito bilang
-- table owner (bypass RLS sa loob) kaya WALANG recursion. Lahat ng policies
-- ay nakabase na rito.
--
-- SAAN I-RUN: Supabase Dashboard → SQL Editor → New query → i-paste → Run
-- Idempotent: safe i-run nang paulit-ulit. Walang kailangang redeploy sa
-- Netlify — server-side (database) fix lamang ito.
-- ============================================================================

-- 1) Membership check function (security definer = bypass RLS internally) ----
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

-- Higpitan ang function: authenticated lang ang pwedeng tumawag
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- 2) I-recreate ang lahat ng policies gamit ang is_admin() (walang recursion) -
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

-- 3) VERIFY: dapat tatlong policies lang ang lumabas, lahat ay
--    "using (public.is_admin())"
select tablename, policyname, cmd, roles, qual
from pg_policies
where schemaname = 'public'
  and tablename in ('admin_users', 'sales_transactions', 'financial_records')
order by tablename;

-- 4) VERIFY ng membership: dapat may row ang bawat rehistradong admin
select email, role, created_at from public.admin_users order by created_at;