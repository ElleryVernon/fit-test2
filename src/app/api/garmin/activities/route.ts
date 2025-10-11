import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("user_id");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const activityType = searchParams.get("activity_type");

    if (!userId) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    // 쿼리 조건 빌드
    const whereConditions: Record<string, unknown> = {
      userId,
    };

    // 날짜 필터
    if (startDate || endDate) {
      whereConditions.startTime = {};
      if (startDate) {
        (whereConditions.startTime as Record<string, unknown>).gte = new Date(
          startDate
        );
      }
      if (endDate) {
        (whereConditions.startTime as Record<string, unknown>).lte = new Date(
          endDate
        );
      }
    }

    // 활동 타입 필터
    if (activityType) {
      whereConditions.activityType = activityType;
    }

    const activities = await prisma.garminActivity.findMany({
      where: whereConditions,
      orderBy: { startTime: "desc" },
      take: limit,
      skip: offset,
    });

    // 응답 데이터 정리
    const formattedActivities = activities.map((activity) => ({
      id: activity.id,
      activity_id: activity.garminActivityId,
      name: activity.activityName,
      type: activity.activityType,
      start_time: activity.startTime,
      duration_minutes: activity.durationSeconds
        ? Math.round(activity.durationSeconds / 60)
        : null,
      distance_km: activity.distanceMeters
        ? (activity.distanceMeters / 1000).toFixed(2)
        : null,
      calories: activity.calories,
      heart_rate: {
        avg: activity.avgHeartRate,
        max: activity.maxHeartRate,
        min: activity.minHeartRate,
      },
      steps: activity.steps,
      is_manual: activity.isManual,
      is_auto_detected: activity.isAutoDetected,
    }));

    return NextResponse.json({
      activities: formattedActivities,
      pagination: {
        total: activities.length,
        limit,
        offset,
        has_more: activities.length === limit,
      },
    });
  } catch (error) {
    console.error("Activities fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

// 특정 활동 조회
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, activity_id } = body;

    if (!user_id || !activity_id) {
      return NextResponse.json(
        { error: "user_id and activity_id are required" },
        { status: 400 }
      );
    }

    const activity = await prisma.garminActivity.findFirst({
      where: {
        userId: user_id,
        garminActivityId: activity_id,
      },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      activity: {
        ...activity,
        duration_minutes: activity.durationSeconds
          ? Math.round(activity.durationSeconds / 60)
          : null,
        distance_km: activity.distanceMeters
          ? (activity.distanceMeters / 1000).toFixed(2)
          : null,
      },
    });
  } catch (error) {
    console.error("Activity fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
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
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
