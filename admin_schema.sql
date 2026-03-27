CREATE TABLE IF NOT EXISTS public.admins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  login_id text NOT NULL UNIQUE,
  password text NOT NULL,
  name text,
  email text,
  tel text,
  role text DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- 초기 슈퍼 관리자 계정 생성 (중복 방지)
INSERT INTO public.admins (login_id, password, name, email, tel, role)
VALUES ('1111', '1111', '슈퍼 최고관리자', 'admin@memoryfortune.com', '010-0000-0000', 'super_admin')
ON CONFLICT (login_id) DO NOTHING;
