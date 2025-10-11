import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    // 최근 24시간 통계
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const stats = await prisma.webhookLog.findMany({
      where: { createdAt: { gte: yesterday } },
      select: { status: true, type: true },
    });

    // 상태별 집계
    type Summary = {
      pending: number;
      processing: number;
      success: number;
      failed: number;
      types: Record<string, number>;
    };

    const summary = stats.reduce<Summary>(
      (acc, log) => {
        const status = log.status as
          | "pending"
          | "processing"
          | "success"
          | "failed"
          | null;
        if (status) {
          acc[status] = (acc[status] || 0) + 1;
        }
        acc.types[log.type] = (acc.types[log.type] || 0) + 1;
        return acc;
      },
      { pending: 0, processing: 0, success: 0, failed: 0, types: {} }
    );

    // 최근 로그 10개
    const recent = await prisma.webhookLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      status: "healthy",
      last_24h: summary,
      recent_logs: recent,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch status" },
      { status: 500 }
    );
  }
}
