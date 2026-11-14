-- ============================================================================
-- Redirection Innovation Inc. — PAG-REGISTER NG MGA ADMIN CONSOLE USERS
-- Saan i-run: Supabase Dashboard → SQL Editor → New query → i-paste → Run
--
-- PREREQUISITE:
--   1. Na-run na ang supabase/admin_setup.sql (tables + RLS policies)
--   2. Bawat email sa listahan ay na-create na sa:
--      Supabase Dashboard → Authentication → Users → "Add user"
--      (ilagay ang email + password, at NAKA-CHECK ang "Auto Confirm User")
-- ============================================================================

-- 1) I-register ang lahat ng approved admin email sa public.admin_users.
--    Idempotent: safe i-run nang paulit-ulit. Ang mga email na WALA pang
--    auth account ay laktawan — tingnan ang status report sa baba.
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

-- 2) STATUS REPORT: dapat 'OK' ang auth_account at admin_users_row sa lahat.
--    Kapag 'MISSING' ang isang email: i-create muna ang user sa
--    Authentication → Users (Auto Confirm naka-check), pagkatapos ay
--    i-run ulit ang buong script na ito.
with expected(email) as (
  values
    ('support@redirectioninnovation.com'),
    ('lucy_puno@redirectioninnovation.com'),
    ('joel_puno@redirectioninnovation.com'),
    ('eliezelmendoza@redirectioninnovation.com')
)
select
  e.email,
  case when u.id is not null then 'OK'
       else 'MISSING - i-create muna sa Authentication > Users' end as auth_account,
  case when a.id is not null then 'OK' else 'NOT REGISTERED' end as admin_users_row
from expected e
left join auth.users u on lower(u.email) = e.email
left join public.admin_users a on lower(a.email) = e.email
order by e.email;