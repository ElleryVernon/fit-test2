import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/client'

// OAuth 2.0 PKCE 관련 상수
const STATE_EXPIRY_MINUTES = 10

// PKCE Code Verifier 생성 (43-128 characters)
export function generateCodeVerifier(): string {
  const verifier = crypto.randomBytes(64)
    .toString('base64url')
    .replace(/=/g, '')
    .substring(0, 128)

  return verifier
}

// PKCE Code Challenge 생성 (SHA256 hash of verifier)
export function generateCodeChallenge(verifier: string): string {
  const challenge = crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return challenge
}

// OAuth State 생성 및 저장 (CSRF 방지 + PKCE verifier 저장)
export async function generateOAuthState(userId: string): Promise<{ state: string; codeVerifier: string; codeChallenge: string }> {
  const state = crypto.randomBytes(32).toString('hex')
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = generateCodeChallenge(codeVerifier)

  const stateData = {
    userId,
    codeVerifier,
    createdAt: Date.now()
  }

  // State와 code verifier를 임시 저장
  await supabaseAdmin
    .from('webhook_logs')
    .insert({
      type: 'oauth_state',
      garmin_user_id: userId,
      summary_id: state,
      payload: stateData,
      status: 'pending',
      created_at: new Date().toISOString()
    })

  return { state, codeVerifier, codeChallenge }
}

// State 검증 및 code verifier 반환
export async function verifyOAuthState(state: string): Promise<{ userId: string; codeVerifier: string } | null> {
  const { data } = await supabaseAdmin
    .from('webhook_logs')
    .select('*')
    .eq('type', 'oauth_state')
    .eq('summary_id', state)
    .eq('status', 'pending')
    .single()

  if (!data) return null

  const stateData = data.payload as { userId: string; codeVerifier: string; createdAt: number }
  const now = Date.now()
  const expiryTime = STATE_EXPIRY_MINUTES * 60 * 1000

  // 만료 체크
  if (now - stateData.createdAt > expiryTime) {
    await supabaseAdmin
      .from('webhook_logs')
      .update({ status: 'failed', error_message: 'State expired' })
      .eq('id', data.id)
    return null
  }

  // State 사용 처리
  await supabaseAdmin
    .from('webhook_logs')
    .update({ status: 'success' })
    .eq('id', data.id)

  return {
    userId: stateData.userId,
    codeVerifier: stateData.codeVerifier
  }
}

// Garmin OAuth 2.0 PKCE URL 생성
export function buildGarminAuthUrl(state: string, codeChallenge: string): string {
  // Environment variable validation
  if (!process.env.GARMIN_CLIENT_ID || !process.env.NEXT_PUBLIC_BASE_URL) {
    console.error('❌ [Garmin OAuth] Missing environment variables for auth URL:', {
      hasClientId: !!process.env.GARMIN_CLIENT_ID,
      hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL
    })
    throw new Error('Missing Garmin OAuth configuration in environment variables')
  }

  const baseUrl = 'https://connect.garmin.com/oauth2Confirm'
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/garmin/callback`

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.GARMIN_CLIENT_ID,
    redirect_uri: redirectUri,
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  })

  const authUrl = `${baseUrl}?${params.toString()}`

  console.log('🔗 [Garmin OAuth] Generated auth URL:', {
    baseUrl,
    clientId: process.env.GARMIN_CLIENT_ID,
    redirectUri,
    state,
    codeChallenge
  })

  return authUrl
}

// OAuth 2.0 토큰 교환
export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<{
  access_token: string
  refresh_token: string
  expires_in: number
  refresh_token_expires_in: number
  scope: string
}> {
  // Environment variable validation
  if (!process.env.GARMIN_CLIENT_ID || !process.env.GARMIN_CLIENT_SECRET) {
    console.error('❌ [Garmin OAuth] Missing environment variables:', {
      hasClientId: !!process.env.GARMIN_CLIENT_ID,
      hasClientSecret: !!process.env.GARMIN_CLIENT_SECRET
    })
    throw new Error('Missing Garmin OAuth credentials in environment variables')
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.GARMIN_CLIENT_ID,
    client_secret: process.env.GARMIN_CLIENT_SECRET,
    code: code,
    code_verifier: codeVerifier,
    redirect_uri: redirectUri
  })

  console.log('🔄 [Garmin OAuth] Token exchange request:', {
    url: 'https://diauth.garmin.com/di-oauth2-service/oauth/token',
    params: Object.fromEntries(params),
    redirectUri
  })

  const response = await fetch('https://diauth.garmin.com/di-oauth2-service/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  })

  console.log('📋 [Garmin OAuth] Token exchange response status:', response.status)

  if (!response.ok) {
    const error = await response.text()
    console.error('❌ [Garmin OAuth] Token exchange error response:', error)
    throw new Error(`Token exchange failed: ${response.status} - ${error}`)
  }

  const tokenData = await response.json()
  console.log('✅ [Garmin OAuth] Token exchange success:', {
    hasAccessToken: !!tokenData.access_token,
    hasRefreshToken: !!tokenData.refresh_token,
    expiresIn: tokenData.expires_in
  })

  return tokenData
}

// Refresh Token으로 Access Token 갱신
export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string
  refresh_token: string
  expires_in: number
  refresh_token_expires_in: number
}> {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.GARMIN_CLIENT_ID!,
    client_secret: process.env.GARMIN_CLIENT_SECRET!,
    refresh_token: refreshToken
  })

  const response = await fetch('https://diauth.garmin.com/di-oauth2-service/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  })

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.status}`)
  }

  return response.json()
}

// Garmin User ID 조회
export async function fetchGarminUserId(accessToken: string): Promise<string> {
  const response = await fetch('https://apis.garmin.com/wellness-api/rest/user/id', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Garmin user ID: ${response.status}`)
  }

  const data = await response.json()
  return data.userId
}

// Garmin 권한 조회
export async function fetchGarminPermissions(accessToken: string): Promise<string[]> {
  const response = await fetch('https://apis.garmin.com/wellness-api/rest/user/permissions', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch permissions: ${response.status}`)
  }

  return response.json()
}

// Garmin 연결 저장 (OAuth 2.0)
export async function saveGarminConnection(
  userId: string,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) {
  // Garmin User ID 조회
  const garminUserId = await fetchGarminUserId(accessToken)

  // 권한 조회
  const permissions = await fetchGarminPermissions(accessToken)

  // 토큰 만료 시간 계산 (600초 여유를 두고 저장)
  const tokenExpiresAt = new Date(Date.now() + (expiresIn - 600) * 1000)

  const { data, error } = await supabaseAdmin
    .from('garmin_connections')
    .upsert({
      user_id: userId,
      garmin_user_id: garminUserId,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_expires_at: tokenExpiresAt.toISOString(),
      scopes: permissions,
      needs_reauth: false,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// 모바일 앱 딥링크 URL 생성
export function buildMobileRedirectUrl(
  success: boolean,
  userId?: string,
  error?: string
): string {
  const scheme = process.env.MOBILE_APP_SCHEME || 'fitculator'
  const status = success ? 'success' : 'error'
  const params = new URLSearchParams()

  if (userId) params.append('user_id', userId)
  if (error) params.append('error', error)

  return `${scheme}://garmin-${status}?${params.toString()}`
}