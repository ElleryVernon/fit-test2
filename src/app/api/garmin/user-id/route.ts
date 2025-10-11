import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { garminOAuthService } from "@/core/services";

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
      select: {
        accessToken: true,
        garminUserId: true,
      },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "No Garmin connection found" },
        { status: 404 }
      );
    }

    // 이미 저장된 Garmin User ID가 있으면 반환
    if (connection.garminUserId) {
      return NextResponse.json({
        garmin_user_id: connection.garminUserId,
      });
    }

    // 없으면 Garmin API에서 조회
    try {
      const garminUserId = await garminOAuthService.fetchGarminUserId(
        connection.accessToken
      );

      // DB에 저장
      await prisma.garminConnection.updateMany({
        where: { userId },
        data: { garminUserId },
      });

      return NextResponse.json({
        garmin_user_id: garminUserId,
      });
    } catch (apiError) {
      console.error("Failed to fetch Garmin user ID:", apiError);
      return NextResponse.json(
        { error: "Failed to fetch Garmin user ID" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("User ID endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
