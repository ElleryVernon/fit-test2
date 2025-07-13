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
