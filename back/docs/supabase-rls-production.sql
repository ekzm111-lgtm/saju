-- 운영용 RLS 예시
-- 전제:
-- 1. Supabase Auth 사용자와 admins.auth_user_id가 연결되어 있어야 함
-- 2. role 값은 super_admin / admin / viewer 중 하나여야 함

create or replace function public.current_admin_role()
returns text
language sql
stable
as $$
  select role
  from public.admins
  where auth_user_id = auth.uid()
    and status = 'active'
  limit 1
$$;

create or replace function public.is_active_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admins
    where auth_user_id = auth.uid()
      and status = 'active'
  )
$$;

drop policy if exists "admins_can_read_admins" on public.admins;
drop policy if exists "admins_can_manage_services" on public.services;
drop policy if exists "admins_can_manage_payments" on public.payments;
drop policy if exists "admins_can_manage_reviews" on public.reviews;

create policy "admins_select_self_or_super"
on public.admins
for select
using (
  public.current_admin_role() = 'super_admin'
  or auth_user_id = auth.uid()
);

create policy "super_admin_manage_admins"
on public.admins
for all
using (public.current_admin_role() = 'super_admin')
with check (public.current_admin_role() = 'super_admin');

create policy "active_admins_read_services"
on public.services
for select
using (public.is_active_admin());

create policy "admins_manage_services"
on public.services
for insert
with check (public.current_admin_role() in ('super_admin', 'admin'));

create policy "admins_update_services"
on public.services
for update
using (public.current_admin_role() in ('super_admin', 'admin'))
with check (public.current_admin_role() in ('super_admin', 'admin'));

create policy "active_admins_read_payments"
on public.payments
for select
using (public.is_active_admin());

create policy "admins_update_payments"
on public.payments
for update
using (public.current_admin_role() in ('super_admin', 'admin'))
with check (public.current_admin_role() in ('super_admin', 'admin'));

create policy "active_admins_read_reviews"
on public.reviews
for select
using (public.is_active_admin());

create policy "admins_manage_reviews"
on public.reviews
for update
using (public.current_admin_role() in ('super_admin', 'admin'))
with check (public.current_admin_role() in ('super_admin', 'admin'));

