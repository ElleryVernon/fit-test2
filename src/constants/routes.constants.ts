/**
 * 라우트 관련 상수
 */

export const PUBLIC_ROUTES = {
  HOME: "/",
  PRIVACY_POLICY: "/privacy-policy",
  REQUEST_DEMO: "/request-demo",
} as const;

export const AUTH_ROUTES = {
  TEST_AUTH: "/test-auth",
  GARMIN_TEST: "/garmin-test",
} as const;

export const API_ROUTES = {
  AUTH: {
    BASE: "/api/auth",
    CALLBACK: {
      APPLE: "/api/auth/callback/apple",
      GARMIN: "/api/auth/garmin/callback",
    },
    GARMIN: {
      START: "/api/auth/garmin/start",
    },
  },
  GARMIN: {
    ACTIVITIES: "/api/garmin/activities",
    CONNECTION_STATUS: "/api/garmin/connection-status",
    DISCONNECT: "/api/garmin/disconnect",
    PERMISSIONS: "/api/garmin/permissions",
    STATS: "/api/garmin/stats",
    USER_ID: "/api/garmin/user-id",
  },
  WEBHOOK: {
    GARMIN: {
      ACTIVITIES: "/api/webhook/garmin/activities",
      ACTIVITY_DETAILS: "/api/webhook/garmin/activity-details",
      ACTIVITY_FILES: "/api/webhook/garmin/activity-files",
      DEREGISTRATIONS: "/api/webhook/garmin/deregistrations",
      MANUAL_ACTIVITIES: "/api/webhook/garmin/manual-activities",
      MOVEIQ: "/api/webhook/garmin/moveiq",
      PERMISSIONS: "/api/webhook/garmin/permissions",
      RETRY: "/api/webhook/garmin/retry",
      STATUS: "/api/webhook/garmin/status",
    },
  },
  REQUEST_DEMO: "/api/request-demo",
  SUBSCRIBE: "/api/subscribe",
  STUDIO: {
    PAYMENTS: {
      CONFIRM: "/api/studio/payments/confirm",
    },
  },
} as const;
