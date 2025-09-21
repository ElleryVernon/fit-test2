import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function GET() {
  try {
    // 최근 24시간 통계
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    const { data: stats } = await supabaseAdmin
      .from('webhook_logs')
      .select('status, type')
      .gte('created_at', yesterday)

    // 상태별 집계
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const summary = stats?.reduce((acc: any, log: any) => {
      acc[log.status] = (acc[log.status] || 0) + 1
      acc.types[log.type] = (acc.types[log.type] || 0) + 1
      return acc
    }, { pending: 0, processing: 0, success: 0, failed: 0, types: {} })

    // 최근 로그 10개
    const { data: recent } = await supabaseAdmin
      .from('webhook_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      status: 'healthy',
      last_24h: summary,
      recent_logs: recent
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch status' },
      { status: 500 }
    )
  }
}