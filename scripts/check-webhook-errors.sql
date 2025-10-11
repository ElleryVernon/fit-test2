-- Webhook 에러 로그 확인
-- 최근 실패한 Webhook 확인

SELECT 
  id,
  type,
  garmin_user_id,
  status,
  error_message,
  retry_count,
  created_at,
  processed_at,
  payload->>'userId' as webhook_user_id
FROM webhook_logs
WHERE status IN ('failed', 'processing')
  OR error_message IS NOT NULL
ORDER BY created_at DESC
LIMIT 20;

-- Activity Details Webhook 확인
SELECT 
  id,
  type,
  garmin_user_id,
  status,
  error_message,
  created_at,
  processed_at,
  jsonb_array_length(payload->'activityDetails') as activity_count
FROM webhook_logs
WHERE type = 'activity-details'
ORDER BY created_at DESC
LIMIT 10;

-- 특정 사용자의 Garmin Connection 확인
SELECT 
  user_id,
  garmin_user_id,
  needs_reauth,
  created_at
FROM garmin_connections
WHERE garmin_user_id = '782422b07d4a84aa9c7a3fced59ee45c';

