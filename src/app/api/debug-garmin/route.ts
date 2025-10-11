import { prisma } from "@/lib/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  try {
    // 1. 연결 정보
    const connection = await prisma.garminConnection.findFirst({
      where: { userId },
    });

    // 2. 활동 데이터
    const activities = await prisma.garminActivity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // 3. Webhook 로그
    const webhooks = await prisma.webhookLog.findMany({
      where: { garminUserId: connection?.garminUserId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      connection: connection
        ? {
            garminUserId: connection.garminUserId,
            scopes: connection.scopes,
            needsReauth: connection.needsReauth,
            createdAt: connection.createdAt,
            updatedAt: connection.updatedAt,
          }
        : null,
      activities: {
        total: activities.length,
        data: activities.map((a) => ({
          id: a.id,
          name: a.activityName,
          type: a.activityType,
          startTime: a.startTime,
          createdAt: a.createdAt,
        })),
      },
      webhooks: {
        total: webhooks.length,
        data: webhooks.map((w) => ({
          type: w.type,
          status: w.status,
          createdAt: w.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: "Failed to fetch debug info" },
      { status: 500 }
    );
  }
}

