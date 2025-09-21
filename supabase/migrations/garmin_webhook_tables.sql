-- 1. 기존 테이블 삭제 (있는 경우)
DROP TABLE IF EXISTS webhook_logs CASCADE;
DROP TABLE IF EXISTS garmin_activities CASCADE;
DROP TABLE IF EXISTS garmin_connections CASCADE;

-- 2. Garmin 연결 정보 테이블 (기존 users 테이블 참조)
CREATE TABLE garmin_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  garmin_user_id TEXT UNIQUE NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  scopes TEXT[], -- 허용된 권한 목록
  needs_reauth BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 운동 활동 테이블 (기존 users 테이블 참조)
CREATE TABLE garmin_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  garmin_activity_id TEXT UNIQUE NOT NULL,
  activity_name TEXT,
  activity_type TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_seconds INTEGER,
  distance_meters REAL,
  calories INTEGER,
  avg_heart_rate INTEGER,
  max_heart_rate INTEGER,
  min_heart_rate INTEGER,
  steps INTEGER,
  floors_climbed INTEGER,
  intensity_minutes INTEGER,
  stress_level INTEGER,
  is_manual BOOLEAN DEFAULT FALSE,
  is_auto_detected BOOLEAN DEFAULT FALSE,
  file_url TEXT, -- FIT 파일 URL
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Webhook 로그 테이블
CREATE TABLE webhook_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- activities, activity-details, etc.
  garmin_user_id TEXT,
  summary_id TEXT,
  file_type TEXT, -- FIT, TCX, GPX
  callback_url TEXT,
  payload JSONB,
  status TEXT DEFAULT 'pending', -- pending, processing, success, failed
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 인덱스 생성
CREATE INDEX idx_garmin_connections_user_id ON garmin_connections(user_id);
CREATE INDEX idx_garmin_connections_garmin_user_id ON garmin_connections(garmin_user_id);
CREATE INDEX idx_garmin_activities_user_id ON garmin_activities(user_id);
CREATE INDEX idx_garmin_activities_start_time ON garmin_activities(start_time DESC);
CREATE INDEX idx_garmin_activities_activity_type ON garmin_activities(activity_type);
CREATE INDEX idx_webhook_logs_status ON webhook_logs(status);
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs(created_at DESC);

-- 6. RLS (Row Level Security) 설정 - 기본 비활성화 (기존 users 테이블 방식 사용)
-- 현재는 서버사이드에서 webhook만 처리하므로 RLS 불필요
-- 추후 클라이언트에서 직접 접근이 필요할 때 활성화

-- ALTER TABLE garmin_connections ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE garmin_activities ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 조회 가능 (추후 활성화 예정)
-- CREATE POLICY "Users can view own connections" ON garmin_connections
--   FOR SELECT USING (user_id = current_user_id());

-- CREATE POLICY "Users can view own activities" ON garmin_activities
--   FOR SELECT USING (user_id = current_user_id());

-- 7. 통계 함수
CREATE OR REPLACE FUNCTION get_activity_stats(
  p_user_id UUID,
  p_days INTEGER DEFAULT 7
)
RETURNS JSON AS $$
DECLARE
  v_start_date TIMESTAMPTZ;
BEGIN
  v_start_date := NOW() - (p_days || ' days')::INTERVAL;
  
  RETURN json_build_object(
    'total_activities', (
      SELECT COUNT(*) FROM garmin_activities 
      WHERE user_id = p_user_id AND start_time >= v_start_date
    ),
    'total_distance_km', (
      SELECT ROUND(COALESCE(SUM(distance_meters), 0) / 1000, 2) 
      FROM garmin_activities 
      WHERE user_id = p_user_id AND start_time >= v_start_date
    ),
    'total_calories', (
      SELECT COALESCE(SUM(calories), 0) 
      FROM garmin_activities 
      WHERE user_id = p_user_id AND start_time >= v_start_date
    ),
    'total_duration_hours', (
      SELECT ROUND(COALESCE(SUM(duration_seconds), 0) / 3600.0, 2) 
      FROM garmin_activities 
      WHERE user_id = p_user_id AND start_time >= v_start_date
    ),
    'avg_heart_rate', (
      SELECT ROUND(AVG(avg_heart_rate)) 
      FROM garmin_activities 
      WHERE user_id = p_user_id 
      AND start_time >= v_start_date 
      AND avg_heart_rate IS NOT NULL
    ),
    'activities_by_type', (
      SELECT json_object_agg(activity_type, count) 
      FROM (
        SELECT activity_type, COUNT(*) as count 
        FROM garmin_activities 
        WHERE user_id = p_user_id AND start_time >= v_start_date 
        GROUP BY activity_type
      ) t
    ),
    'daily_activities', (
      SELECT json_agg(daily ORDER BY day DESC) 
      FROM (
        SELECT 
          DATE(start_time) as day,
          COUNT(*) as activities,
          ROUND(SUM(distance_meters) / 1000, 2) as distance_km,
          SUM(calories) as calories
        FROM garmin_activities 
        WHERE user_id = p_user_id AND start_time >= v_start_date
        GROUP BY DATE(start_time)
      ) daily
    )
  );
END;
$$ LANGUAGE plpgsql;