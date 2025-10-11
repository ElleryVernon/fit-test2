/**
 * Garmin API 관련 설정
 */

export const garminConfig = {
  api: {
    baseUrl:
      process.env.GARMIN_API_BASE_URL ||
      "https://apis.garmin.com/wellness-api/rest",
    consumerKey: process.env.GARMIN_CONSUMER_KEY || "",
    consumerSecret: process.env.GARMIN_CONSUMER_SECRET || "",
  },
  oauth: {
    requestTokenUrl: "/oauth-service/oauth/request_token",
    accessTokenUrl: "/oauth-service/oauth/access_token",
    authorizeUrl: "https://connect.garmin.com/oauthConfirm",
  },
  webhook: {
    backfillUrl: "/backfill",
    deregistrationUrl: "/registration",
  },
  callbackUrl:
    process.env.NEXT_PUBLIC_BASE_URL + "/api/garmin/oauth/callback" ||
    "http://localhost:3000/api/garmin/oauth/callback",
} as const;
