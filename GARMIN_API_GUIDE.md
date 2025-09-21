# Garmin API Integration Guide (OAuth 2.0 PKCE)

## 🏗️ Architecture Overview

```
Mobile App ←→ Web Server ←→ Garmin OAuth 2.0 API
                ↓
            Supabase DB
```

**Updated to use OAuth 2.0 PKCE** as per Garmin's latest specifications.

## 📋 Prerequisites

### 1. Environment Variables
Add these to your `.env.local`:

```bash
# Garmin OAuth 2.0 Credentials
GARMIN_CLIENT_ID=your_client_id_from_garmin
GARMIN_CLIENT_SECRET=your_client_secret_from_garmin

# App Configuration
NEXT_PUBLIC_BASE_URL=https://your-domain.com
MOBILE_APP_SCHEME=fitculator  # Your mobile app's deep link scheme

# Admin
ADMIN_SECRET=your_admin_secret_for_protected_endpoints

# Supabase (이미 있을 것)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Note:** `GARMIN_WEBHOOK_SECRET` is not required as Garmin doesn't provide webhook signature verification.

### 2. Garmin Developer Account Setup
1. Go to [Garmin Connect Developer](https://developer.garmin.com/)
2. Create an application
3. Configure OAuth 2.0 settings:
   - **Authorization URL**: `https://connect.garmin.com/oauth2Confirm`
   - **Token URL**: `https://diauth.garmin.com/di-oauth2-service/oauth/token`
   - **Callback URL**: `https://your-domain.com/api/auth/garmin/callback`
4. Configure Webhook URLs:
   - Activities: `https://your-domain.com/api/webhook/garmin/activities`
   - Activity Details: `https://your-domain.com/api/webhook/garmin/activity-details`
   - Manual Activities: `https://your-domain.com/api/webhook/garmin/manual-activities`
   - MoveIQ: `https://your-domain.com/api/webhook/garmin/moveiq`
   - Deregistrations: `https://your-domain.com/api/webhook/garmin/deregistrations`
   - Permissions: `https://your-domain.com/api/webhook/garmin/permissions`

## 🔌 API Endpoints

### Authentication Flow

#### 1. Start OAuth Authentication
```http
GET /api/auth/garmin/start?user_id={user_id}
```

**Parameters:**
- `user_id`: Unique identifier for your app user

**Response:**
- Redirects to Garmin OAuth page

**Mobile App Usage:**
```typescript
// React Native 예시
import { Linking } from 'react-native'

const connectGarmin = async (userId: string) => {
  const authUrl = `${WEB_SERVER}/api/auth/garmin/start?user_id=${userId}`
  await Linking.openURL(authUrl)
}
```

#### 2. OAuth Callback (자동 처리)
```http
GET /api/auth/garmin/callback
```
- 웹 서버에서 자동으로 처리
- 성공/실패 시 모바일 앱으로 딥링크 리다이렉트
  - 성공: `fitculator://garmin-success?user_id={user_id}`
  - 실패: `fitculator://garmin-error?error={error_message}`

### Data APIs

#### 3. Check Connection Status
```http
GET /api/garmin/connection-status?user_id={user_id}
```

**Response:**
```json
{
  "connected": true,
  "garmin_user_id": "garmin_12345",
  "needs_reauth": false,
  "scopes": ["activity_read", "activity_write"],
  "connected_at": "2024-01-01T00:00:00Z",
  "last_updated": "2024-01-15T00:00:00Z",
  "recent_activities": 15
}
```

#### 4. Fetch Activities
```http
GET /api/garmin/activities?user_id={user_id}&limit=20&offset=0
```

**Query Parameters:**
- `user_id` (required): User identifier
- `limit`: Number of activities (default: 20)
- `offset`: Pagination offset (default: 0)
- `start_date`: Filter start date (ISO 8601)
- `end_date`: Filter end date (ISO 8601)
- `activity_type`: Filter by type (running, cycling, etc.)

**Response:**
```json
{
  "activities": [
    {
      "id": "uuid",
      "activity_id": "garmin_activity_123",
      "name": "Morning Run",
      "type": "running",
      "start_time": "2024-01-15T07:00:00Z",
      "duration_minutes": 35,
      "distance_km": "5.23",
      "calories": 350,
      "heart_rate": {
        "avg": 145,
        "max": 165,
        "min": 120
      },
      "steps": 5230,
      "is_manual": false,
      "is_auto_detected": false
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "has_more": true
  }
}
```

#### 5. Get Statistics
```http
GET /api/garmin/stats?user_id={user_id}&period=7
```

**Query Parameters:**
- `user_id` (required): User identifier
- `period`: Number of days (default: 7)
- `group_by`: Grouping method (day/week/month)

