-- Garmin 데이터 확인 스크립트
-- user_id: FEsfOEqLldvoLCteXUKP6cy6uWMVuNjx

-- 1. 연결 상태 확인
SELECT 
  user_id,
  garmin_user_id,
  needs_reauth,
  token_expires_at,
  created_at,
  updated_at
FROM garmin_connections
WHERE user_id = 'FEsfOEqLldvoLCteXUKP6cy6uWMVuNjx';

-- 2. 활동 데이터 확인
SELECT 
  COUNT(*) as total_activities,
  MIN(start_time) as earliest_activity,
  MAX(start_time) as latest_activity,
  MAX(created_at) as last_synced
FROM garmin_activities
WHERE user_id = 'FEsfOEqLldvoLCteXUKP6cy6uWMVuNjx';

-- 3. 최근 활동 5개 확인
SELECT 
  activity_name,
  activity_type,
  start_time,
  duration_seconds,
  distance_meters,
  calories,
  steps,
  created_at
FROM garmin_activities
WHERE user_id = 'FEsfOEqLldvoLCteXUKP6cy6uWMVuNjx'
ORDER BY start_time DESC
LIMIT 5;

-- 4. Webhook 로그 확인
SELECT 
  type,
  status,
  garmin_user_id,
  created_at,
  processed_at,
  error_message
FROM webhook_logs
WHERE garmin_user_id IN (
  SELECT garmin_user_id 
  FROM garmin_connections 
  WHERE user_id = 'FEsfOEqLldvoLCteXUKP6cy6uWMVuNjx'
)
ORDER BY created_at DESC
LIMIT 10;

