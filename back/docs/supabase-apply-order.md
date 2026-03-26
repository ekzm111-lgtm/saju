# Supabase 적용 순서

운영 DB에 반영할 때는 아래 순서를 권장한다.

## 1. 기본 스키마 적용

먼저 아래 파일을 실행한다.

- `docs/supabase-schema.sql`

적용 목적

- 테이블 생성
- 결제 관련 컬럼 생성
- 기본 RLS 활성화

## 2. 시드 데이터 적용

다음으로 아래 파일을 실행한다.

- `docs/supabase-seed.sql`

적용 목적

- 초기 관리자 계정
- 기본 서비스 3종
- 테스트 결제/후기 데이터

## 3. 운영용 RLS 적용

개발 확인이 끝난 뒤 아래 파일을 실행한다.

- `docs/supabase-rls-production.sql`

적용 목적

- `auth.uid()` 기반 역할 분리
- `super_admin`, `admin`, `viewer` 권한 구분
- 운영용 읽기/쓰기 제한

주의

- 이 단계 전에 `admins.auth_user_id`를 실제 Supabase Auth 사용자와 연결해야 한다.

## 4. 관리자 계정 연결

`admins` 테이블에서 초기 관리자 계정의 `auth_user_id`를 실제 로그인 사용자 UUID로 업데이트한다.

예시 흐름

1. Supabase Auth에서 관리자 사용자 생성
2. 해당 사용자 UUID 확인
3. `admins.auth_user_id`에 매핑

## 5. 환경변수 점검

아래 값이 필요하다.

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `PORTONE_API_SECRET`
- `NEXT_PUBLIC_PORTONE_STORE_ID`
- `NEXT_PUBLIC_PORTONE_CHANNEL_KEY`

## 6. 운영 전 최종 확인

- 관리자 로그인 성공 여부
- `/admin` 접근 권한
- 서비스 저장/비활성화
- 결제 생성 후 `payments` 저장 확인
- 결제 승인 후 `portone_payment_id` 저장 확인
- 환불 후 `status`, `refund_reason`, `refunded_at` 반영 확인
- 후기 노출 토글 확인

