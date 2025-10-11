import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { garminWebhookService } from "@/core/services";

export async function POST(request: NextRequest) {
  try {
    // 관리자 인증 체크 (선택사항)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 실패한 webhook 재처리
    const failedWebhooks = await prisma.webhookLog.findMany({
      where: {
        status: "failed",
        retryCount: { lt: 3 },
      },
      select: { id: true },
      take: 10,
    });

    const results = await Promise.allSettled(
      failedWebhooks.map((w) => garminWebhookService.processWebhook(w.id))
    );

    return NextResponse.json({
      retried: results.length,
      success: results.filter((r) => r.status === "fulfilled").length,
    });
  } catch {
    return NextResponse.json({ error: "Retry failed" }, { status: 500 });
  }
}
