-- Webhook 처리 상태 디버깅

-- 1. 최근 Webhook 로그 (상태별)
SELECT 
  id,
  type,
  status,
  error_message,
  garmin_user_id,
  created_at,
  processed_at
FROM webhook_logs
ORDER BY created_at DESC
LIMIT 10;

-- 2. 실패한 Webhook 확인
SELECT 
  id,
  type,
  status,
  error_message,
  retry_count,
  garmin_user_id,
  created_at
FROM webhook_logs
WHERE status = 'failed' OR error_message IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;

-- 3. 특정 garminUserId로 connection 확인
SELECT 
  user_id,
  garmin_user_id,
  needs_reauth,
  created_at
FROM garmin_connections
WHERE garmin_user_id = '782422b07d4a84aa9c7a3fced59ee45c';

-- 4. garmin_activities 테이블 상태
SELECT 
  COUNT(*) as total_count,
  COUNT(DISTINCT user_id) as unique_users,
  MAX(created_at) as latest_created,
  MIN(created_at) as earliest_created
FROM garmin_activities;

-- 5. 활동이 있는지 확인
SELECT 
  garmin_activity_id,
  activity_name,
  activity_type,
  user_id,
  created_at
FROM garmin_activities
ORDER BY created_at DESC
LIMIT 5;

