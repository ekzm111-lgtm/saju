-- =========================================================
-- AI Fortune 서비스 - 보안 정책(RLS Rules) 통합 설정 SQL
-- 연결이 안 될 때 이 코드를 SQL Editor에서 실행하세요.
-- =========================================================

-- 모든 테이블 RLS 활성화
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 1. 서비스(services) 테이블 룰
-- 누구나 조회 가능
DROP POLICY IF EXISTS "services_select_policy" ON public.services;
CREATE POLICY "services_select_policy" ON public.services FOR SELECT USING (true);

-- 2. 결제(payments) 테이블 룰 (핵심!)
-- 누구나 입력(결제 시도), 조회(결과 확인), 수정(결과 업데이트) 가능하도록 설정
DROP POLICY IF EXISTS "payments_all_policy" ON public.payments;
CREATE POLICY "payments_all_policy" ON public.payments 
FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);

-- 3. 리뷰(reviews) 테이블 룰
-- 누구나 조회 및 입력 가능
DROP POLICY IF EXISTS "reviews_all_policy" ON public.reviews;
CREATE POLICY "reviews_all_policy" ON public.reviews FOR ALL USING (true) WITH CHECK (true);

-- 4. 관리자(admins) 테이블 룰
-- 일단 관리자 페이지 조회를 위해 전체 허용 (운영 시 강화 필요)
DROP POLICY IF EXISTS "admins_all_policy" ON public.admins;
CREATE POLICY "admins_all_policy" ON public.admins FOR ALL USING (true) WITH CHECK (true);
