import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, keep_data = false } = body

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    // 1. 연결 정보 조회
    const { data: connection, error: fetchError } = await supabaseAdmin
      .from('garmin_connections')
      .select('*')
      .eq('user_id', user_id)
      .single()

    if (fetchError || !connection) {
      return NextResponse.json(
        { error: 'No Garmin connection found' },
        { status: 404 }
      )
    }

    // 2. Garmin API에 연결 해제 요청 (선택적 - Garmin API가 지원하는 경우)
    // 실제 Garmin API에서 토큰 무효화 엔드포인트가 있다면 여기서 호출
    // await revokeGarminToken(connection.access_token)

    // 3. 연결 정보 삭제
    const { error: deleteConnError } = await supabaseAdmin
      .from('garmin_connections')
      .delete()
      .eq('user_id', user_id)

    if (deleteConnError) {
      throw deleteConnError
    }

    // 4. 활동 데이터 처리 (선택적)
    if (!keep_data) {
      // 사용자가 데이터 삭제를 원하는 경우
      const { error: deleteActError } = await supabaseAdmin
        .from('garmin_activities')
        .delete()
        .eq('user_id', user_id)

      if (deleteActError) {
        console.error('Failed to delete activities:', deleteActError)
        // 활동 삭제 실패는 치명적이지 않으므로 계속 진행
      }
    }

    // 5. 관련 webhook 로그 정리 (선택적)
    const { error: cleanupError } = await supabaseAdmin
      .from('webhook_logs')
      .delete()
      .eq('garmin_user_id', connection.garmin_user_id)
      .in('status', ['pending', 'processing'])

    if (cleanupError) {
      console.error('Failed to cleanup webhook logs:', cleanupError)
      // 로그 정리 실패는 치명적이지 않음
    }

    console.log(`Garmin disconnected for user: ${user_id}`)

    return NextResponse.json({
      success: true,
      message: 'Garmin connection removed successfully',
      data_kept: keep_data
    })

  } catch (error) {
    console.error('Disconnect error:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect Garmin' },
      { status: 500 }
    )
  }
}

// 연결 상태만 삭제하고 데이터는 유지 (soft disconnect)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id } = body

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    // needs_reauth 플래그만 설정 (연결은 유지하되 재인증 필요 표시)
    const { data, error } = await supabaseAdmin
      .from('garmin_connections')
      .update({
        needs_reauth: true,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update connection status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Connection marked for re-authentication',
      connection: data
    })

  } catch (error) {
    console.error('Soft disconnect error:', error)
    return NextResponse.json(
      { error: 'Failed to update connection' },
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
      'Access-Control-Allow-Methods': 'POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}