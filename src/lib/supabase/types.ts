export interface GarminConnection {
  id: string
  user_id: string
  garmin_user_id: string
  access_token: string
  refresh_token: string | null
  token_expires_at: string | null
  scopes: string[]
  needs_reauth: boolean
  created_at: string
  updated_at: string
}

export interface GarminActivity {
  id: string
  user_id: string
  garmin_activity_id: string
  activity_name: string | null
  activity_type: string
  start_time: string
  end_time: string | null
  duration_seconds: number | null
  distance_meters: number | null
  calories: number | null
  avg_heart_rate: number | null
  max_heart_rate: number | null
  min_heart_rate: number | null
  steps: number | null
  floors_climbed: number | null
  intensity_minutes: number | null
  stress_level: number | null
  is_manual: boolean
  is_auto_detected: boolean
  file_url: string | null
  raw_data: any
  created_at: string
  updated_at: string
}

export interface WebhookLog {
  id: string
  type: string
  garmin_user_id: string | null
  summary_id: string | null
  file_type: string | null
  callback_url: string | null
  payload: any
  status: 'pending' | 'processing' | 'success' | 'failed'
  error_message: string | null
  retry_count: number
  processed_at: string | null
  created_at: string
}

export interface GarminWebhookPayload {
  userId: string
  userAccessToken: string
  summaryId?: string
  fileType?: string
  callbackURL?: string
  startTimeInSeconds?: number
  endTimeInSeconds?: number
  uploadStartTimeInSeconds?: number
  uploadEndTimeInSeconds?: number
}