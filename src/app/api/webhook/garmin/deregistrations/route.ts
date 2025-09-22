import { NextRequest } from 'next/server'
import { handleGarminWebhook } from '../_shared/handler'
import { handleWebhookOptions } from '../_shared/options'
import { WEBHOOK_TYPES } from '@/lib/services/garmin/constants'

export async function POST(request: NextRequest) {
  return handleGarminWebhook(request, WEBHOOK_TYPES.DEREGISTRATIONS)
}

export async function OPTIONS() {
  return handleWebhookOptions()
}