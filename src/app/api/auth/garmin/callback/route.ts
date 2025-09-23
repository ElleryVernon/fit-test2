import { NextRequest, NextResponse } from 'next/server'
import {
  verifyOAuthState,
  exchangeCodeForTokens,
  saveGarminConnection
} from '@/lib/services/garmin/oauth'

export async function GET(request: NextRequest) {
  try {
    // 1. Garmin OAuth 2.0에서 전달받은 파라미터
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // 에러가 있거나 사용자가 거부한 경우
    if (error || !code) {
      const errorMessage = error || 'User denied access or authorization code missing'
      console.error('OAuth error:', errorMessage)

      // 웹 브라우저용 리다이렉트
      const webRedirectUrl = `/garmin-test?error=${encodeURIComponent(errorMessage)}`
      return NextResponse.redirect(new URL(webRedirectUrl, request.url))
    }

    // 2. State 검증 (CSRF 방지) 및 code verifier 조회
    if (!state) {
      console.error('No state parameter received')
      // 웹 브라우저용 리다이렉트
      const webRedirectUrl = `/garmin-test?error=${encodeURIComponent('Invalid state')}`
      return NextResponse.redirect(new URL(webRedirectUrl, request.url))
    }

    const stateData = await verifyOAuthState(state)
    if (!stateData) {
      console.error('Invalid or expired state:', state)
      // 웹 브라우저용 리다이렉트
      const webRedirectUrl = `/garmin-test?error=${encodeURIComponent('Invalid or expired state')}`
      return NextResponse.redirect(new URL(webRedirectUrl, request.url))
    }

    const { userId, codeVerifier } = stateData

    // 3. OAuth 2.0 토큰 교환
    console.log('Exchanging OAuth 2.0 tokens for user:', userId)
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/garmin/callback`
    const tokens = await exchangeCodeForTokens(code, codeVerifier, redirectUri)

    // 4. 연결 정보 저장
    await saveGarminConnection(
      userId,
      tokens.access_token,
      tokens.refresh_token,
      tokens.expires_in
    )

    console.log('Garmin OAuth 2.0 connection saved for user:', userId)

    // 5. 성공 - 웹 브라우저용 리다이렉트
    const webRedirectUrl = `/garmin-test?success=true&user_id=${userId}`
    return NextResponse.redirect(new URL(webRedirectUrl, request.url))

  } catch (error) {
    console.error('OAuth 2.0 callback error:', error)

    // 에러 발생 시 웹 브라우저용 리다이렉트
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const webRedirectUrl = `/garmin-test?error=${encodeURIComponent(errorMessage)}`
    return NextResponse.redirect(new URL(webRedirectUrl, request.url))
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