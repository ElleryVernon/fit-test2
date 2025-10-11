#!/bin/bash

# Garmin Webhook 테스트 스크립트
# 프로덕션 전환을 위한 3개 Webhook 테스트

BASE_URL=${1:-"https://fit-test2.vercel.app"}
GARMIN_USER_ID="782422b07d4a84aa9c7a3fced59ee45c"

echo "🧪 Garmin Webhook 테스트 시작"
echo "Base URL: $BASE_URL"
echo ""

# 1. CONSUMER_PERMISSIONS Webhook 테스트
echo "1️⃣ CONSUMER_PERMISSIONS Webhook 테스트"
echo "   POST $BASE_URL/api/webhook/garmin/permissions"

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

# 2. GC_ACTIVITY_UPDATE (Manual Activities) Webhook 테스트
echo "2️⃣ GC_ACTIVITY_UPDATE (Manual Activities) Webhook 테스트"
echo "   POST $BASE_URL/api/webhook/garmin/manual-activities"

curl -X POST "$BASE_URL/api/webhook/garmin/manual-activities" \
  -H "Content-Type: application/json" \
  -H "garmin-client-id: test-client" \
  -d '{
    "manualActivities": [
      {
        "userId": "'"$GARMIN_USER_ID"'",
        "summaryId": "test-manual-activity-001",
        "activityId": 99999001,
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

# 3. USER_DEREG (Deregistration) Webhook 테스트
echo "3️⃣ USER_DEREG (Deregistration) Webhook 테스트"
echo "   POST $BASE_URL/api/webhook/garmin/deregistrations"

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

echo "✅ 모든 Webhook 테스트 완료!"
echo ""
echo "📊 결과 확인:"
echo "   curl $BASE_URL/api/webhook/garmin/status | jq"

