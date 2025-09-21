import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('user_id')
    const period = searchParams.get('period') || '7' // 기본 7일

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    const days = parseInt(period)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // 기간 내 활동 조회
    const { data: activities, error } = await supabaseAdmin
      .from('garmin_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', startDate.toISOString())
      .order('start_time', { ascending: false })

    if (error) {
      throw error
    }

    // 통계 계산
    const stats = calculateStatistics(activities || [])

    // 활동 타입별 통계
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const activityTypeStats = activities?.reduce((acc: Record<string, any>, activity: any) => {
      const type = activity.activity_type
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          total_duration_minutes: 0,
          total_distance_km: 0,
          total_calories: 0,
          avg_heart_rate: []
        }
      }

      acc[type].count++
      acc[type].total_duration_minutes += (activity.duration_seconds || 0) / 60
      acc[type].total_distance_km += (activity.distance_meters || 0) / 1000
      acc[type].total_calories += activity.calories || 0

      if (activity.avg_heart_rate) {
        acc[type].avg_heart_rate.push(activity.avg_heart_rate)
      }

      return acc
    }, {})

    // 평균 심박수 계산
    Object.keys(activityTypeStats || {}).forEach(type => {
      const heartRates = activityTypeStats[type].avg_heart_rate
      activityTypeStats[type].avg_heart_rate = heartRates.length > 0
        ? Math.round(heartRates.reduce((a: number, b: number) => a + b, 0) / heartRates.length)
        : null

      // 소수점 정리
      activityTypeStats[type].total_duration_minutes = Math.round(activityTypeStats[type].total_duration_minutes)
      activityTypeStats[type].total_distance_km = parseFloat(activityTypeStats[type].total_distance_km.toFixed(2))
    })

    // 주간 목표 달성률 (예시: 주 5회 운동 목표)
    const weeklyGoal = 5
    const currentWeekActivities = activities?.filter(a => {
      const activityDate = new Date(a.start_time)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return activityDate >= weekAgo
    }).length || 0

    const goalProgress = Math.min((currentWeekActivities / weeklyGoal) * 100, 100)

    return NextResponse.json({
      period: {
        days,
        start_date: startDate.toISOString(),
        end_date: new Date().toISOString()
      },
      summary: stats.summary,
      daily_stats: stats.daily,
      activity_types: activityTypeStats,
      trends: calculateTrends(activities || []),
      goals: {
        weekly_activity_goal: weeklyGoal,
        current_week_activities: currentWeekActivities,
        goal_progress_percentage: Math.round(goalProgress)
      }
    })

  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}

// 통계 계산 함수
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function calculateStatistics(activities: any[]) {
  const summary = {
    total_activities: activities.length,
    total_duration_hours: 0,
    total_distance_km: 0,
    total_calories: 0,
    avg_heart_rate: 0,
    total_steps: 0
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dailyStats: Record<string, any> = {}

  activities.forEach(activity => {
    // 전체 통계
    summary.total_duration_hours += (activity.duration_seconds || 0) / 3600
    summary.total_distance_km += (activity.distance_meters || 0) / 1000
    summary.total_calories += activity.calories || 0
    summary.total_steps += activity.steps || 0

    // 일별 통계
    const date = new Date(activity.start_time).toISOString().split('T')[0]
    if (!dailyStats[date]) {
      dailyStats[date] = {
        date,
        activities: 0,
        duration_minutes: 0,
        distance_km: 0,
        calories: 0,
        steps: 0
      }
    }

    dailyStats[date].activities++
    dailyStats[date].duration_minutes += (activity.duration_seconds || 0) / 60
    dailyStats[date].distance_km += (activity.distance_meters || 0) / 1000
    dailyStats[date].calories += activity.calories || 0
    dailyStats[date].steps += activity.steps || 0
  })

  // 평균 심박수 계산
  const heartRates = activities
    .filter(a => a.avg_heart_rate)
    .map(a => a.avg_heart_rate)

  summary.avg_heart_rate = heartRates.length > 0
    ? Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length)
    : 0

  // 소수점 정리
  summary.total_duration_hours = parseFloat(summary.total_duration_hours.toFixed(2))
  summary.total_distance_km = parseFloat(summary.total_distance_km.toFixed(2))

  // 일별 통계 소수점 정리
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.values(dailyStats).forEach((stat: any) => {
    stat.duration_minutes = Math.round(stat.duration_minutes)
    stat.distance_km = parseFloat(stat.distance_km.toFixed(2))
  })

  return {
    summary,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    daily: Object.values(dailyStats).sort((a: any, b: any) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }
}

// 트렌드 분석
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function calculateTrends(activities: any[]) {
  if (activities.length < 2) {
    return {
      activity_frequency: 'stable',
      intensity_trend: 'stable',
      message: 'Not enough data for trend analysis'
    }
  }

  // 최근 7일 vs 이전 7일 비교
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

  const recentActivities = activities.filter(a => new Date(a.start_time) >= oneWeekAgo)
  const previousActivities = activities.filter(a => {
    const date = new Date(a.start_time)
    return date >= twoWeeksAgo && date < oneWeekAgo
  })

  const frequencyTrend = recentActivities.length > previousActivities.length ? 'increasing' :
                         recentActivities.length < previousActivities.length ? 'decreasing' : 'stable'

  const recentAvgDuration = recentActivities.reduce((sum, a) => sum + (a.duration_seconds || 0), 0) /
                           (recentActivities.length || 1)
  const prevAvgDuration = previousActivities.reduce((sum, a) => sum + (a.duration_seconds || 0), 0) /
                          (previousActivities.length || 1)

  const intensityTrend = recentAvgDuration > prevAvgDuration ? 'increasing' :
                        recentAvgDuration < prevAvgDuration ? 'decreasing' : 'stable'

  return {
    activity_frequency: frequencyTrend,
    intensity_trend: intensityTrend,
    recent_count: recentActivities.length,
    previous_count: previousActivities.length,
    avg_duration_change: Math.round(((recentAvgDuration - prevAvgDuration) / 60))
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