import { Elysia, t } from "elysia";
import { prisma } from "@/lib/db/client";
import {
  sendSlackNotification,
  createNewsletterSubscriptionMessage,
} from "@/utils/slackNotifier";

const slackWebhookUrl = process.env.SLACK_NEWSLETTER_WEBHOOK_URL;

/**
 * Newsletter Subscribe API 라우트
 */
export const subscribeRoutes = new Elysia({ prefix: "/subscribe" })
  // POST /api/subscribe
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const { email, referrer, origin, honeypot } = body;

        // Honeypot 체크 (스팸 방지)
        if (honeypot) {
          set.status = 400;
          return { error: "Spam detected" };
        }

        // 이메일 유효성 검사
        if (!email || !email.includes("@")) {
          set.status = 400;
          return { error: "Invalid email" };
        }

        if (!origin) {
          set.status = 400;
          return { error: "Origin is required" };
        }

        // 이메일 중복 확인
        const existingEmail = await prisma.newsletterSubscriber.findUnique({
          where: { email },
        });

        // 이메일이 존재하지 않는 경우에만 삽입 (중복 방지)
        if (!existingEmail) {
          try {
            await prisma.newsletterSubscriber.create({
              data: {
                email,
                referrer,
                origin,
              },
            });
          } catch (error) {
            console.error("Database error:", error);
            set.status = 500;
            return { error: "Failed to subscribe" };
          }
        }

        // 슬랙 알림 전송 (새 구독자인 경우에만)
        if (!existingEmail && slackWebhookUrl) {
          try {
            const slackMessage = createNewsletterSubscriptionMessage(
              email,
              referrer || null,
              origin
            );

            await sendSlackNotification(slackWebhookUrl, slackMessage);
          } catch (notificationError) {
            // 슬랙 알림 실패는 사용자 응답에 영향을 주지 않도록 함
            console.error("Slack notification error:", notificationError);
          }
        }

        return { message: "Subscribed successfully" };
      } catch (error) {
        console.error("Server error:", error);
        set.status = 500;
        return { error: "Internal server error" };
      }
    },
    {
      body: t.Object({
        email: t.String(),
        referrer: t.Optional(t.String()),
        origin: t.String(),
        honeypot: t.Optional(t.String()),
      }),
    }
  );
