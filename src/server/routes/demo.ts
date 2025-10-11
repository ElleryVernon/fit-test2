import { Elysia, t } from "elysia";
import { prisma } from "@/lib/db/client";

const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL!;

async function sendSlackNotification({
  company_name,
  your_name,
  email,
  message,
  origin,
}: {
  company_name: string;
  your_name: string;
  email: string;
  message: string;
  origin: string;
}) {
  const slackMessage = {
    text: `*New Demo Request*\n• Company: ${company_name}\n• Name: ${your_name}\n• Email: ${email}\n• Origin: ${origin}\n• Message: ${message}`,
  };

  await fetch(slackWebhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(slackMessage),
  });
}

/**
 * Demo Request API 라우트
 */
export const demoRoutes = new Elysia({ prefix: "/request-demo" })
  // POST /api/request-demo
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const { company_name, your_name, email, message, origin } = body;

        if (!company_name || !your_name || !email || !message || !origin) {
          set.status = 400;
          return { error: "All fields including origin are required" };
        }

        await prisma.demoRequest.create({
          data: {
            companyName: company_name,
            yourName: your_name,
            email,
            message,
            origin,
          },
        });

        await sendSlackNotification({
          company_name,
          your_name,
          email,
          message,
          origin,
        });

        return { message: "Request submitted successfully" };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Server error";
        console.error("Demo request error:", errorMessage);
        set.status = 500;
        return { error: errorMessage };
      }
    },
    {
      body: t.Object({
        company_name: t.String(),
        your_name: t.String(),
        email: t.String(),
        message: t.String(),
        origin: t.String(),
      }),
    }
  );
