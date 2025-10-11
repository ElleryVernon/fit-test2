/**
 * 애플리케이션 전역 설정
 */

export const appConfig = {
  name: "Fitculator",
  description: "The performance platform for athlete-run fitness businesses",
  url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  locale: {
    default: "en",
    supported: ["en", "ko"] as const,
  },
  contact: {
    email: process.env.CONTACT_EMAIL || "contact@fitculator.com",
    slackWebhook: process.env.SLACK_WEBHOOK_URL || "",
  },
} as const;
