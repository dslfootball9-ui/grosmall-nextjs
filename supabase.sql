-- GrosMall schema + security (run once in Supabase > SQL Editor)
create table profiles(id uuid primary key references auth.users on delete cascade, email text, full_name text,
  role text not null default 'buyer' check (role in ('admin','seller','buyer')), phone text, city text, created_at timestamptz default now());
create table categories(id uuid primary key default gen_random_uuid(), name text not null, image text, created_at timestamptz default now());
create table products(id uuid primary key default gen_random_uuid(), seller_id uuid references profiles(id) on delete cascade, category_id uuid references categories(id) on delete set null,
  name text not null, description text, price numeric not null, wholesale_price numeric, stock int default 0, unit text default 'kg' check (unit in ('kg','box','pack')),
  image_url text, is_active boolean default true, created_at timestamptz default now());
create table orders(id uuid primary key default gen_random_uuid(), buyer_id uuid references profiles(id) on delete cascade, seller_id uuid references profiles(id) on delete set null,
  total numeric not null, status text default 'pending' check (status in ('pending','confirmed','delivered','cancelled')), delivery_address text, phone text, created_at timestamptz default now());
create table order_items(id uuid primary key default gen_random_uuid(), order_id uuid references orders(id) on delete cascade, product_id uuid references products(id) on delete set null,
  quantity int not null, price numeric not null);

-- helpers (security definer avoids RLS recursion)
create function my_role() returns text language sql security definer stable set search_path=public as $$ select role from profiles where id=auth.uid() $$;
create function is_admin() returns boolean language sql security definer stable set search_path=public as $$ select coalesce(my_role()='admin',false) $$;
-- auto-create profile on signup; admin can never be chosen at signup
create function handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into profiles(id,email,full_name,phone,city,role) values(new.id,new.email,new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'phone',new.raw_user_meta_data->>'city',
  case when new.raw_user_meta_data->>'role'='seller' then 'seller' else 'buyer' end); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

alter table profiles enable row level security; alter table categories enable row level security; alter table products enable row level security;
alter table orders enable row level security; alter table order_items enable row level security;
create policy p_read on profiles for select using (id=auth.uid() or is_admin());
create policy p_upd on profiles for update using (id=auth.uid()) with check (role=my_role());   -- users cannot change their own role
create policy p_admin on profiles for all using (is_admin()) with check (is_admin());
create policy c_read on categories for select using (true);
create policy c_admin on categories for all using (is_admin()) with check (is_admin());
create policy pr_read on products for select using (is_active or seller_id=auth.uid() or is_admin());
create policy pr_ins on products for insert with check (seller_id=auth.uid() and my_role() in ('seller','admin'));
create policy pr_upd on products for update using (seller_id=auth.uid()) with check (seller_id=auth.uid());
create policy pr_del on products for delete using (seller_id=auth.uid());
create policy pr_admin on products for all using (is_admin()) with check (is_admin());
create policy o_read on orders for select using (buyer_id=auth.uid() or seller_id=auth.uid() or is_admin());
create policy o_ins on orders for insert with check (buyer_id=auth.uid());
create policy o_upd on orders for update using (seller_id=auth.uid() or is_admin());
create policy oi_read on order_items for select using (exists(select 1 from orders o where o.id=order_id and (o.buyer_id=auth.uid() or o.seller_id=auth.uid() or is_admin())));
create policy oi_ins on order_items for insert with check (exists(select 1 from orders o where o.id=order_id and o.buyer_id=auth.uid()));

insert into categories(name) values ('Épicerie'),('Huiles & Beurre'),('Céréales & Farines'),('Boissons'),('Produits laitiers'),('Fruits & Légumes'),('Thé, Café & Sucre'),('Conserves');
-- After your first signup, make yourself admin:
-- update profiles set role='admin' where email='YOUR_EMAIL';
