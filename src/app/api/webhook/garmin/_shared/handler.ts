import { NextRequest, NextResponse } from 'next/server'
import { saveWebhookLog, processWebhook, verifyWebhookPayload } from '@/lib/services/garmin/webhook'

export async function handleGarminWebhook(
  request: NextRequest,
  webhookType: string
) {
  try {
    const body = await request.text()
    const payload = JSON.parse(body)

    // 1. 기본 payload 검증
    if (!verifyWebhookPayload(payload)) {
      console.error('Invalid webhook payload')
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      )
    }

    // 2. Webhook 로그 저장
    const webhook = await saveWebhookLog(webhookType, payload)

    // 3. 비동기 처리 (즉시 200 응답 반환)
    processWebhook(webhook.id).catch(error => {
      console.error(`Failed to process ${webhookType} webhook:`, error)
    })

    // 4. Garmin에 성공 응답
    return NextResponse.json({ status: 'ok' }, { status: 200 })

  } catch (error) {
    console.error(`Webhook error (${webhookType}):`, error)
    // 에러가 발생해도 200 반환 (재시도 방지)
    return NextResponse.json({ status: 'ok' }, { status: 200 })
  }
}