# Webhook Security Notes

현재 프로젝트에는 PortOne webhook 수신 경로가 있다.

- 경로: `app/api/portone/webhook/route.ts`

운영 적용 전 체크리스트

1. PortOne 공식 문서 기준의 webhook 인증 또는 서명 검증 방식을 확인한다.
2. 검증 가능한 헤더, secret, 또는 재조회 검증 절차를 서버 코드에 추가한다.
3. webhook payload만 신뢰하지 말고, 가능하면 PortOne 서버 API로 결제 상태를 재조회한다.
4. 상태 변경 전 `orderId` 또는 `portone_payment_id`가 실제 내부 주문과 일치하는지 확인한다.
5. 재시도 webhook에 대비해 멱등 처리한다.

현재 코드 상태

- webhook 수신 후 `orderId` 또는 `portone_payment_id` 기준으로 내부 결제 상태를 갱신한다.
- 그러나 공식적으로 확인된 서명 검증 절차는 아직 코드에 반영하지 않았다.

이유

- 공식 PortOne 문서에서 현재 프로젝트에 바로 적용 가능한 webhook 서명 검증 절차를 확인하지 못한 상태에서
  추측 구현을 넣으면 오히려 잘못된 보안 로직이 될 수 있기 때문이다.

