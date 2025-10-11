import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, keep_data = false } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    // 1. 연결 정보 조회
    const connection = await prisma.garminConnection.findFirst({
      where: { userId: user_id },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "No Garmin connection found" },
        { status: 404 }
      );
    }

    // 2. Garmin API에 연결 해제 요청 (선택적 - Garmin API가 지원하는 경우)
    // 실제 Garmin API에서 토큰 무효화 엔드포인트가 있다면 여기서 호출
    // await revokeGarminToken(connection.accessToken)

    // 3. 연결 정보 삭제
    await prisma.garminConnection.delete({
      where: { id: connection.id },
    });

    // 4. 활동 데이터 처리 (선택적)
    if (!keep_data) {
      // 사용자가 데이터 삭제를 원하는 경우
      await prisma.garminActivity.deleteMany({
        where: { userId: user_id },
      });
    }

    // 5. 관련 webhook 로그 정리 (선택적)
    await prisma.webhookLog.deleteMany({
      where: {
        garminUserId: connection.garminUserId,
        status: { in: ["pending", "processing"] },
      },
    });

    console.log(`Garmin disconnected for user: ${user_id}`);

    return NextResponse.json({
      success: true,
      message: "Garmin connection removed successfully",
      data_kept: keep_data,
    });
  } catch (error) {
    console.error("Disconnect error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect Garmin" },
      { status: 500 }
    );
  }
}

// 연결 상태만 삭제하고 데이터는 유지 (soft disconnect)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    // needs_reauth 플래그만 설정 (연결은 유지하되 재인증 필요 표시)
    const connection = await prisma.garminConnection.findFirst({
      where: { userId: user_id },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "No Garmin connection found" },
        { status: 404 }
      );
    }

    const updatedConnection = await prisma.garminConnection.update({
      where: { id: connection.id },
      data: { needsReauth: true },
    });

    return NextResponse.json({
      success: true,
      message: "Connection marked for re-authentication",
      connection: updatedConnection,
    });
  } catch (error) {
    console.error("Soft disconnect error:", error);
    return NextResponse.json(
      { error: "Failed to update connection" },
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
      "Access-Control-Allow-Methods": "POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
