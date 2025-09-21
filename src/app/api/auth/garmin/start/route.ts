import { NextRequest, NextResponse } from 'next/server'
import { generateOAuthState, buildGarminAuthUrl } from '@/lib/services/garmin/oauth'

export async function GET(request: NextRequest) {
  try {
    // 1. 모바일 앱에서 전달받은 user_id
    const userId = request.nextUrl.searchParams.get('user_id')
    const returnUrl = request.nextUrl.searchParams.get('return_url') // 선택적: 커스텀 리턴 URL

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    // 2. OAuth 2.0 PKCE를 위한 state와 code challenge 생성
    const { state, codeChallenge } = await generateOAuthState(userId)

    // 3. Garmin OAuth 2.0 URL로 리다이렉트
    const authUrl = buildGarminAuthUrl(state, codeChallenge)

    // 로그 기록 (개발/디버깅용)
    console.log('Starting Garmin OAuth 2.0 PKCE for user:', userId)

    return NextResponse.redirect(authUrl)

  } catch (error) {
    console.error('Failed to start Garmin OAuth:', error)
    return NextResponse.json(
      { error: 'Failed to initialize authentication' },
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}