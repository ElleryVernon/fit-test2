import { NextRequest, NextResponse } from 'next/server'
import { saveWebhookLog, processWebhook, verifyWebhookPayload } from '@/lib/services/garmin/webhook'

export async function handleGarminWebhook(
  request: NextRequest,
  webhookType: string
) {
  const startTime = Date.now()
  console.log(`🔔 [${webhookType}] Webhook received at ${new Date().toISOString()}`)

  try {
    // Request 정보 로깅
    const headers = Object.fromEntries(request.headers.entries())
    const url = request.url
    console.log(`📋 [${webhookType}] Headers:`, JSON.stringify(headers, null, 2))
    console.log(`🌐 [${webhookType}] URL: ${url}`)

    const body = await request.text()
    console.log(`📦 [${webhookType}] Raw body:`, body)

    let payload
    try {
      payload = JSON.parse(body)
      console.log(`✅ [${webhookType}] Parsed payload:`, JSON.stringify(payload, null, 2))
    } catch (parseError) {
      console.error(`❌ [${webhookType}] JSON parse error:`, parseError)
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      )
    }

    // 1. 기본 payload 검증
    if (!verifyWebhookPayload(payload)) {
      console.error(`❌ [${webhookType}] Invalid webhook payload structure`)
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      )
    }
    console.log(`✅ [${webhookType}] Payload validation passed`)

    // 2. Webhook 로그 저장
    console.log(`💾 [${webhookType}] Saving webhook log...`)
    const webhook = await saveWebhookLog(webhookType, payload)
    console.log(`✅ [${webhookType}] Webhook log saved with ID: ${webhook.id}`)

    // 3. 비동기 처리 (즉시 200 응답 반환)
    console.log(`⚡ [${webhookType}] Starting async processing...`)
    processWebhook(webhook.id).catch(error => {
      console.error(`❌ [${webhookType}] Failed to process webhook:`, error)
    })

    // 4. Garmin에 성공 응답
    const processingTime = Date.now() - startTime
    console.log(`🎉 [${webhookType}] Webhook processed successfully in ${processingTime}ms`)

    return NextResponse.json({
      status: 'ok',
      processed_at: new Date().toISOString(),
      processing_time_ms: processingTime
    }, { status: 200 })

  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error(`💥 [${webhookType}] Webhook error in ${processingTime}ms:`, error)

    // 스택 트레이스도 로깅
    if (error instanceof Error) {
      console.error(`💥 [${webhookType}] Stack trace:`, error.stack)
    }

    // 에러가 발생해도 200 반환 (재시도 방지)
    return NextResponse.json({
      status: 'ok',
      error_logged: true,
      processed_at: new Date().toISOString(),
      processing_time_ms: processingTime
    }, { status: 200 })
  }
}