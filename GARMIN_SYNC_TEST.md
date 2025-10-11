# 🧪 가민 동기화 테스트 가이드

## 현재 상황

가민 앱에는 운동 데이터가 있는데 API에서 조회되지 않는 문제를 해결했습니다.

### 문제 원인

1. **잘못된 API 엔드포인트 사용**

   - 기존: `/activities` (일반 사용자 API)
   - 파트너: `/activities` 또는 `/backfill/activities` (둘 다 시도)

2. **응답 형식 불명확**
   - 배열로 직접 반환 vs `{ activities: [...] }` 객체

### 적용된 수정

```typescript
// Fallback 로직 추가
try {
  // 방법 1: GET /activities
  response = await fetch(`/activities?uploadStartTime...`);
} catch {
  // 방법 2: POST /backfill/activities
  response = await fetch(`/backfill/activities`, {
    method: "POST",
    body: JSON.stringify({ uploadStartTime, uploadEndTime }),
  });
}
```

## 🔧 테스트 방법

### 1. 로컬에서 테스트

```bash
# 1. 개발 서버 시작
bun run dev

# 2. 브라우저에서 로그인
open http://localhost:3000

# 3. 가민 연결 (이미 연결되어 있으면 생략)
open http://localhost:3000/garmin-test

# 4. 수동 동기화 실행
curl -X POST "http://localhost:3000/api/garmin/sync" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "YOUR_USER_ID", "force": true}'

# 5. 로그 확인 (터미널)
# 다음과 같은 로그를 찾으세요:
# [GarminSync] Fetching activities for user...
# [GarminSync] Used GET /activities endpoint (또는 POST /backfill/activities)
# [GarminSync] Found X activities
# [GarminSync] Successfully synced X/X activities

# 6. 활동 조회
curl "http://localhost:3000/api/garmin/activities?user_id=YOUR_USER_ID"
```

### 2. 프로덕션에서 테스트

```bash
# Vercel 배포 후 (자동 배포됨)

# 1. 연결 상태 확인
curl "https://fitculator.com/api/garmin/connection-status?user_id=YOUR_USER_ID"

# 2. 수동 동기화
curl -X POST "https://fitculator.com/api/garmin/sync" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "YOUR_USER_ID", "force": true}'

# 3. 활동 조회
curl "https://fitculator.com/api/garmin/activities?user_id=YOUR_USER_ID"
```

## 📊 예상 결과

### 성공 시나리오

**수동 동기화 응답:**

```json
{
  "message": "Sync completed",
  "synced": 25,
  "status": "success"
}
```

**활동 조회 응답:**

```json
{
  "activities": [
    {
      "id": "...",
      "activity_id": "12345",
      "name": "Morning Run",
      "type": "RUNNING",
      "start_time": "2025-10-10T06:00:00.000Z",
      "duration_minutes": 30,
      "distance_km": "5.00",
      "calories": 300,
      "heart_rate": {
        "avg": 145,
        "max": 165,
        "min": 120
      }
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 20,
    "offset": 0,
    "has_more": true
  }
}
```

### 실패 시나리오

#### 시나리오 A: 권한 부족

**응답:**

```json
{
  "error": "No valid Garmin connection found",
  "needs_reauth": true
}
```

**해결:**

```bash
# 재연결
open http://localhost:3000/api/auth/garmin/start?user_id=YOUR_USER_ID
```

#### 시나리오 B: 데이터 없음

**응답:**

```json
{
  "message": "Sync completed",
  "synced": 0,
  "status": "no_data"
}
```

**원인:**

1. 실제로 활동이 없음
2. 날짜 범위가 잘못됨 (현재: 최근 30일)
3. 가민 앱 동기화가 안 됨

**해결:**

1. 가민 앱에서 활동이 있는지 확인
2. 가민 앱과 Garmin Connect 동기화 확인
3. 더 긴 기간으로 재시도 (코드 수정 필요)

#### 시나리오 C: API 오류

**로그:**

```
[GarminSync] GET failed, trying POST /backfill/activities
[GarminSync] Backfill API error: 401
[GarminSync] Sync failed: Authentication failed
```

**해결:**

```bash
# 토큰 갱신 필요
curl "http://localhost:3000/api/garmin/connection-status?user_id=YOUR_USER_ID"
# needs_reauth: true 확인 후 재연결
```

