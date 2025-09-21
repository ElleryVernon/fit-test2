import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { fetchGarminUserId } from '@/lib/services/garmin/oauth'

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
      .select('access_token, garmin_user_id')
      .eq('user_id', userId)
      .single()

    if (error || !connection) {
      return NextResponse.json(
        { error: 'No Garmin connection found' },
        { status: 404 }
      )
    }

    // 이미 저장된 Garmin User ID가 있으면 반환
    if (connection.garmin_user_id) {
      return NextResponse.json({
        garmin_user_id: connection.garmin_user_id
      })
    }

    // 없으면 Garmin API에서 조회
    try {
      const garminUserId = await fetchGarminUserId(connection.access_token)

      // DB에 저장
      await supabaseAdmin
        .from('garmin_connections')
        .update({ garmin_user_id: garminUserId })
        .eq('user_id', userId)

      return NextResponse.json({
        garmin_user_id: garminUserId
      })
    } catch (apiError) {
      console.error('Failed to fetch Garmin user ID:', apiError)
      return NextResponse.json(
        { error: 'Failed to fetch Garmin user ID' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('User ID endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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