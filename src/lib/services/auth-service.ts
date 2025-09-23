'use client';

import { User } from './supabase-service';
import { getUserByEmail, createUser } from './supabase-service';

// Google OAuth 클라이언트 ID
const NEXT_PUBLIC_GOOGLE_CLIENT_ID = process.env
  .NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

// Apple OAuth 클라이언트 ID
const NEXT_PUBLIC_APPLE_CLIENT_ID = process.env
  .NEXT_PUBLIC_APPLE_CLIENT_ID as string;

// Apple Sign In Response 타입 정의
interface AppleSignInResponse {
  authorization: {
    code: string;
    id_token: string;
    state: string;
  };
  user?: {
    email: string;
    name: {
      firstName: string;
      lastName: string;
    };
  };
}

// 상수 정의
const KEY_USER_DATA = 'user_data';
const KEY_ACCESS_TOKEN = 'access_token';
const KEY_ID_TOKEN = 'id_token';
const KEY_REFRESH_TOKEN = 'refresh_token';
const KEY_TOKEN_EXPIRY = 'token_expiry';

export class AuthService {
  private currentUserData: User | null = null;

  constructor() {
    // 초기화 시 로컬 스토리지에서 사용자 데이터 로드 (브라우저 환경에서만)
    if (typeof window !== 'undefined') {
      this.loadUserData();
    }
  }

  // 현재 사용자 getter
  get currentUser(): User | null {
    return this.currentUserData;
  }

