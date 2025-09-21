import { supabaseAdmin } from '@/lib/supabase/client'
import { GarminWebhookPayload, WebhookLog } from '@/lib/supabase/types'
import { fetchActivityDetails } from './api'
import { WEBHOOK_TYPES } from './constants'

// Webhook 로그 저장
export async function saveWebhookLog(
  type: string,
  payload: GarminWebhookPayload
): Promise<WebhookLog> {
  const { data, error } = await supabaseAdmin
    .from('webhook_logs')
    .insert({
      type,
      garmin_user_id: payload.userId,
      summary_id: payload.summaryId,
      file_type: payload.fileType,
      callback_url: payload.callbackURL,
      payload,
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// 활동 데이터 저장/업데이트
export async function saveActivity(
  garminUserId: string,
  activityData: any,
  isManual: boolean = false,
  isAutoDetected: boolean = false
) {
  // 1. 사용자 연결 정보 찾기 (이제 user_id는 직접 auth.users.id)
  const { data: connection, error: connError } = await supabaseAdmin
    .from('garmin_connections')
    .select('user_id')
    .eq('garmin_user_id', garminUserId)
    .single()

  if (connError || !connection) {
    throw new Error(`Garmin connection not found for user: ${garminUserId}`)
  }

  // 2. 활동 데이터 변환
  const activityRecord = {
    user_id: connection.user_id,
    garmin_activity_id: activityData.activityId || activityData.summaryId,
    activity_name: activityData.activityName,
    activity_type: activityData.activityType || 'other',
    start_time: new Date(activityData.startTimeInSeconds * 1000).toISOString(),
    end_time: activityData.endTimeInSeconds 
      ? new Date(activityData.endTimeInSeconds * 1000).toISOString()
      : null,
    duration_seconds: activityData.durationInSeconds,
    distance_meters: activityData.distanceInMeters,
    calories: activityData.activeKilocalories || activityData.calories,
    avg_heart_rate: activityData.averageHeartRateInBeatsPerMinute,
    max_heart_rate: activityData.maxHeartRateInBeatsPerMinute,
    min_heart_rate: activityData.minHeartRateInBeatsPerMinute,
    steps: activityData.steps,
    floors_climbed: activityData.floorsClimbed,
    intensity_minutes: activityData.moderateIntensityMinutes,
    stress_level: activityData.averageStressLevel,
    is_manual: isManual,
    is_auto_detected: isAutoDetected,
    raw_data: activityData,
    updated_at: new Date().toISOString()
  }

  // 3. Upsert (있으면 업데이트, 없으면 생성)
  const { data, error } = await supabaseAdmin
    .from('garmin_activities')
    .upsert(activityRecord, {
      onConflict: 'garmin_activity_id'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Webhook 처리
export async function processWebhook(webhookId: string) {
  // 1. Webhook 로그 조회
  const { data: webhook, error: fetchError } = await supabaseAdmin
    .from('webhook_logs')
    .select('*')
    .eq('id', webhookId)
    .single()

  if (fetchError || !webhook) {
    console.error('Webhook not found:', webhookId)
    return
  }

  if (webhook.status !== 'pending') {
    console.log('Webhook already processed:', webhookId)
    return
  }

  try {
    // 2. 처리 시작
    await supabaseAdmin
      .from('webhook_logs')
      .update({ status: 'processing' })
      .eq('id', webhookId)

    const payload = webhook.payload as GarminWebhookPayload

    // 3. Webhook 타입별 처리
    switch (webhook.type) {
      case WEBHOOK_TYPES.ACTIVITIES:
      case WEBHOOK_TYPES.ACTIVITY_DETAILS:
        if (payload.summaryId) {
          const activityData = await fetchActivityDetails(
            payload.summaryId,
            payload.userAccessToken
          )
          await saveActivity(payload.userId, activityData)
        }
        break

      case WEBHOOK_TYPES.MANUAL_ACTIVITIES:
        if (payload.summaryId) {
          const activityData = await fetchActivityDetails(
            payload.summaryId,
            payload.userAccessToken
          )
          await saveActivity(payload.userId, activityData, true, false)
        }
        break

      case WEBHOOK_TYPES.MOVEIQ:
        if (payload.summaryId) {
          const activityData = await fetchActivityDetails(
            payload.summaryId,
            payload.userAccessToken
          )
          await saveActivity(payload.userId, activityData, false, true)
        }
        break

      case WEBHOOK_TYPES.ACTIVITY_FILES:
        // FIT 파일 처리는 별도 구현 필요
        console.log('Activity file webhook:', payload)
        break

      case WEBHOOK_TYPES.DEREGISTRATIONS:
        // 사용자 연결 해제
        await supabaseAdmin
          .from('garmin_connections')
          .delete()
          .eq('garmin_user_id', payload.userId)
        break

      case WEBHOOK_TYPES.PERMISSIONS:
        // 권한 변경 처리
        await supabaseAdmin
          .from('garmin_connections')
          .update({ 
            needs_reauth: true,
            updated_at: new Date().toISOString()
          })
          .eq('garmin_user_id', payload.userId)
        break
    }

    // 4. 성공 처리
    await supabaseAdmin
      .from('webhook_logs')
      .update({ 
        status: 'success',
        processed_at: new Date().toISOString()
      })
      .eq('id', webhookId)

  } catch (error) {
    console.error('Webhook processing error:', error)
    
    // 5. 실패 처리
    await supabaseAdmin
      .from('webhook_logs')
      .update({ 
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        retry_count: webhook.retry_count + 1
      })
      .eq('id', webhookId)
    
    throw error
  }
}

// Webhook 검증 (Garmin은 서명 검증을 제공하지 않으므로 기본 검증만 수행)
export function verifyWebhookPayload(payload: any): boolean {
  // 기본적인 payload 구조 검증
  if (!payload || typeof payload !== 'object') {
    return false
  }

  // 필수 필드 확인
  if (!payload.userId) {
    console.error('Webhook payload missing userId')
    return false
  }

  // 추가 검증 로직을 여기에 추가할 수 있습니다
  // 예: IP 화이트리스트, 타임스탬프 검증 등

  return true
}