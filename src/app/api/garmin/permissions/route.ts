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
        scopes: true,
      },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "No Garmin connection found" },
        { status: 404 }
      );
    }

    // 이미 저장된 권한이 있으면 반환
    if (connection.scopes && connection.scopes.length > 0) {
      return NextResponse.json({
        permissions: connection.scopes,
        source: "cached",
      });
    }

    // 없으면 Garmin API에서 실시간 조회
    try {
      const permissions = await garminOAuthService.fetchGarminPermissions(
        connection.accessToken
      );

      // DB에 저장
      await prisma.garminConnection.updateMany({
        where: { userId },
        data: { scopes: permissions },
      });

      return NextResponse.json({
        permissions: permissions,
        source: "live",
      });
    } catch (apiError) {
      console.error("Failed to fetch Garmin permissions:", apiError);
      return NextResponse.json(
        { error: "Failed to fetch permissions" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Permissions endpoint error:", error);
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