  // 로컬 스토리지에서 사용자 데이터 로드
  private loadUserData(): void {
    try {
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem(KEY_USER_DATA);
        if (userData) {
          this.currentUserData = JSON.parse(userData);
        }
      }
    } catch (error) {
      console.error('사용자 데이터 로드 오류:', error);
    }
  }

  // 토큰 저장
  private async saveTokens(
    accessToken: string,
    idToken: string,
    refreshToken?: string,
    expiresIn?: number
  ): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        // 토큰 만료 시간 계산 (기본값: 1시간)
        const expiryTime = new Date();
        expiryTime.setSeconds(expiryTime.getSeconds() + (expiresIn || 3600));

        // 로컬 스토리지에 토큰 저장
        localStorage.setItem(KEY_ACCESS_TOKEN, accessToken);
        localStorage.setItem(KEY_ID_TOKEN, idToken);
        if (refreshToken) {
          localStorage.setItem(KEY_REFRESH_TOKEN, refreshToken);
        }
        localStorage.setItem(KEY_TOKEN_EXPIRY, expiryTime.toISOString());
      }
    } catch (error) {
      console.error('토큰 저장 오류:', error);
      throw error;
    }
  }

  // Google 사용자 정보 가져오기
  private async fetchGoogleUserInfo(
    accessToken: string
  ): Promise<Record<string, unknown>> {
    try {
      const response = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`사용자 정보 요청 실패: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Google 사용자 정보 가져오기 오류:', error);
      throw error;
    }
  }

  // Google 로그인
  async signInWithGoogle(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') {
        console.error('브라우저 환경이 아닙니다');
        return false;
      }

      // Google OAuth 라이브러리가 로드되었는지 확인
      if (!window.google) {
        await this.loadGoogleAuthLibrary();
      }

      // Google OAuth 클라이언트 초기화
      return new Promise<boolean>((resolve) => {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: async (tokenResponse: {
            access_token: string;
            id_token: string;
            expires_in: number;
            error?: string;
          }) => {
            if (tokenResponse.error) {
              console.error('Google 로그인 오류:', tokenResponse.error);
              resolve(false);
              return;
            }

            try {
              // 토큰 저장
              await this.saveTokens(
                tokenResponse.access_token,
                tokenResponse.id_token,
                undefined,
                tokenResponse.expires_in
              );

              // 사용자 정보 가져오기
              const userInfo = await this.fetchGoogleUserInfo(
                tokenResponse.access_token
              );

              // users 테이블에서 이메일로만 사용자 조회
              let existingUser = await getUserByEmail(userInfo.email as string);
              const isNewUser = !existingUser;

              console.log(
                '📧 [Google Login] 이메일 기반 사용자 조회:',
                userInfo.email
              );
              console.log(
                '👤 [Google Login] 사용자 상태:',
                isNewUser ? '신규 사용자' : '기존 사용자'
              );

              // 신규 사용자인 경우 users 테이블에 사용자 정보 저장
              if (isNewUser) {
                console.log(
                  '🎉 [Google Login] 신규 Google 가입 사용자입니다!',
                  userInfo.email
                );
                try {
                  // 사용자 생성
                  existingUser = await createUser({
                    name: userInfo.name as string,
                    email: userInfo.email as string,
                    google_id: userInfo.id as string,
                    profile_image_url: userInfo.picture as string,
                    gender: 'other', // 기본값 설정
                    birth: new Date(), // 기본값 설정
                  });
                  console.log('✅ 사용자 생성 성공:', existingUser.email);
                } catch (error) {
                  console.error('❌ 사용자 생성 실패:', error);
                  // 사용자 생성에 실패해도 로그인은 진행
                }
              } else {
                console.log('👋 기존 사용자 로그인입니다!', userInfo.email);
              }

              // 사용자 데이터 생성
              this.currentUserData = {
                id: existingUser?.id || (userInfo.id as string),
                name: existingUser?.name || (userInfo.name as string),
                email: userInfo.email as string,
                profileImageUrl:
                  existingUser?.profileImageUrl || (userInfo.picture as string),
                createdAt: existingUser?.createdAt || new Date(),
              };

              // 로컬 스토리지에 사용자 데이터 저장
              if (typeof window !== 'undefined') {
                localStorage.setItem(
                  KEY_USER_DATA,
                  JSON.stringify(this.currentUserData)
                );
              }

              resolve(true);
            } catch (error) {
              console.error('로그인 처리 중 오류:', error);
              resolve(false);
            }
          },
        });

        // 토큰 요청
        client.requestAccessToken();
      });
    } catch (error) {
      console.error('Google 로그인 오류:', error);
      return false;
    }
  }

  // Apple 로그인 (간단한 버전)
  async signInWithApple(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') {
        console.error('브라우저 환경이 아닙니다');
        return false;
      }

      // Apple Sign In 라이브러리가 로드되었는지 확인
      if (!window.AppleID) {
        await this.loadAppleAuthLibrary();
      }

      // Apple Sign In 초기화
      return new Promise<boolean>((resolve) => {
        window.AppleID.auth.init({
          clientId: NEXT_PUBLIC_APPLE_CLIENT_ID,
          scope: 'name email',
          redirectURI: `${window.location.origin}/api/auth/callback/apple`,
          state: 'signin',
          usePopup: true,
        });

        // Apple Sign In 실행
        window.AppleID.auth.signIn().then(
          async (response: AppleSignInResponse) => {
            try {
              // 임시로 성공 처리 (실제 구현 시 백엔드 연동 필요)
              console.log('Apple 로그인 응답:', response);
              resolve(true);
            } catch (error) {
              console.error('Apple 로그인 처리 중 오류:', error);
              resolve(false);
            }
          },
          (error: Error) => {
            console.error('Apple 로그인 오류:', error);
            resolve(false);
          }
        );
      });
    } catch (error) {
      console.error('Apple 로그인 오류:', error);
      return false;
    }
  }

  // Google Auth 라이브러리 로드
  private loadGoogleAuthLibrary(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error('Google Auth 라이브러리 로드 실패'));
        document.head.appendChild(script);
      } else {
        reject(new Error('브라우저 환경이 아닙니다'));
      }
    });
  }

  // Apple Auth 라이브러리 로드
  private loadAppleAuthLibrary(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const script = document.createElement('script');
        script.src =
          'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error('Apple Auth 라이브러리 로드 실패'));
        document.head.appendChild(script);
      } else {
        reject(new Error('브라우저 환경이 아닙니다'));
      }
    });
  }

  // 로그아웃
  async signOut(): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        // 로컬 스토리지에서 토큰 및 사용자 데이터 제거
        localStorage.removeItem(KEY_ACCESS_TOKEN);
        localStorage.removeItem(KEY_ID_TOKEN);
        localStorage.removeItem(KEY_REFRESH_TOKEN);
        localStorage.removeItem(KEY_TOKEN_EXPIRY);
        localStorage.removeItem(KEY_USER_DATA);
      }

      // 현재 사용자 데이터 초기화
      this.currentUserData = null;
    } catch (error) {
      console.error('로그아웃 오류:', error);
      throw error;
    }
  }
}

// Google 및 Apple 타입 정의
declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: {
              access_token: string;
              id_token: string;
              expires_in: number;
              error?: string;
            }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
    AppleID: {
      auth: {
        init: (config: {
          clientId: string;
          scope: string;
          redirectURI: string;
          state: string;
          usePopup: boolean;
        }) => void;
        signIn: () => Promise<AppleSignInResponse>;
      };
    };
  }
}