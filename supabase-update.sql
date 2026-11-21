-- GrosMall update: run once in Supabase > SQL Editor (after the first supabase.sql)
alter table profiles add column if not exists seller_status text default 'pending' check (seller_status in ('pending','approved','rejected'));
update profiles set seller_status='approved' where role in ('seller','admin');          -- existing sellers stay active
create or replace function my_status() returns text language sql security definer stable set search_path=public as $$ select seller_status from profiles where id=auth.uid() $$;
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into profiles(id,email,full_name,phone,city,role,seller_status) values(new.id,new.email,new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'phone',new.raw_user_meta_data->>'city',
  case when new.raw_user_meta_data->>'role'='seller' then 'seller' else 'buyer' end,'pending'); return new; end $$;
-- users cannot change their own role or approval status
drop policy if exists p_upd on profiles;
create policy p_upd on profiles for update using (id=auth.uid()) with check (role=my_role() and seller_status is not distinct from my_status());
-- safety net: a missing profile can be created by its owner (buyer/seller only, always pending)
drop policy if exists p_ins on profiles;
create policy p_ins on profiles for insert with check (id=auth.uid() and role in ('buyer','seller') and seller_status='pending');
-- only approved sellers can publish
drop policy if exists pr_ins on products;
create policy pr_ins on products for insert with check (seller_id=auth.uid() and exists(select 1 from profiles where id=auth.uid() and role='seller' and seller_status='approved'));
-- account deletion (Google Play requirement)
create or replace function delete_my_account() returns void language plpgsql security definer set search_path=public,auth as $$ begin delete from auth.users where id=auth.uid(); end $$;
revoke all on function delete_my_account() from public, anon; grant execute on function delete_my_account() to authenticated;
-- create profiles for users who signed up before the schema existed (fixes "always buyer")
insert into profiles(id,email,role,seller_status) select id,email,'buyer','pending' from auth.users on conflict (id) do nothing;
