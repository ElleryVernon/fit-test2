import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { fetchGarminPermissions } from '@/lib/services/garmin/oauth'

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
      .select('access_token, scopes')
      .eq('user_id', userId)
      .single()

    if (error || !connection) {
      return NextResponse.json(
        { error: 'No Garmin connection found' },
        { status: 404 }
      )
    }

    // 이미 저장된 권한이 있으면 반환
    if (connection.scopes && connection.scopes.length > 0) {
      return NextResponse.json({
        permissions: connection.scopes,
        source: 'cached'
      })
    }

    // 없으면 Garmin API에서 실시간 조회
    try {
      const permissions = await fetchGarminPermissions(connection.access_token)

      // DB에 저장
      await supabaseAdmin
        .from('garmin_connections')
        .update({
          scopes: permissions,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      return NextResponse.json({
        permissions: permissions,
        source: 'live'
      })
    } catch (apiError) {
      console.error('Failed to fetch Garmin permissions:', apiError)
      return NextResponse.json(
        { error: 'Failed to fetch permissions' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Permissions endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// OPTIONS 요청 처리 (CORS)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}