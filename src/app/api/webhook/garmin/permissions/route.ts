import { NextRequest } from 'next/server'
import { handleGarminWebhook } from '../_shared/handler'
import { handleWebhookOptions } from '../_shared/options'
import { WEBHOOK_TYPES } from '@/constants'

export async function POST(request: NextRequest) {
  return handleGarminWebhook(request, WEBHOOK_TYPES.PERMISSIONS)
}

export async function OPTIONS() {
  return handleWebhookOptions()
}