**Response:**
```json
{
  "period": {
    "days": 7,
    "start_date": "2024-01-08T00:00:00Z",
    "end_date": "2024-01-15T00:00:00Z"
  },
  "summary": {
    "total_activities": 5,
    "total_duration_hours": 3.5,
    "total_distance_km": 25.5,
    "total_calories": 1750,
    "avg_heart_rate": 142,
    "total_steps": 25500
  },
  "daily_stats": [
    {
      "date": "2024-01-15",
      "activities": 1,
      "duration_minutes": 35,
      "distance_km": 5.23,
      "calories": 350,
      "steps": 5230
    }
  ],
  "activity_types": {
    "running": {
      "count": 3,
      "total_duration_minutes": 105,
      "total_distance_km": 15.5,
      "total_calories": 1050,
      "avg_heart_rate": 145
    },
    "cycling": {
      "count": 2,
      "total_duration_minutes": 105,
      "total_distance_km": 10.0,
      "total_calories": 700,
      "avg_heart_rate": 138
    }
  },
  "trends": {
    "activity_frequency": "increasing",
    "intensity_trend": "stable",
    "recent_count": 3,
    "previous_count": 2,
    "avg_duration_change": 5
  },
  "goals": {
    "weekly_activity_goal": 5,
    "current_week_activities": 3,
    "goal_progress_percentage": 60
  }
}
```

#### 6. Get Garmin User ID
```http
GET /api/garmin/user-id?user_id={user_id}
```

**Response:**
```json
{
  "garmin_user_id": "d3315b1072421d0dd7c8f6b8e1de4df8"
}
```

#### 7. Get User Permissions
```http
GET /api/garmin/permissions?user_id={user_id}
```

**Response:**
```json
{
  "permissions": [
    "ACTIVITY_EXPORT",
    "WORKOUT_IMPORT",
    "HEALTH_EXPORT",
    "COURSE_IMPORT",
    "MCT_EXPORT"
  ],
  "source": "live"  // "cached" 또는 "live"
}
```

#### 8. Disconnect Garmin
```http
POST /api/garmin/disconnect
```

**Request Body:**
```json
{
  "user_id": "user_123",
  "keep_data": false  // true면 활동 데이터 유지, false면 삭제
}
```

**Response:**
```json
{
  "success": true,
  "message": "Garmin connection removed successfully",
  "data_kept": false
}
```

### Admin Endpoints

#### 9. Webhook Status
```http
GET /api/webhook/garmin/status
```

**Response:**
```json
{
  "status": "healthy",
  "last_24h": {
    "pending": 2,
    "processing": 1,
    "success": 145,
    "failed": 3,
    "types": {
      "activities": 100,
      "activity-details": 45,
      "manual-activities": 5,
      "moveiq": 1
    }
  },
  "recent_logs": [...]
}
```

#### 10. Retry Failed Webhooks
```http
POST /api/webhook/garmin/retry
Headers: Authorization: Bearer {ADMIN_SECRET}
```

## 📱 Mobile App Integration Guide

### 1. Deep Link Setup

#### iOS (Info.plist)
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>fitculator</string>
    </array>
  </dict>
</array>
```

#### Android (AndroidManifest.xml)
```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="fitculator" />
</intent-filter>
```

### 2. React Native Implementation

```typescript
// GarminService.ts
import { Linking } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const WEB_SERVER = 'https://your-domain.com'

export class GarminService {
  // Garmin 연결 시작
  static async connect(userId: string) {
    const authUrl = `${WEB_SERVER}/api/auth/garmin/start?user_id=${userId}`
    await Linking.openURL(authUrl)
  }

  // 연결 상태 확인
  static async checkConnection(userId: string) {
    const response = await fetch(
      `${WEB_SERVER}/api/garmin/connection-status?user_id=${userId}`
    )
    return response.json()
  }

  // 활동 데이터 가져오기
  static async fetchActivities(userId: string, params = {}) {
    const queryParams = new URLSearchParams({
      user_id: userId,
      ...params
    })

    const response = await fetch(
      `${WEB_SERVER}/api/garmin/activities?${queryParams}`
    )
    return response.json()
  }

  // 통계 가져오기
  static async fetchStats(userId: string, period = 7) {
    const response = await fetch(
      `${WEB_SERVER}/api/garmin/stats?user_id=${userId}&period=${period}`
    )
    return response.json()
  }

