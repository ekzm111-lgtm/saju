insert into admins (name, email, role, status)
values
  ('슈퍼관리자', 'admin@example.com', 'super_admin', 'active')
on conflict (email) do nothing;

insert into admins (name, email, role, status)
values
  ('운영관리자', 'operator@example.com', 'admin', 'active'),
  ('조회전용', 'viewer@example.com', 'viewer', 'active')
on conflict (email) do nothing;

insert into services (slug, name, display_name, description, price, status, is_popular)
values
  (
    'general-flow',
    '총운 리포트',
    '총운 리포트',
    '오늘의 흐름과 전반적인 운세를 간결하게 정리합니다.',
    9900,
    'active',
    false
  ),
  (
    'love-deep',
    '연애운 심층 해석',
    '연애운 심층 해석',
    '관계 흐름, 감정선, 타이밍까지 깊이 있게 읽어드립니다.',
    19900,
    'active',
    true
  ),
  (
    'wealth-insight',
    '재물운 분석',
    '재물운 분석',
    '금전 흐름과 유의할 시기를 중심으로 살펴봅니다.',
    14900,
    'active',
    false
  )
on conflict (slug) do update set
  name = excluded.name,
  display_name = excluded.display_name,
  description = excluded.description,
  price = excluded.price,
  status = excluded.status,
  is_popular = excluded.is_popular;

insert into payments (
  order_id,
  service_name_snapshot,
  buyer_name,
  buyer_email,
  amount,
  payment_method,
  status,
  portone_payment_id,
  portone_transaction_id,
  result_link,
  raw_payload
)
values
  (
    'seed-order-001',
    '연애운 심층 해석',
    '김OO',
    'kim@example.com',
    19900,
    'CARD',
    'paid',
    'seed-payment-001',
    'seed-tx-001',
    '/result?service=love-deep&name=%EA%B9%80OO',
    '{"question":"연애운이 궁금해요.","serviceSlug":"love-deep","paymentId":"seed-payment-001"}'::jsonb
  ),
  (
    'seed-order-002',
    '재물운 분석',
    '박OO',
    'park@example.com',
    14900,
    'KAKAOPAY',
    'ready',
    'seed-payment-002',
    'seed-tx-002',
    '/result?service=wealth-insight&name=%EB%B0%95OO',
    '{"question":"재물 흐름이 궁금해요.","serviceSlug":"wealth-insight","paymentId":"seed-payment-002"}'::jsonb
  )
on conflict (order_id) do nothing;

insert into reviews (
  author_name,
  content,
  rating,
  is_visible_on_landing
)
values
  (
    '김OO',
    '생각보다 해석이 섬세했고, 모바일에서도 읽기 편했습니다.',
    5,
    true
  ),
  (
    '이OO',
    '결제 후 바로 확인되는 흐름이 좋아서 다시 이용하고 싶습니다.',
    4,
    false
  );
