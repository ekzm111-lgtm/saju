create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  name text not null,
  email text not null unique,
  role text not null check (role in ('super_admin', 'admin', 'viewer')),
  status text not null default 'active' check (status in ('active', 'inactive')),
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  display_name text not null,
  description text,
  price integer not null,
  status text not null default 'active',
  is_popular boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  service_id uuid references services(id) on delete set null,
  service_name_snapshot text not null,
  buyer_name text,
  buyer_email text,
  amount integer not null,
  payment_method text not null,
  status text not null,
  portone_payment_id text,
  portone_transaction_id text,
  refund_reason text,
  result_link text,
  approved_at timestamptz,
  refunded_at timestamptz,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid references payments(id) on delete set null,
  service_id uuid references services(id) on delete set null,
  author_name text not null,
  rating integer,
  content text not null,
  is_visible_on_landing boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table admins enable row level security;
alter table services enable row level security;
alter table payments enable row level security;
alter table reviews enable row level security;

create policy if not exists "admins_can_read_admins"
on admins
for select
using (true);

create policy if not exists "admins_can_manage_services"
on services
for all
using (true)
with check (true);

create policy if not exists "admins_can_manage_payments"
on payments
for all
using (true)
with check (true);

create policy if not exists "admins_can_manage_reviews"
on reviews
for all
using (true)
with check (true);

alter table payments add column if not exists portone_payment_id text;
alter table payments add column if not exists portone_transaction_id text;
alter table payments add column if not exists refund_reason text;
