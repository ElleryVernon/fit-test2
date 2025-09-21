import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    // 연결 정보 조회
    const { data: connection, error } = await supabaseAdmin
      .from('garmin_connections')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error || !connection) {
      // 연결이 없는 경우
      return NextResponse.json({
        connected: false,
        message: 'No Garmin connection found'
      })
    }

    // 최근 활동 수 조회
    const { count: activityCount } = await supabaseAdmin
      .from('garmin_activities')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    // 토큰 만료 체크 (필요한 경우)
    const tokenExpired = connection.token_expires_at
      ? new Date(connection.token_expires_at) < new Date()
      : false

    return NextResponse.json({
      connected: true,
      garmin_user_id: connection.garmin_user_id,
      needs_reauth: connection.needs_reauth || tokenExpired,
      scopes: connection.scopes,
      connected_at: connection.created_at,
      last_updated: connection.updated_at,
      recent_activities: activityCount || 0
    })

  } catch (error) {
    console.error('Connection status error:', error)
    return NextResponse.json(
      { error: 'Failed to check connection status' },
      { status: 500 }
    )
  }
}

// OPTIONS 요청 처리 (CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}