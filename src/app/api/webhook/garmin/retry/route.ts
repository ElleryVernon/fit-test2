import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { processWebhook } from '@/lib/services/garmin/webhook'

export async function POST(request: NextRequest) {
  try {
    // 관리자 인증 체크 (선택사항)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 실패한 webhook 재처리
    const { data: failedWebhooks } = await supabaseAdmin
      .from('webhook_logs')
      .select('id')
      .eq('status', 'failed')
      .lt('retry_count', 3)
      .limit(10)

    const results = await Promise.allSettled(
      (failedWebhooks || []).map(w => processWebhook(w.id))
    )

    return NextResponse.json({
      retried: results.length,
      success: results.filter(r => r.status === 'fulfilled').length
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Retry failed' },
      { status: 500 }
    )
  }
}