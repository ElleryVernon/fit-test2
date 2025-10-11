"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import type { User } from "@/lib/auth";

// 구글 로그인 SVG 아이콘
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

interface ConnectionStatus {
  connected: boolean;
  garmin_user_id?: string;
  needs_reauth?: boolean;
  scopes?: string[];
  connected_at?: Date;
  last_updated?: Date;
  recent_activities?: number;
  message?: string;
}

interface ApiResponse {
  status: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  error?: string;
  timestamp: string;
}

interface GarminTestClientProps {
  initialUser: User | null;
  initialConnectionStatus: ConnectionStatus | null;
}

export default function GarminTestClient({
  initialUser,
  initialConnectionStatus,
}: GarminTestClientProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(false);
  const [loadingEndpoints, setLoadingEndpoints] = useState<Set<string>>(
    new Set()
  );
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus | null>(initialConnectionStatus);
  const [apiResponses, setApiResponses] = useState<Record<string, ApiResponse>>(
    {}
  );

  // 초기 탭 설정: 연결 상태에 따라 자동 결정
  const getInitialTab = () => {
    if (!initialUser) return "auth";
    if (initialConnectionStatus?.connected) return "apis";
    return "garmin";
  };

  const [activeTab, setActiveTab] = useState<"auth" | "garmin" | "apis">(
    getInitialTab()
  );

  // URL 파라미터 체크 (Garmin OAuth 결과 처리)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get("success");
      const error = urlParams.get("error");

      if (success === "true") {
        alert("Garmin 연동이 성공적으로 완료되었습니다!");
        // URL 정리 후 페이지 새로고침으로 최신 연결 상태 가져오기
        window.location.href = "/garmin-test";
      } else if (error) {
        alert(
          `Garmin 연동 중 오류가 발생했습니다: ${decodeURIComponent(error)}`
        );
        window.history.replaceState({}, "", "/garmin-test");
      }
    }
  }, []);

  // 사용자 로그인 상태 변경 처리 (런타임 로그인 시에만)
  useEffect(() => {
    // 초기 렌더링이 아닌 경우에만 실행 (user가 변경된 경우)
    if (user && user !== initialUser) {
      // 새로 로그인한 경우에만 연결 상태 확인
      checkGarminConnection(user.id);
    } else if (!user && initialUser) {
      // 로그아웃한 경우
      setConnectionStatus(null);
      setApiResponses({});
      setActiveTab("auth");
    }
  }, [user, initialUser]);

  const checkGarminConnection = async (userId: string) => {
    try {
      const response = await fetch(
        `/api/garmin/connection-status?user_id=${userId}`,
        {
          // 캐시를 사용하여 중복 요청 방지 (성능 개선)
          next: { revalidate: 30 },
        }
      );
      const data = await response.json();
      setConnectionStatus(data);
      if (data.connected) {
        setActiveTab("apis");
      }
    } catch (error) {
      console.error("Failed to check connection:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/garmin-test",
        // 로그인 성공 시 페이지 새로고침으로 SSR 데이터 가져오기
      });
      // Better Auth가 자동으로 리다이렉트하므로 별도 처리 불필요
    } catch (error) {
      console.error("Google sign in error:", error);
      alert(error instanceof Error ? error.message : "Google sign in failed");
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            // 상태 초기화
            setUser(null);
            setConnectionStatus(null);
            setApiResponses({});
            setActiveTab("auth");
            // 페이지 새로고침으로 SSR 데이터도 초기화
            window.location.href = "/garmin-test";
          },
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const connectGarmin = () => {
    if (!user) return;
    // 가민 OAuth 페이지로 이동
    window.location.href = `/api/garmin/oauth/start?user_id=${user.id}`;
  };

  const disconnectGarmin = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch("/api/garmin/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, keep_data: false }),
      });
      const data = await response.json();
      alert(data.message || "연결 해제 완료");
      setConnectionStatus(null);
      setApiResponses({});
      checkGarminConnection(user.id);
    } catch (error) {
      console.error("Failed to disconnect:", error);
    } finally {
      setLoading(false);
    }
  };

  const testAPI = async (
    endpoint: string,
    params: Record<string, string> = {}
  ) => {
    if (!user) return;

    // 엔드포인트별 로딩 상태 관리
    const endpointKey = `${endpoint}_${JSON.stringify(params)}`;
    setLoadingEndpoints((prev) => new Set(prev).add(endpointKey));

    try {
      const queryParams = new URLSearchParams({
        user_id: user.id,
        ...params,
      });
      const response = await fetch(`/api/garmin/${endpoint}?${queryParams}`);
      const data = await response.json();
      setApiResponses((prev) => ({
        ...prev,
        [endpointKey]: {
          status: response.status,
          data,
          timestamp: new Date().toISOString(),
        },
      }));
    } catch (error) {
      setApiResponses((prev) => ({
        ...prev,
        [endpointKey]: {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        },
      }));
    } finally {
      setLoadingEndpoints((prev) => {
        const newSet = new Set(prev);
        newSet.delete(endpointKey);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          🏃‍♂️ Garmin API 테스트 페이지
        </h1>

        {/* 탭 네비게이션 */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("auth")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "auth"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            1. 인증
          </button>
          <button
            onClick={() => setActiveTab("garmin")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "garmin"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            } ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!user}
          >
            2. Garmin 연동
          </button>
          <button
            onClick={() => setActiveTab("apis")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "apis"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            } ${
              !connectionStatus?.connected
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!connectionStatus?.connected}
          >
            3. API 테스트
          </button>
        </div>

        {/* 사용자 상태 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              {user ? (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    로그인됨
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ID: {user.id}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  로그인하지 않음
                </p>
              )}
            </div>
            {user && (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                로그아웃
              </button>
            )}
          </div>
          {connectionStatus && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Garmin 연결 상태
              </p>
              <p
                className={`font-medium ${
                  connectionStatus.connected ? "text-green-600" : "text-red-600"
                }`}
              >
                {connectionStatus.connected ? "✅ 연결됨" : "❌ 연결되지 않음"}
              </p>
              {connectionStatus.connected && (
                <>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Garmin ID: {connectionStatus.garmin_user_id}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    최근 활동: {connectionStatus.recent_activities}개
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* 인증 탭 */}
        {activeTab === "auth" && !user && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white text-center">
              로그인
            </h2>
            <div className="space-y-4 max-w-sm mx-auto">
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                소셜 계정으로 간편하게 로그인하세요
              </p>

              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <GoogleIcon />
                <span className="font-medium">
                  {loading ? "처리 중..." : "Google로 계속하기"}
                </span>
              </button>

              <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                로그인하면 서비스 이용약관 및 개인정보 처리방침에 동의합니다
              </div>
            </div>
          </div>
        )}

        {/* Garmin 연동 탭 */}
        {activeTab === "garmin" && user && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Garmin 연동
            </h2>
            {!connectionStatus?.connected ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Garmin Connect 계정을 연동하여 운동 데이터를 가져올 수
                  있습니다.
                </p>
                <button
                  onClick={connectGarmin}
                  disabled={loading}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  🔗 Garmin 연동하기
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    ✅ Garmin이 성공적으로 연동되었습니다!
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    이제 API 테스트 탭에서 각종 데이터를 조회할 수 있습니다.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setLoading(true);
                    checkGarminConnection(user.id).finally(() =>
                      setLoading(false)
                    );
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 relative"
                >
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-600 bg-opacity-90 rounded-lg">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </div>
                  )}
                  🔄 연결 상태 새로고침
                </button>
                <button
                  onClick={disconnectGarmin}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  ❌ 연동 해제
                </button>
              </div>
            )}
          </div>
        )}

        {/* API 테스트 탭 */}
        {activeTab === "apis" && connectionStatus?.connected && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                API 엔드포인트 테스트
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => testAPI("activities")}
                  disabled={loadingEndpoints.has("activities_{}")}
                  className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-left relative"
                >
                  {loadingEndpoints.has("activities_{}") && (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-600 bg-opacity-90 rounded-lg">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                  <div className="font-medium">📊 활동 목록</div>
                  <div className="text-sm opacity-90">
                    GET /api/garmin/activities
                  </div>
                </button>

                <button
                  onClick={() => testAPI("stats", { period: "7" })}
                  disabled={loadingEndpoints.has('stats_{"period":"7"}')}
                  className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-left relative"
                >
                  {loadingEndpoints.has('stats_{"period":"7"}') && (
                    <div className="absolute inset-0 flex items-center justify-center bg-purple-600 bg-opacity-90 rounded-lg">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                  <div className="font-medium">📈 통계 (7일)</div>
                  <div className="text-sm opacity-90">
                    GET /api/garmin/stats
                  </div>
                </button>

                <button
                  onClick={() => testAPI("user-id")}
                  disabled={loadingEndpoints.has("user-id_{}")}
                  className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-left relative"
                >
                  {loadingEndpoints.has("user-id_{}") && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-600 bg-opacity-90 rounded-lg">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                  <div className="font-medium">👤 Garmin User ID</div>
                  <div className="text-sm opacity-90">
                    GET /api/garmin/user-id
                  </div>
                </button>

                <button
                  onClick={() => testAPI("permissions")}
                  disabled={loadingEndpoints.has("permissions_{}")}
                  className="p-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 text-left relative"
                >
                  {loadingEndpoints.has("permissions_{}") && (
                    <div className="absolute inset-0 flex items-center justify-center bg-yellow-600 bg-opacity-90 rounded-lg">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                  <div className="font-medium">🔐 권한 조회</div>
                  <div className="text-sm opacity-90">
                    GET /api/garmin/permissions
                  </div>
                </button>

                <button
                  onClick={() => testAPI("activities", { limit: "5" })}
                  disabled={loadingEndpoints.has('activities_{"limit":"5"}')}
                  className="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-left relative"
                >
                  {loadingEndpoints.has('activities_{"limit":"5"}') && (
                    <div className="absolute inset-0 flex items-center justify-center bg-indigo-600 bg-opacity-90 rounded-lg">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                  <div className="font-medium">📊 최근 5개 활동</div>
                  <div className="text-sm opacity-90">
                    GET /api/garmin/activities?limit=5
                  </div>
                </button>

                <button
                  onClick={() => testAPI("stats", { period: "30" })}
                  disabled={loadingEndpoints.has('stats_{"period":"30"}')}
                  className="p-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 text-left relative"
                >
                  {loadingEndpoints.has('stats_{"period":"30"}') && (
                    <div className="absolute inset-0 flex items-center justify-center bg-pink-600 bg-opacity-90 rounded-lg">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                  <div className="font-medium">📈 통계 (30일)</div>
                  <div className="text-sm opacity-90">
                    GET /api/garmin/stats?period=30
                  </div>
                </button>
              </div>
            </div>

            {/* API 응답 표시 */}
            {(Object.keys(apiResponses).length > 0 ||
              loadingEndpoints.size > 0) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  API 응답
                </h3>
                <div className="space-y-4">
                  {/* 로딩 중인 API 스켈레톤 */}
                  {Array.from(loadingEndpoints).map((endpoint) => (
                    <div
                      key={`loading-${endpoint}`}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                      <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded">
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* 실제 API 응답 */}
                  {Object.entries(apiResponses)
                    .sort(
                      (a, b) =>
                        new Date(b[1].timestamp).getTime() -
                        new Date(a[1].timestamp).getTime()
                    )
                    .map(([endpoint, response]) => (
                      <div
                        key={`${endpoint}-${response.timestamp}`}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {endpoint}
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              response.status === 200
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {response.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {new Date(response.timestamp).toLocaleString("ko-KR")}
                        </p>
                        <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                          {JSON.stringify(
                            response.data || response.error,
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 로그인/연동 작업용 로딩 오버레이 (최소한으로 사용) */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-900 dark:text-white">처리 중...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
