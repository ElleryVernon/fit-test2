# 🔐 Google OAuth 설정 가이드

## 🚨 현재 오류: `redirect_uri_mismatch`

```
400 오류: redirect_uri_mismatch
액세스 차단됨: Syntaxy의 요청이 잘못되었습니다
```

## 🔧 해결 방법

### 1. Google Cloud Console 접속
1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 접속
2. 프로젝트 선택 (현재 클라이언트 ID: `86531919140-bdrn9qhonccvv9nefa088v86nlejtveu`)

### 2. OAuth 2.0 클라이언트 ID 편집
1. 좌측 메뉴에서 **"사용자 인증 정보"** 클릭
2. OAuth 2.0 클라이언트 ID 클릭하여 편집
3. **"승인된 리디렉션 URI"** 섹션 확인

### 3. 리디렉션 URI 추가
다음 URI들을 **정확히** 추가하세요:

```
# 개발 환경
http://localhost:3000/api/auth/callback/google

# 프로덕션 환경
https://fit-test2.vercel.app/api/auth/callback/google
```

### 4. 현재 설정 확인
**승인된 리디렉션 URI**에 다음이 포함되어 있는지 확인:
- [ ] `http://localhost:3000/api/auth/callback/google`
- [ ] `https://fit-test2.vercel.app/api/auth/callback/google`

### 5. 저장 및 적용
1. **"저장"** 버튼 클릭
2. 변경사항 적용까지 **5-10분** 소요

## 🔍 문제 진단

### 현재 클라이언트 ID
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=86531919140-bdrn9qhonccvv9nefa088v86nlejtveu.apps.googleusercontent.com
```

### 예상되는 콜백 URL
```
https://fit-test2.vercel.app/api/auth/callback/google
```

### Better Auth 기본 콜백 경로
Better Auth는 기본적으로 `/api/auth/callback/{provider}` 경로를 사용합니다.

## 📋 체크리스트

- [ ] Google Cloud Console 접속
- [ ] OAuth 2.0 클라이언트 ID 편집
- [ ] 개발용 리디렉션 URI 추가: `http://localhost:3000/api/auth/callback/google`
- [ ] 프로덕션용 리디렉션 URI 추가: `https://fit-test2.vercel.app/api/auth/callback/google`
- [ ] 저장 완료
- [ ] 5-10분 대기 후 테스트

## 🧪 테스트 방법

### 1. 개발 환경 테스트
```bash
# 로컬 서버 실행
bun run dev

# 브라우저에서 테스트
http://localhost:3000
```

### 2. 프로덕션 환경 테스트
```bash
# Vercel 배포 확인
https://fit-test2.vercel.app
```

## 🚨 주의사항

1. **정확한 URL**: 프로토콜, 도메인, 경로가 정확히 일치해야 함
2. **대소문자 구분**: URL은 대소문자를 구분함
3. **슬래시 주의**: 마지막 슬래시 유무도 중요함
4. **적용 시간**: 변경사항 적용까지 5-10분 소요

## 🔗 유용한 링크

- [Google OAuth 2.0 문서](https://developers.google.com/identity/protocols/oauth2/web-server#redirect-uri-mismatch)
- [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- [Better Auth 문서](https://www.better-auth.com/docs/social-login/google)

## 📞 추가 도움

문제가 계속 발생하면:
1. Google Cloud Console에서 리디렉션 URI 설정 재확인
2. 브라우저 캐시 클리어
3. 개발자 도구에서 네트워크 탭 확인
4. Vercel 로그 확인: `vercel logs`
