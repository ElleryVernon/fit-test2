-- ========================================
-- 구글 로그인 성능 최적화를 위한 인덱스 추가
-- ========================================
-- 
-- 목적: OAuth 로그인 시 5-10초 걸리던 처리 시간을 1-2초로 단축
-- 
-- 적용 방법:
-- psql -h [your-host] -U [your-user] -d [your-db] -f add_performance_indexes.sql
--

-- 1. users 테이블 인덱스
-- email, googleId, appleId로 자주 조회하므로 인덱스 추가
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
CREATE INDEX IF NOT EXISTS "users_google_id_idx" ON "users"("google_id");
CREATE INDEX IF NOT EXISTS "users_apple_id_idx" ON "users"("apple_id");

-- 2. sessions 테이블 인덱스  
-- 세션 검증 시 userId, token, expiresAt으로 자주 조회
CREATE INDEX IF NOT EXISTS "sessions_user_id_idx" ON "sessions"("user_id");
CREATE INDEX IF NOT EXISTS "sessions_token_idx" ON "sessions"("token");
CREATE INDEX IF NOT EXISTS "sessions_expires_at_idx" ON "sessions"("expires_at");

-- 3. accounts 테이블 인덱스
-- OAuth 제공자별 계정 조회 최적화
CREATE INDEX IF NOT EXISTS "accounts_user_id_idx" ON "accounts"("user_id");
CREATE INDEX IF NOT EXISTS "accounts_provider_id_account_id_idx" ON "accounts"("provider_id", "account_id");

-- 인덱스 적용 확인
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'sessions', 'accounts')
ORDER BY tablename, indexname;

