import { supabaseAdmin } from '@/lib/supabase/client'

// 기존 users 테이블 방식으로 사용자 정보 조회
export async function getUserById(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Failed to get user:', error)
    return null
  }
  
  return data
}

// 이메일로 사용자 찾기
export async function getUserByEmail(email: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single()
  
  if (error) {
    console.error('Failed to get user by email:', error)
    return null
  }
  
  return data
}

// Garmin 연결 정보 저장 (기존 users 테이블 ID 사용)
export async function saveGarminConnection(
  userId: string,
  garminUserId: string,
  accessToken: string,
  refreshToken: string | null = null,
  scopes: string[] = []
) {
  const { data, error } = await supabaseAdmin
    .from('garmin_connections')
    .upsert({
      user_id: userId, // 기존 users.id 사용
      garmin_user_id: garminUserId,
      access_token: accessToken,
      refresh_token: refreshToken,
      scopes,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// 사용자의 Garmin 연결 정보 조회
export async function getGarminConnection(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('garmin_connections')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) {
    console.error('Failed to get Garmin connection:', error)
    return null
  }
  
  return data
}

// 사용자의 활동 통계 조회
export async function getUserActivityStats(userId: string, days: number = 7) {
  const { data, error } = await supabaseAdmin
    .rpc('get_activity_stats', { 
      p_user_id: userId, 
      p_days: days 
    })
  
  if (error) {
    console.error('Failed to get activity stats:', error)
    return null
  }
  
  return data
}