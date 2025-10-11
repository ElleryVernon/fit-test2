#!/bin/bash

# Garmin Webhook 테스트 스크립트
# 사용법: ./scripts/test-garmin-webhooks.sh https://fit-test2.vercel.app

BASE_URL=${1:-"http://localhost:3000"}
GARMIN_USER_ID="782422b07d4a84aa9c7a3fced59ee45c"

echo "🧪 Garmin Webhook 테스트 시작"
echo "Base URL: $BASE_URL"
echo "Garmin User ID: $GARMIN_USER_ID"
echo ""
echo "================================"
echo ""

# 1. Activities Webhook 테스트
echo "1️⃣ Activities Webhook 테스트"
echo "   POST $BASE_URL/api/webhook/garmin/activities"
echo ""

curl -X POST "$BASE_URL/api/webhook/garmin/activities" \
  -H "Content-Type: application/json" \
  -H "garmin-client-id: test-client" \
  -d '{
    "activities": [
      {
        "userId": "'"$GARMIN_USER_ID"'",
        "summaryId": "test-activity-001",
        "activityId": 99999001,
        "activityName": "Test Running",
        "activityDescription": "Test activity",
        "durationInSeconds": 1800,
        "startTimeInSeconds": '$(date -v-1d +%s)',
        "startTimeOffsetInSeconds": -18000,
        "activityType": "RUNNING",
        "averageHeartRateInBeatsPerMinute": 145,
        "activeKilocalories": 300,
        "distanceInMeters": 5000,
        "steps": 6000
      }
    ]
  }' | jq '.'

echo ""
echo "---"
echo ""

# 2. Manual Activities Webhook 테스트
echo "2️⃣ Manual Activities Webhook 테스트"
echo "   POST $BASE_URL/api/webhook/garmin/manual-activities"
echo ""

curl -X POST "$BASE_URL/api/webhook/garmin/manual-activities" \
  -H "Content-Type: application/json" \
  -H "garmin-client-id: test-client" \
  -d '{
    "manualActivities": [
      {
        "userId": "'"$GARMIN_USER_ID"'",
        "summaryId": "test-manual-activity-001",
        "activityId": 99999002,
        "activityName": "Manual Test Activity",
        "activityDescription": "Test manual activity",
        "durationInSeconds": 3600,
        "startTimeInSeconds": '$(date -v-1d +%s)',
        "startTimeOffsetInSeconds": -18000,
        "activityType": "RUNNING",
        "averageHeartRateInBeatsPerMinute": 145,
        "activeKilocalories": 500,
        "distanceInMeters": 10000,
        "steps": 12000
      }
    ]
  }' | jq '.'

echo ""
echo "---"
echo ""

# 3. MoveIQ Webhook 테스트
echo "3️⃣ MoveIQ Webhook 테스트"
echo "   POST $BASE_URL/api/webhook/garmin/moveiq"
echo ""

curl -X POST "$BASE_URL/api/webhook/garmin/moveiq" \
  -H "Content-Type: application/json" \
  -H "garmin-client-id: test-client" \
  -d '{
    "moveIQActivities": [
      {
        "userId": "'"$GARMIN_USER_ID"'",
        "summaryId": "test-moveiq-001",
        "calendarDate": "2025-10-11",
        "startTimeInSeconds": '$(date -v-1h +%s)',
        "durationInSeconds": 300,
        "activityType": "Running",
        "activitySubType": "Hurdles",
        "offsetInSeconds": -18000
      }
    ]
  }' | jq '.'

echo ""
echo "---"
echo ""

# 4. CONSUMER_PERMISSIONS Webhook 테스트
echo "4️⃣ CONSUMER_PERMISSIONS Webhook 테스트"
echo "   POST $BASE_URL/api/webhook/garmin/permissions"
echo ""

curl -X POST "$BASE_URL/api/webhook/garmin/permissions" \
  -H "Content-Type: application/json" \
  -H "garmin-client-id: test-client" \
  -d '{
    "userPermissionsChange": [
      {
        "userId": "'"$GARMIN_USER_ID"'",
        "summaryId": "test-permission-change",
        "permissions": [
          "ACTIVITY_EXPORT",
          "HEALTH_EXPORT",
          "WORKOUT_IMPORT",
          "MCT_EXPORT",
          "COURSE_IMPORT"
        ],
        "changeTimeInSeconds": '$(date +%s)'
      }
    ]
  }' | jq '.'

echo ""
echo "---"
echo ""

# 5. USER_DEREG Webhook 테스트
echo "5️⃣ USER_DEREG Webhook 테스트"
echo "   POST $BASE_URL/api/webhook/garmin/deregistrations"
echo ""

curl -X POST "$BASE_URL/api/webhook/garmin/deregistrations" \
  -H "Content-Type: application/json" \
  -H "garmin-client-id: test-client" \
  -d '{
    "deregistrations": [
      {
        "userId": "test-deregistration-user-123"
      }
    ]
  }' | jq '.'

echo ""
echo "---"
echo ""

# 6. Activity Details Webhook 테스트
echo "6️⃣ Activity Details Webhook 테스트"
echo "   POST $BASE_URL/api/webhook/garmin/activity-details"
echo ""

curl -X POST "$BASE_URL/api/webhook/garmin/activity-details" \
  -H "Content-Type: application/json" \
  -H "garmin-client-id: test-client" \
  -d '{
    "activityDetails": [
      {
        "userId": "'"$GARMIN_USER_ID"'",
        "summaryId": "test-activity-detail-001",
        "activityId": 99999003,
        "summary": {
          "activityId": 99999003,
          "activityName": "Test Activity Detail",
          "durationInSeconds": 2400,
          "startTimeInSeconds": '$(date -v-2h +%s)',
          "activityType": "RUNNING",
          "averageHeartRateInBeatsPerMinute": 150,
          "activeKilocalories": 400,
          "distanceInMeters": 8000
        }
      }
    ]
  }' | jq '.'

echo ""
echo "================================"
echo ""
echo "✅ 모든 Webhook 테스트 완료!"
echo ""
echo "📊 결과 확인:"
echo "   curl $BASE_URL/api/webhook/garmin/status | jq"
echo ""
echo "🔍 연결 상태 확인:"
echo "   curl \"$BASE_URL/api/garmin/connection-status?user_id=FEsfOEqLldvoLCteXUKP6cy6uWMVuNjx\" | jq"
echo ""
echo "⚠️  주의: garminUserId가 DB에 없으면 모두 실패합니다."
echo "   먼저 Garmin OAuth 연결을 완료하세요!"

