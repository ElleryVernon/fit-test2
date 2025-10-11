# 🔍 가민 API 디버깅 가이드

## 문제: 활동 데이터가 조회되지 않음

가민 앱에는 운동 데이터가 있는데 API에서 조회가 안 되는 경우

### 원인

**가민 파트너 API와 일반 사용자 API는 다릅니다!**

#### 일반 사용자 API (개인 개발자)

```
GET /wellness-api/rest/activities
```

#### 파트너 API (Enterprise/Partner)

```
POST /wellness-api/rest/backfill/activities
또는 Webhook으로 자동 수신
```

### 해결 방법

#### 1. Backfill API 사용 (수동 데이터 요청)

```bash
# 수동 동기화 API 호출
curl -X POST "http://localhost:3000/api/garmin/sync" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID",
    "force": true
  }'
```

#### 2. API 엔드포인트 확인

```typescript
// 현재 사용 중인 엔드포인트 (수정됨)
const endpoint = `/backfill/activities?uploadStartTimeInSeconds=${start}&uploadEndTimeInSeconds=${end}`;
```

#### 3. 토큰 권한 확인

```bash
# 권한 확인 API
curl "http://localhost:3000/api/garmin/permissions?user_id=YOUR_USER_ID"
```

**필요한 권한:**

- `ACTIVITY_EXPORT` - 활동 데이터 조회
- `WELLNESS_READ` - 웰니스 데이터 조회

#### 4. 로그 확인

```bash
# 개발 서버 로그에서 다음을 확인
[GarminSync] Fetching activities for user...
[GarminSync] Found X activities, processing...
[GarminSync] Successfully synced X/X activities
```

**에러 패턴:**

- `401/403`: 토큰 만료 또는 권한 부족
- `404`: 잘못된 엔드포인트
- `500`: 가민 API 오류
- `[]` (빈 배열): 데이터 없음 또는 기간 설정 오류

### 테스트 시나리오

#### 시나리오 1: 수동 동기화 테스트

```bash
# 1. 연결 상태 확인
curl "http://localhost:3000/api/garmin/connection-status?user_id=USER_ID"

# 2. 강제 동기화
curl -X POST "http://localhost:3000/api/garmin/sync" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "USER_ID", "force": true}'

# 3. 활동 조회
curl "http://localhost:3000/api/garmin/activities?user_id=USER_ID"
```

#### 시나리오 2: Webhook 테스트

```bash
# Webhook 상태 확인
curl "http://localhost:3000/api/webhook/garmin/status"
```

**Webhook이 작동하려면:**

1. 가민 Developer Portal에서 Webhook URL 등록
2. URL: `https://yourdomain.com/api/webhook/garmin/activities`
3. 활동 발생 시 가민이 자동으로 푸시

### API 엔드포인트 차이점

| 기능        | 일반 사용자 API   | 파트너 API                   |
| ----------- | ----------------- | ---------------------------- |
| 활동 조회   | `GET /activities` | `POST /backfill/activities`  |
| 데이터 수신 | Pull (직접 요청)  | Push (Webhook) + Backfill    |
| 실시간성    | 요청 시점         | Webhook 즉시 + Backfill 과거 |
| 권한        | 개인 OAuth        | 파트너 계약                  |

### 가민 파트너 Backfill API 사용법

#### 요청 예시

```typescript
POST https://apis.garmin.com/wellness-api/rest/backfill/activities
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "uploadStartTimeInSeconds": 1696118400,  // 시작 시간
  "uploadEndTimeInSeconds": 1698796800      // 종료 시간
}
```

#### 응답 예시

```json
[
  {
    "summaryId": "12345",
    "activityType": "RUNNING",
    "activityName": "Morning Run",
    "startTimeInSeconds": 1696120000,
    "durationInSeconds": 1800,
    "distanceInMeters": 5000,
    "activeKilocalories": 300,
    "averageHeartRateInBeatsPerMinute": 145
  }
]
```

### 문제 해결 체크리스트

- [ ] 가민 파트너 계정 확인
- [ ] OAuth 토큰이 유효한지 확인 (`/connection-status`)
- [ ] 권한이 있는지 확인 (`/permissions`)
- [ ] Backfill API 엔드포인트 사용 확인
- [ ] 날짜 범위가 올바른지 확인 (최근 30일)
- [ ] Webhook URL 등록 확인 (가민 Developer Portal)
- [ ] 로그에서 에러 메시지 확인

### 일반적인 에러와 해결

#### 에러 1: `Authentication failed: 401`

**원인**: 토큰 만료  
**해결**: 재연결 필요

```bash
# 재연결 URL
http://localhost:3000/api/auth/garmin/start?user_id=USER_ID
```

#### 에러 2: `No activities found`

**원인**:

- 데이터가 실제로 없음
- 날짜 범위가 잘못됨
- 권한 부족

**해결**:

```bash
# 1. 권한 확인
curl "http://localhost:3000/api/garmin/permissions?user_id=USER_ID"

# 2. 더 긴 기간으로 재시도 (90일)
# garmin-sync.service.ts에서 기간 조정
```

#### 에러 3: `Endpoint not found: 404`

**원인**: 잘못된 API 엔드포인트  
**해결**: Backfill API 사용 확인

```typescript
// 올바른 엔드포인트
const endpoint = `/backfill/activities?uploadStartTimeInSeconds=${start}&uploadEndTimeInSeconds=${end}`;
```

### 디버깅 명령어

```bash
# 1. 연결 상태 + 데이터 신선도
curl "http://localhost:3000/api/garmin/connection-status?user_id=USER_ID" | jq

# 2. 수동 동기화 (상세 로그)
curl -X POST "http://localhost:3000/api/garmin/sync" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "USER_ID", "force": true}' | jq

# 3. 활동 조회
curl "http://localhost:3000/api/garmin/activities?user_id=USER_ID" | jq

# 4. Webhook 로그 확인
curl "http://localhost:3000/api/webhook/garmin/status" | jq
```

### 예상 동작 (정상)

```
1. 사용자가 가민 연결
2. OAuth 토큰 획득
3. Backfill API로 최근 30일 데이터 요청
4. 가민 API 응답 (활동 배열)
5. DB에 Upsert (중복 방지)
6. 이후 Webhook으로 실시간 수신

로그:
[GarminSync] Fetching activities for user abc123...
[GarminSync] Found 45 activities, processing...
[GarminSync] Successfully synced 45/45 activities
```

### 다음 단계

1. ✅ Backfill API 엔드포인트 수정 완료
2. ⏳ 수동 동기화 테스트
3. ⏳ 로그 확인
4. ⏳ 데이터 조회 확인
5. ⏳ Webhook 설정 (선택사항)

---

**업데이트**: 2025-10-11  
**변경사항**: `/activities` → `/backfill/activities` 엔드포인트 수정
