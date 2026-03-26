# PortOne 연동 준비 메모

현재 결제 페이지는 실제 PortOne 키 없이도 흐름을 확인할 수 있도록 모의 결제 기반으로 구성했다.

실제 연동 시 권장 순서

1. 브라우저 SDK 설치
2. 서버에서 주문 정보 생성
3. 브라우저에서 결제 요청
4. 서버에서 PortOne 결제 검증
5. 승인 완료 후 결과 페이지 이동

현재 코드 기준 연결 포인트

- 결제 폼 상태: `lib/payment.ts`
- 결제 화면: `components/payment-page.tsx`
- 결과 이동 경로 생성: `buildResultQuery`
- PortOne 요청 데이터 초안: `createMockPaymentRequest`
- 주문 준비 API: `app/api/payments/prepare/route.ts`
- 결제 확정 API: `app/api/payments/confirm/route.ts`
- 환불 준비 API: `app/api/payments/refund/route.ts`
- 서버 환불 준비 유틸: `lib/portone-server.ts`
- 공식 서버 SDK: `@portone/server-sdk`
- webhook 상태 반영 유틸: `updatePaymentFromWebhook`

실제 환경변수 예시

- `NEXT_PUBLIC_PORTONE_STORE_ID`
- `NEXT_PUBLIC_PORTONE_CHANNEL_KEY`

공식 문서 기준 참고 포인트

- 브라우저 SDK 패키지: `@portone/browser-sdk`
- 서버 SDK 패키지: `@portone/server-sdk`
- 브라우저 결제 요청은 `requestPayment` 기준

실제 연동 시 주의사항

- 프론트 성공 응답만 믿지 말고 서버에서 다시 검증
- 결제 승인 후 결과 페이지 접근 토큰 또는 주문 검증 필요
- 환불은 반드시 서버에서만 처리
- 실제 환불 API 연동 시 `PORTONE_API_SECRET` 기반 서버 검증 로직 추가 필요
- 공식 SDK 기준 `PaymentClient({ secret }).cancelPayment(...)` 흐름으로 연결하도록 준비됨
- webhook 수신 시 `orderId` 또는 `portone_payment_id` 기준으로 `payments` 상태를 갱신하도록 준비됨
