import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db/client";
import GarminTestClient from "./GarminTestClient";

/**
 * Garmin API 테스트 페이지 (Server Component)
 * 세션과 가민 연결 상태를 서버에서 미리 가져와서 SSR로 렌더링 → 즉시 표시
 */
export default async function GarminTestPage() {
  // 서버에서 세션 가져오기 (SSR - 빠른 초기 렌더링)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user || null;

  // 로그인된 사용자라면 가민 연결 상태도 서버에서 미리 가져오기
  let initialConnectionStatus: {
    connected: boolean;
    garmin_user_id?: string;
    needs_reauth?: boolean;
    scopes?: string[];
    connected_at?: Date;
    last_updated?: Date;
    recent_activities?: number;
    message?: string;
  } | null = null;

  if (user) {
    try {
      // 연결 정보와 최근 활동 수를 병렬로 조회 (성능 최적화)
      const [connection, activityCount] = await Promise.all([
        prisma.garminConnection.findFirst({
          where: { userId: user.id },
          select: {
            garminUserId: true,
            needsReauth: true,
            scopes: true,
            createdAt: true,
            updatedAt: true,
            tokenExpiresAt: true,
          },
        }),
        prisma.garminActivity.count({
          where: {
            userId: user.id,
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),
      ]);

      if (connection) {
        const tokenExpired = connection.tokenExpiresAt
          ? new Date(connection.tokenExpiresAt) < new Date()
          : false;

        initialConnectionStatus = {
          connected: true,
          garmin_user_id: connection.garminUserId,
          needs_reauth: connection.needsReauth || tokenExpired,
          scopes: connection.scopes,
          connected_at: connection.createdAt,
          last_updated: connection.updatedAt,
          recent_activities: activityCount,
        };
      } else {
        initialConnectionStatus = {
          connected: false,
          message: "No Garmin connection found",
        };
      }
    } catch (error) {
      console.error("Failed to fetch connection status:", error);
      // 에러가 발생해도 클라이언트에서 다시 시도할 수 있도록 null 유지
    }
  }

  // 클라이언트 컴포넌트에 초기 데이터 전달 (즉시 렌더링)
  return (
    <GarminTestClient
      initialUser={user}
      initialConnectionStatus={initialConnectionStatus}
    />
  );
}
