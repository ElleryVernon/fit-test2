import { GARMIN_API_BASE_URL } from './constants'

// Garmin API 호출 헬퍼
async function garminFetch(
  endpoint: string,
  accessToken: string,
  options?: RequestInit
) {
  const response = await fetch(`${GARMIN_API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      ...options?.headers
    }
  })

  if (!response.ok) {
    throw new Error(`Garmin API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// 활동 목록 가져오기
export async function fetchActivities(
  accessToken: string,
  startDate?: Date,
  endDate?: Date
) {
  const params = new URLSearchParams()
  if (startDate) params.append('startDate', startDate.toISOString().split('T')[0])
  if (endDate) params.append('endDate', endDate.toISOString().split('T')[0])
  
  return garminFetch(`/activities?${params}`, accessToken)
}

// 특정 활동 상세 정보
export async function fetchActivityDetails(
  activityId: string,
  accessToken: string
) {
  return garminFetch(`/activities/${activityId}`, accessToken)
}

// 활동 파일 (FIT, TCX, GPX)
export async function fetchActivityFile(
  activityId: string,
  fileType: string,
  accessToken: string
) {
  const response = await fetch(
    `${GARMIN_API_BASE_URL}/activities/${activityId}/files/${fileType}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch activity file: ${response.status}`)
  }

  return response.blob()
}

// OAuth 2.0 토큰 갱신
export async function refreshGarminToken(refreshToken: string) {
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
    throw new Error('Failed to refresh token')
  }

  return response.json()
}