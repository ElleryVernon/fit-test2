-- pgcrypto 확장 활성화 (UUID 생성에 필요)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 데모 요청 테이블 스키마
CREATE TABLE IF NOT EXISTS demo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  your_name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  origin TEXT NOT NULL DEFAULT 'unknown',
  requested_at TIMESTAMP DEFAULT now()
);

-- 인덱스 생성 (이메일 및 요청 시간 기준 검색 최적화)
CREATE INDEX IF NOT EXISTS idx_demo_requests_email ON demo_requests(email);
CREATE INDEX IF NOT EXISTS idx_demo_requests_requested_at ON demo_requests(requested_at);

-- 권한 설정: 서비스 롤만 접근 가능하도록 설정
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- 정책 생성: 서비스 롤만 모든 작업 가능
CREATE POLICY "Service role can do all operations on demo_requests"
  ON demo_requests
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 주석: 이 테이블은 웹사이트의 데모 요청 정보를 저장합니다.
-- 각 요청은 회사명, 이름, 이메일, 메시지, 출처 정보를 포함합니다.
-- 'origin' 필드는 요청이 어디서 왔는지 추적하는 데 사용됩니다.
-- 예: 'main-landing', 'demo-page', 'blog', 등

-- =========================================================================

-- 뉴스레터 구독자 테이블 스키마
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  referrer TEXT,
  origin TEXT NOT NULL,
  subscribed_at TIMESTAMP DEFAULT now()
);

-- 인덱스 생성 (이메일 및 구독 시간 기준 검색 최적화)
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at ON newsletter_subscribers(subscribed_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_origin ON newsletter_subscribers(origin);

-- 권한 설정: 서비스 롤만 접근 가능하도록 설정
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 정책 생성: 서비스 롤만 모든 작업 가능
CREATE POLICY "Service role can do all operations on newsletter_subscribers"
  ON newsletter_subscribers
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 주석: 이 테이블은 웹사이트의 뉴스레터 구독자 정보를 저장합니다.
-- 각 구독은 이메일, 리퍼러, 출처 정보를 포함합니다.
-- 'referrer' 필드는 사용자가 어떤 경로로 왔는지 추적합니다 (URL 파라미터에서 추출).
-- 'origin' 필드는 구독 폼이 어디에 위치했는지 추적합니다 (예: 'footer', 'popup', 'landing-page').
-- 이메일은 UNIQUE 제약조건이 있어 중복 구독을 방지합니다.

-- =========================================================================

-- 서비스 타입 테이블
CREATE TABLE IF NOT EXISTS service_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- 초기 서비스 타입 데이터 삽입
INSERT INTO service_types (name, description) VALUES
  ('studio_program', '스튜디오 프로그램 서비스')
ON CONFLICT (name) DO NOTHING;

-- =========================================================================

-- 구독 플랜 테이블
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type_id uuid REFERENCES service_types(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  currency TEXT DEFAULT 'KRW',
  billing_cycle TEXT DEFAULT 'monthly',
  features JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- 초기 구독 플랜 데이터 삽입
INSERT INTO subscription_plans (service_type_id, code, name, price, description)
SELECT 
  st.id,
  'studio_standard',
  '스튜디오 스탠다드',
  99000,
  '스튜디오 프로그램 기본 플랜'
FROM service_types st
WHERE st.name = 'studio_program'
ON CONFLICT (code) DO NOTHING;

-- =========================================================================

-- 구독 정보 테이블
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  plan_id uuid REFERENCES subscription_plans(id) ON DELETE SET NULL,
  service_type_id uuid REFERENCES service_types(id) ON DELETE SET NULL,
  reference_id TEXT,
  reference_name TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'expired', 'pending')),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  auto_renew BOOLEAN DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_reference_id ON subscriptions(reference_id);

-- =========================================================================

-- 결제 정보 테이블
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  user_id TEXT NOT NULL,
  payment_key TEXT NOT NULL UNIQUE,
  order_id TEXT NOT NULL UNIQUE,
  order_name TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'KRW',
  payment_method TEXT,
  status TEXT NOT NULL,
  card_type TEXT,
  owner_type TEXT,
  approve_no TEXT,
  payment_date TIMESTAMP,
  billing_cycle TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_key ON payments(payment_key);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- =========================================================================

-- 권한 설정: 서비스 롤만 접근 가능하도록 설정
ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 정책 생성: 서비스 롤만 모든 작업 가능
CREATE POLICY "Service role can do all operations on service_types"
  ON service_types
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can do all operations on subscription_plans"
  ON subscription_plans
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can do all operations on subscriptions"
  ON subscriptions
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can do all operations on payments"
  ON payments
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