  // 연결 해제
  static async disconnect(userId: string, keepData = false) {
    const response = await fetch(`${WEB_SERVER}/api/garmin/disconnect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, keep_data: keepData })
    })
    return response.json()
  }
}

// Deep Link Handler
Linking.addEventListener('url', (event) => {
  const { url } = event

  if (url.includes('garmin-success')) {
    // 연결 성공 처리
    const userId = url.split('user_id=')[1]
    console.log('Garmin connected for user:', userId)
    // UI 업데이트, 활동 데이터 가져오기 등

  } else if (url.includes('garmin-error')) {
    // 연결 실패 처리
    const error = url.split('error=')[1]
    console.error('Garmin connection failed:', decodeURIComponent(error))
    // 에러 메시지 표시
  }
})
```

### 3. UI Components Example

```typescript
// GarminConnectButton.tsx
import React, { useState, useEffect } from 'react'
import { View, Button, Text, ActivityIndicator } from 'react-native'
import { GarminService } from './GarminService'

export function GarminConnectButton({ userId }) {
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    try {
      const status = await GarminService.checkConnection(userId)
      setConnectionStatus(status)
    } catch (error) {
      console.error('Failed to check status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = () => {
    GarminService.connect(userId)
  }

  const handleDisconnect = async () => {
    try {
      await GarminService.disconnect(userId)
      setConnectionStatus({ connected: false })
    } catch (error) {
      console.error('Failed to disconnect:', error)
    }
  }

  if (loading) return <ActivityIndicator />

  return (
    <View>
      {connectionStatus?.connected ? (
        <>
          <Text>✅ Garmin Connected</Text>
          <Text>Recent activities: {connectionStatus.recent_activities}</Text>
          <Button title="Disconnect" onPress={handleDisconnect} />
        </>
      ) : (
        <Button title="Connect Garmin" onPress={handleConnect} />
      )}
    </View>
  )
}
```

## 🔄 Data Flow

### 1. OAuth 2.0 PKCE Connection Flow
```
1. User taps "Connect Garmin" in mobile app
2. App opens web browser with /api/auth/garmin/start?user_id=xxx
3. Server generates code_verifier and code_challenge (PKCE)
4. Server redirects to Garmin OAuth 2.0 with challenge
5. User logs in to Garmin and approves access
6. Garmin redirects to /api/auth/garmin/callback with code
7. Server exchanges code + verifier for access/refresh tokens
8. Server saves connection and redirects to mobile app
9. Mobile app updates UI to show connected status
```

### 2. Activity Sync Flow
```
1. User completes activity with Garmin device
2. Garmin sends webhook to server
3. Server processes webhook and saves activity data
4. Mobile app fetches latest activities via API
5. User sees updated activity list in app
```

## 🔒 Security Considerations

1. **PKCE (Proof Key for Code Exchange)**: Prevents authorization code interception
2. **State Parameter**: CSRF protection in OAuth flow
3. **Bearer Token**: OAuth 2.0 access tokens with 24-hour expiration
4. **Token Storage**: Access tokens stored only on server with encryption
5. **HTTPS Required**: All communication must use HTTPS
6. **Rate Limiting**: Implement rate limiting on all endpoints
7. **User Isolation**: Each user can only access their own data
8. **Webhook Validation**: Basic payload validation (no signature verification needed)
9. **Token Refresh**: Automatic refresh token handling (3-month expiration)

## 🐛 Troubleshooting

### Common Issues

1. **OAuth Callback Not Working**
   - Check callback URL in Garmin app settings
   - Verify environment variables
   - Check server logs for errors

2. **Webhooks Not Received**
   - Verify webhook URLs in Garmin settings
   - Check webhook signature verification
   - Monitor /api/webhook/garmin/status endpoint

3. **Mobile Deep Links Not Working**
   - Verify URL scheme configuration
   - Test with command: `adb shell am start -W -a android.intent.action.VIEW -d "fitculator://test"`
   - iOS: Check Info.plist configuration

## 📊 Database Schema

### garmin_connections
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to users)
- `garmin_user_id`: TEXT (Unique)
- `access_token`: TEXT
- `refresh_token`: TEXT
- `token_expires_at`: TIMESTAMPTZ
- `scopes`: TEXT[]
- `needs_reauth`: BOOLEAN
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

### garmin_activities
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to users)
- `garmin_activity_id`: TEXT (Unique)
- `activity_name`: TEXT
- `activity_type`: TEXT
- `start_time`: TIMESTAMPTZ
- `end_time`: TIMESTAMPTZ
- `duration_seconds`: INTEGER
- `distance_meters`: REAL
- `calories`: INTEGER
- `avg_heart_rate`: INTEGER
- `max_heart_rate`: INTEGER
- `min_heart_rate`: INTEGER
- `steps`: INTEGER
- `floors_climbed`: INTEGER
- `intensity_minutes`: INTEGER
- `stress_level`: INTEGER
- `is_manual`: BOOLEAN
- `is_auto_detected`: BOOLEAN
- `file_url`: TEXT
- `raw_data`: JSONB
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

### webhook_logs
- `id`: UUID (Primary Key)
- `type`: TEXT
- `garmin_user_id`: TEXT
- `summary_id`: TEXT
- `file_type`: TEXT
- `callback_url`: TEXT
- `payload`: JSONB
- `status`: TEXT
- `error_message`: TEXT
- `retry_count`: INTEGER
- `processed_at`: TIMESTAMPTZ
- `created_at`: TIMESTAMPTZ

## 🚀 Deployment Checklist

- [ ] Set all environment variables in production
- [ ] Configure Garmin app with production URLs
- [ ] Test OAuth flow end-to-end
- [ ] Verify webhook signature in production
- [ ] Set up monitoring for webhook failures
- [ ] Configure rate limiting
- [ ] Test mobile deep links
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure CORS settings if needed
- [ ] Document API endpoints for mobile team