## 🔍 디버깅 체크리스트

### 단계 1: 연결 상태 확인

```bash
curl "http://localhost:3000/api/garmin/connection-status?user_id=YOUR_USER_ID" | jq
```

**확인 사항:**

- `connected: true`
- `needs_reauth: false`
- `scopes` 에 활동 권한 포함

### 단계 2: 권한 확인

```bash
curl "http://localhost:3000/api/garmin/permissions?user_id=YOUR_USER_ID" | jq
```

**필요한 권한:**

- `ACTIVITY_EXPORT` 또는 유사한 활동 관련 권한

### 단계 3: Garmin User ID 확인

```bash
curl "http://localhost:3000/api/garmin/user-id?user_id=YOUR_USER_ID" | jq
```

**응답:**

```json
{
  "garmin_user_id": "abc123..."
}
```

### 단계 4: 로그 확인

**정상 로그:**

```
[GarminSync] Fetching activities for user abc123...
[GarminSync] Used GET /activities endpoint
[GarminSync] Found 25 activities, processing...
[GarminSync] Successfully synced 25/25 activities for user abc123
```

**오류 로그:**

```
[GarminSync] GET failed, trying POST /backfill/activities
[GarminSync] Used POST /backfill/activities endpoint
[GarminSync] Found 0 activities
[GarminSync] No new activities found for user abc123
```

### 단계 5: 데이터베이스 확인

```bash
# Prisma Studio로 확인
bun run db:studio

# 또는 직접 쿼리
# SELECT * FROM garmin_activities WHERE user_id = 'YOUR_USER_ID' ORDER BY created_at DESC;
```

## 🛠️ 문제 해결

### 문제 1: "No activities found"

**가능한 원인:**

1. **날짜 범위 문제**
   - 현재 설정: 최근 30일
   - 가민 앱의 활동이 30일 이전

**해결:**

```typescript
// garmin-sync.service.ts 수정
const startDate =
  options.startDate || new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000); // 90일로 변경
```

2. **가민 앱 동기화 안 됨**

   - 가민 앱 > 설정 > 동기화 확인
   - Garmin Connect 웹사이트에서 활동 확인

3. **권한 부족**

```bash
# 권한 재확인
curl "http://localhost:3000/api/garmin/permissions?user_id=YOUR_USER_ID"
```

### 문제 2: "Authentication failed"

**해결:**

```bash
# 1. 토큰 상태 확인
curl "http://localhost:3000/api/garmin/connection-status?user_id=USER_ID"

# 2. needs_reauth: true 면 재연결
open "http://localhost:3000/api/auth/garmin/start?user_id=USER_ID"
```

### 문제 3: "Endpoint not found"

**원인:** 가민 API 엔드포인트가 다를 수 있음

**해결:** 로그를 보고 어떤 엔드포인트가 사용되었는지 확인

```
[GarminSync] Used GET /activities endpoint  ← 성공
[GarminSync] Used POST /backfill/activities endpoint  ← 성공
```

둘 다 실패하면 가민 파트너 포털에서 API 문서 확인 필요

## 📞 추가 지원

### 가민 Developer Portal

1. https://developer.garmin.com/ 접속
2. Applications > Your App 선택
3. API 엔드포인트 및 권한 확인
4. Webhook 설정 확인

### 로그 수집

문제 보고 시 다음 정보 포함:

1. **연결 상태:**

   ```bash
   curl "http://localhost:3000/api/garmin/connection-status?user_id=USER_ID"
   ```

2. **수동 동기화 결과:**

   ```bash
   curl -X POST "http://localhost:3000/api/garmin/sync" \
     -d '{"user_id":"USER_ID","force":true}'
   ```

3. **터미널 로그:**

   ```
   [GarminSync] ...
   ```

4. **Webhook 상태:**
   ```bash
   curl "http://localhost:3000/api/webhook/garmin/status"
   ```

## ✅ 성공 확인

모든 것이 정상이면:

1. ✅ 수동 동기화 성공 (synced > 0)
2. ✅ 활동 목록 조회 성공
3. ✅ 가민 앱 데이터와 일치
4. ✅ 10분 후 자동 갱신 작동

---

**업데이트**: 2025-10-11  
**커밋**: `6374aa9` - Backfill API 수정
