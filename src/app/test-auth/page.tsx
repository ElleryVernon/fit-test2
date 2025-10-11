import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import TestAuthClient from "./TestAuthClient";

/**
 * Auth 테스트 페이지 (Server Component)
 * 세션을 서버에서 미리 가져와서 SSR로 렌더링 → 빠른 초기 로딩
 */
export default async function TestAuthPage() {
  // 서버에서 세션 가져오기 (SSR - 빠른 초기 렌더링)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user || null;

  return <TestAuthClient initialUser={user} />;
}