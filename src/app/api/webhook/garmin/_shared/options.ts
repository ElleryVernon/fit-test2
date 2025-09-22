import { NextResponse } from 'next/server'

export async function handleWebhookOptions() {
  console.log('🔧 [OPTIONS] CORS preflight request received')

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours cache
    },
  })
}