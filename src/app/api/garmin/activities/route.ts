import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const activityType = searchParams.get('activity_type')

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    // 쿼리 빌드
    let query = supabaseAdmin
      .from('garmin_activities')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('start_time', { ascending: false })
      .range(offset, offset + limit - 1)

    // 날짜 필터
    if (startDate) {
      query = query.gte('start_time', new Date(startDate).toISOString())
    }
    if (endDate) {
      query = query.lte('start_time', new Date(endDate).toISOString())
    }

    // 활동 타입 필터
    if (activityType) {
      query = query.eq('activity_type', activityType)
    }

    const { data: activities, error, count } = await query

    if (error) {
      throw error
    }

    // 응답 데이터 정리
    const formattedActivities = activities?.map(activity => ({
      id: activity.id,
      activity_id: activity.garmin_activity_id,
      name: activity.activity_name,
      type: activity.activity_type,
      start_time: activity.start_time,
      duration_minutes: activity.duration_seconds ? Math.round(activity.duration_seconds / 60) : null,
      distance_km: activity.distance_meters ? (activity.distance_meters / 1000).toFixed(2) : null,
      calories: activity.calories,
      heart_rate: {
        avg: activity.avg_heart_rate,
        max: activity.max_heart_rate,
        min: activity.min_heart_rate
      },
      steps: activity.steps,
      is_manual: activity.is_manual,
      is_auto_detected: activity.is_auto_detected
    }))

    return NextResponse.json({
      activities: formattedActivities || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        has_more: (count || 0) > offset + limit
      }
    })

  } catch (error) {
    console.error('Activities fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}

// 특정 활동 조회
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, activity_id } = body

    if (!user_id || !activity_id) {
      return NextResponse.json(
        { error: 'user_id and activity_id are required' },
        { status: 400 }
      )
    }

    const { data: activity, error } = await supabaseAdmin
      .from('garmin_activities')
      .select('*')
      .eq('user_id', user_id)
      .eq('garmin_activity_id', activity_id)
      .single()

    if (error || !activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      activity: {
        ...activity,
        duration_minutes: activity.duration_seconds ? Math.round(activity.duration_seconds / 60) : null,
        distance_km: activity.distance_meters ? (activity.distance_meters / 1000).toFixed(2) : null,
      }
    })

  } catch (error) {
    console.error('Activity fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}