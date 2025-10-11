import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    // 연결 정보 조회
    const connection = await prisma.garminConnection.findFirst({
      where: { userId },
    });

    if (!connection) {
      // 연결이 없는 경우
      return NextResponse.json({
        connected: false,
        message: "No Garmin connection found",
      });
    }

    // 최근 활동 수 조회
    const activityCount = await prisma.garminActivity.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // 토큰 만료 체크 (필요한 경우)
    const tokenExpired = connection.tokenExpiresAt
      ? new Date(connection.tokenExpiresAt) < new Date()
      : false;

    return NextResponse.json({
      connected: true,
      garmin_user_id: connection.garminUserId,
      needs_reauth: connection.needsReauth || tokenExpired,
      scopes: connection.scopes,
      connected_at: connection.createdAt,
      last_updated: connection.updatedAt,
      recent_activities: activityCount,
    });
  } catch (error) {
    console.error("Connection status error:", error);
    return NextResponse.json(
      { error: "Failed to check connection status" },
      { status: 500 }
    );
  }
}

// OPTIONS 요청 처리 (CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
