import { NextRequest, NextResponse } from 'next/server'
import {
  verifyOAuthState,
  exchangeCodeForTokens,
  saveGarminConnection
} from '@/lib/services/garmin/oauth'

export async function GET(request: NextRequest) {
  console.log('🔗 [Garmin OAuth] Callback received')
  console.log('📋 [Garmin OAuth] URL:', request.url)

  try {
    // 1. Garmin OAuth 2.0에서 전달받은 파라미터
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    console.log('📝 [Garmin OAuth] Parameters:', { code: code ? 'present' : 'missing', state, error })

    // 에러가 있거나 사용자가 거부한 경우
    if (error || !code) {
      const errorMessage = error || 'User denied access or authorization code missing'
      console.error('❌ [Garmin OAuth] Error:', errorMessage)

      // 웹 브라우저용 리다이렉트
      const webRedirectUrl = `/garmin-test?error=${encodeURIComponent(errorMessage)}`
      return NextResponse.redirect(new URL(webRedirectUrl, request.url))
    }

    // 2. State 검증 (CSRF 방지) 및 code verifier 조회
    if (!state) {
      console.error('❌ [Garmin OAuth] No state parameter received')
      // 웹 브라우저용 리다이렉트
      const webRedirectUrl = `/garmin-test?error=${encodeURIComponent('Invalid state')}`
      return NextResponse.redirect(new URL(webRedirectUrl, request.url))
    }

    console.log('🔍 [Garmin OAuth] Verifying state:', state)
    const stateData = await verifyOAuthState(state)
    if (!stateData) {
      console.error('❌ [Garmin OAuth] Invalid or expired state:', state)
      // 웹 브라우저용 리다이렉트
      const webRedirectUrl = `/garmin-test?error=${encodeURIComponent('Invalid or expired state')}`
      return NextResponse.redirect(new URL(webRedirectUrl, request.url))
    }

    const { userId, codeVerifier } = stateData
    console.log('✅ [Garmin OAuth] State verified for user:', userId)

    // 3. OAuth 2.0 토큰 교환
    console.log('🔄 [Garmin OAuth] Exchanging tokens for user:', userId)
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/garmin/callback`
    console.log('🔗 [Garmin OAuth] Redirect URI:', redirectUri)

    const tokens = await exchangeCodeForTokens(code, codeVerifier, redirectUri)
    console.log('✅ [Garmin OAuth] Tokens received')

    // 4. 연결 정보 저장
    console.log('💾 [Garmin OAuth] Saving connection for user:', userId)
    await saveGarminConnection(
      userId,
      tokens.access_token,
      tokens.refresh_token,
      tokens.expires_in
    )

    console.log('✅ [Garmin OAuth] Connection saved for user:', userId)

    // 5. 성공 - 웹 브라우저용 리다이렉트
    const webRedirectUrl = `/garmin-test?success=true&user_id=${userId}`
    return NextResponse.redirect(new URL(webRedirectUrl, request.url))

  } catch (error) {
    console.error('❌ [Garmin OAuth] Callback error:', error)
    console.error('❌ [Garmin OAuth] Error stack:', error instanceof Error ? error.stack : 'No stack trace')

    // 에러 발생 시 웹 브라우저용 리다이렉트
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = `${error.name}: ${error.message}`
      // 추가 컨텍스트 정보
      if (error.message.includes('Failed to fetch')) {
        errorMessage += ' (Network issue - check Garmin API connection)'
      } else if (error.message.includes('Token exchange failed')) {
        errorMessage += ' (Check Garmin client credentials)'
      } else if (error.message.includes('Invalid state')) {
        errorMessage += ' (OAuth state expired or invalid)'
      }
    }

    console.error('❌ [Garmin OAuth] Redirecting with error:', errorMessage)
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