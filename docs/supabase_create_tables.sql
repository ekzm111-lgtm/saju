-- =========================================================
-- AI Fortune 서비스 - 통합 Supabase DB 테이블 생성 SQL
-- Supabase > SQL Editor에 붙여넣고 실행하세요
-- =========================================================

-- 1. 관리자 테이블
create table if not exists public.admins (
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

-- 2. 서비스 목록 테이블
create table if not exists public.services (
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

-- 3. 결제 및 분석 결과 저장 테이블 (핵심)
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  service_id uuid references public.services(id) on delete set null,
  service_name_snapshot text not null,
  buyer_name text,
  buyer_email text,
  buyer_phone text,
  amount integer not null,
  payment_method text not null,
  status text not null,
  portone_payment_id text,
  portone_transaction_id text,
  refund_reason text,
  result_link text,
  result_json jsonb,
  approved_at timestamptz,
  refunded_at timestamptz,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. 리뷰 테이블
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid references public.payments(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  author_name text not null,
  rating integer,
  content text not null,
  is_visible_on_landing boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- RLS 설정 및 정책
alter table public.admins enable row level security;
alter table public.services enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.fortune_results enable row level security;
alter table public.fortune_contacts enable row level security;

-- 모든 사용자 조회 가능 정책 (샘플)
create policy "allow_anon_select_services" on public.services for select using (true);
create policy "allow_anon_insert_payments" on public.payments for insert with check (true);
create policy "allow_anon_select_payments" on public.payments for select using (true);
create policy "allow_anon_update_payments" on public.payments for update using (true);

-- 기본 서비스 데이터 삽입
INSERT INTO public.services (slug, name, display_name, price, is_popular)
VALUES
  ('basic',   '오늘의 운세', '기본 사주분석', 3900, false),
  ('premium', '프리미엄 사주', '2026 정밀 신년운세', 9900, true),
  ('couple',  '커플 궁합', '인연/궁합 심층분석', 14900, false),
  ('name',    '이름 풀이', '성명학 기운분석', 6900, false)
ON CONFLICT (slug) DO NOTHING;

-- 5. 문의하기(fortune_contacts) 테이블 생성 및 권한 설정
create table if not exists public.fortune_contacts (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text,
  created_at timestamptz not null default now()
);

-- 익명 사용자(anon)도 문의를 남길 수 있도록 Insert 허용 정책
create policy "allow_anon_insert_contacts" on public.fortune_contacts for insert with check (true);
create policy "allow_anon_select_contacts" on public.fortune_contacts for select using (true);

-- 6. 통합 결과 저장(fortune_results) 테이블 (Admin 대시보드용)
create table if not exists public.fortune_results (
  id uuid primary key default gen_random_uuid(),
  user_email text,
  user_name text,
  user_phone text,
  service_type text,
  payment_id text,
  result_json jsonb,
  created_at timestamptz not null default now()
);

create policy "allow_anon_insert_fortune_results" on public.fortune_results for insert with check (true);
create policy "allow_anon_select_fortune_results" on public.fortune_results for select using (true);
