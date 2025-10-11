/**
 * Garmin OAuth 2.0 인증 서비스
 */

import crypto from "crypto";
import { garminRepository } from "@/core/repositories";
import { garminConfig } from "@/config";

// OAuth 2.0 PKCE 관련 상수
const STATE_EXPIRY_MINUTES = 10;

export class GarminOAuthService {
  /**
   * PKCE Code Verifier 생성 (43-128 characters)
   */
  generateCodeVerifier(): string {
    return crypto
      .randomBytes(64)
      .toString("base64url")
      .replace(/=/g, "")
      .substring(0, 128);
  }

  /**
   * PKCE Code Challenge 생성 (SHA256 hash of verifier)
   */
  generateCodeChallenge(verifier: string): string {
    return crypto
      .createHash("sha256")
      .update(verifier)
      .digest("base64url")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  /**
   * OAuth State 생성 및 저장 (CSRF 방지 + PKCE verifier 저장)
   */
  async generateOAuthState(userId: string): Promise<{
    state: string;
    codeVerifier: string;
    codeChallenge: string;
  }> {
    const state = crypto.randomBytes(32).toString("hex");
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = this.generateCodeChallenge(codeVerifier);

    await garminRepository.saveOAuthState({
      userId,
      state,
      codeVerifier,
    });

    return { state, codeVerifier, codeChallenge };
  }

  /**
   * State 검증 및 code verifier 반환
   */
  async verifyOAuthState(
    state: string
  ): Promise<{ userId: string; codeVerifier: string } | null> {
    const stateData = await garminRepository.findOAuthState(state);

    if (!stateData) return null;

    const now = Date.now();
    const expiryTime = STATE_EXPIRY_MINUTES * 60 * 1000;

    // 만료 체크
    if (now - stateData.createdAt > expiryTime) {
      await garminRepository.updateOAuthStateStatus(
        state,
        "failed",
        "State expired"
      );
      return null;
    }

    // State 사용 처리
    await garminRepository.updateOAuthStateStatus(state, "success");

    return {
      userId: stateData.userId,
      codeVerifier: stateData.codeVerifier,
    };
  }

  /**
   * Garmin OAuth 2.0 PKCE URL 생성
   */
  buildGarminAuthUrl(state: string, codeChallenge: string): string {
    if (!process.env.GARMIN_CLIENT_ID || !process.env.NEXT_PUBLIC_BASE_URL) {
      console.error(
        "❌ [Garmin OAuth] Missing environment variables for auth URL:",
        {
          hasClientId: !!process.env.GARMIN_CLIENT_ID,
          hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
        }
      );
      throw new Error(
        "Missing Garmin OAuth configuration in environment variables"
      );
    }

    const baseUrl = "https://connect.garmin.com/oauth2Confirm";
    const redirectUri = garminConfig.callbackUrl;

    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.GARMIN_CLIENT_ID,
      redirect_uri: redirectUri,
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    const authUrl = `${baseUrl}?${params.toString()}`;

    console.log("🔗 [Garmin OAuth] Generated auth URL:", {
      baseUrl,
      clientId: process.env.GARMIN_CLIENT_ID,
      redirectUri,
      state,
      codeChallenge,
    });

    return authUrl;
  }

  /**
   * OAuth 2.0 토큰 교환
   */
  async exchangeCodeForTokens(
    code: string,
    codeVerifier: string,
    redirectUri: string
  ): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_token_expires_in: number;
    scope: string;
  }> {
    if (!process.env.GARMIN_CLIENT_ID || !process.env.GARMIN_CLIENT_SECRET) {
      console.error("❌ [Garmin OAuth] Missing environment variables:", {
        hasClientId: !!process.env.GARMIN_CLIENT_ID,
        hasClientSecret: !!process.env.GARMIN_CLIENT_SECRET,
      });
      throw new Error(
        "Missing Garmin OAuth credentials in environment variables"
      );
    }

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.GARMIN_CLIENT_ID,
      client_secret: process.env.GARMIN_CLIENT_SECRET,
      code: code,
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
    });

    console.log("🔄 [Garmin OAuth] Token exchange request");

    const response = await fetch(
      "https://diauth.garmin.com/di-oauth2-service/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    console.log(
      "📋 [Garmin OAuth] Token exchange response status:",
      response.status
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("❌ [Garmin OAuth] Token exchange error response:", error);
      throw new Error(`Token exchange failed: ${response.status} - ${error}`);
    }

    const tokenData = await response.json();
    console.log("✅ [Garmin OAuth] Token exchange success");

    return tokenData;
  }

  /**
   * Refresh Token으로 Access Token 갱신
   */
  async refreshAccessToken(refreshToken: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_token_expires_in: number;
  }> {
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.GARMIN_CLIENT_ID!,
      client_secret: process.env.GARMIN_CLIENT_SECRET!,
      refresh_token: refreshToken,
    });

    const response = await fetch(
      "https://diauth.garmin.com/di-oauth2-service/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Garmin User ID 조회
   */
  async fetchGarminUserId(accessToken: string): Promise<string> {
    const response = await fetch(
      "https://apis.garmin.com/wellness-api/rest/user/id",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch Garmin user ID: ${response.status}`);
    }

    const data = await response.json();
    return data.userId;
  }

  /**
   * Garmin 권한 조회
   */
  async fetchGarminPermissions(accessToken: string): Promise<string[]> {
    const response = await fetch(
      "https://apis.garmin.com/wellness-api/rest/user/permissions",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch permissions: ${response.status}`);
    }

    const data = await response.json();

    // Garmin API가 { permissions: [...] } 형태로 반환하는 경우 처리
    if (data && typeof data === "object" && "permissions" in data) {
      return data.permissions;
    }

    // 배열로 직접 반환하는 경우
    return Array.isArray(data) ? data : [];
  }

  /**
   * Garmin 연결 저장 (OAuth 2.0)
   */
  async saveGarminConnection(
    userId: string,
    accessToken: string,
    refreshToken: string,
    expiresIn: number
  ) {
    const garminUserId = await this.fetchGarminUserId(accessToken);
    const permissions = await this.fetchGarminPermissions(accessToken);
    const tokenExpiresAt = new Date(Date.now() + (expiresIn - 600) * 1000);

    const existingConnection = await garminRepository.findConnectionByUserId(
      userId
    );

    if (existingConnection) {
      return await garminRepository.updateConnection(existingConnection.id, {
        garminUserId,
        accessToken,
        refreshToken,
        tokenExpiresAt,
        scopes: { set: permissions },
        needsReauth: false,
      });
    } else {
      return await garminRepository.createConnection({
        userId,
        garminUserId,
        accessToken,
        refreshToken,
        tokenExpiresAt,
        scopes: permissions,
        needsReauth: false,
      });
    }
  }

  /**
   * 모바일 앱 딥링크 URL 생성
   */
  buildMobileRedirectUrl(
    success: boolean,
    userId?: string,
    error?: string
  ): string {
    const scheme = process.env.MOBILE_APP_SCHEME || "fitculator";
    const status = success ? "success" : "error";
    const params = new URLSearchParams();

    if (userId) params.append("user_id", userId);
    if (error) params.append("error", error);

    return `${scheme}://garmin-${status}?${params.toString()}`;
  }
}

// Singleton 인스턴스 export
export const garminOAuthService = new GarminOAuthService();
