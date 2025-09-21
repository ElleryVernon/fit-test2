import { NextRequest } from 'next/server'
import { handleGarminWebhook } from '../_shared/handler'
import { WEBHOOK_TYPES } from '@/lib/services/garmin/constants'

export async function POST(request: NextRequest) {
  return handleGarminWebhook(request, WEBHOOK_TYPES.ACTIVITIES)
}