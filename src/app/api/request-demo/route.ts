import { NextResponse } from "next/server";
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company_name, your_name, email, message, origin } = body;

    if (!company_name || !your_name || !email || !message || !origin) {
      return NextResponse.json(
        { error: "All fields including origin are required" },
        { status: 400 }
      );
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

    return NextResponse.json(
      { message: "Request submitted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
