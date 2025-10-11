# 🔐 Google OAuth 설정 가이드

## 현재 오류 상황
```
400 오류: redirect_uri_mismatch
액세스 차단됨: Syntaxy의 요청이 잘못되었습니다
```

## 🎯 해결 방법

### 1. Google Cloud Console 설정

#### A. 승인된 리디렉션 URI 추가
```
https://fit-test2.vercel.app/api/auth/callback/google
```

#### B. 승인된 JavaScript 원본 추가
```
https://fit-test2.vercel.app
```

### 2. Google Cloud Console 접속 방법

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. **API 및 서비스** → **사용자 인증 정보** 이동
3. OAuth 2.0 클라이언트 ID 선택 (현재 사용 중인 것)
4. **승인된 리디렉션 URI** 섹션에서 추가:
   ```
   https://fit-test2.vercel.app/api/auth/callback/google
   ```
5. **승인된 JavaScript 원본** 섹션에서 추가:
   ```
   https://fit-test2.vercel.app
   ```

### 3. Better Auth 콜백 경로 확인

Better Auth는 다음 경로를 사용합니다:
- **Google OAuth 콜백**: `/api/auth/callback/google`
- **Apple OAuth 콜백**: `/api/auth/callback/apple`
- **일반 인증**: `/api/auth/[...all]`

### 4. 현재 설정된 환경변수

```bash
# 개발 환경
NEXT_PUBLIC_GOOGLE_CLIENT_ID=86531919140-bdrn9qhonccvv9nefa088v86nlejtveu.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# 프로덕션 환경 (Vercel)
NEXT_PUBLIC_BASE_URL=https://fit-test2.vercel.app
```

### 5. 설정 후 확인사항

- [ ] Google Cloud Console에서 리디렉션 URI 추가 완료
- [ ] JavaScript 원본 추가 완료
- [ ] Vercel 환경변수 설정 확인
- [ ] 프로덕션 배포 완료
- [ ] Google 로그인 테스트

### 6. 추가 도메인 (필요시)

다른 도메인을 사용하는 경우:
```
# 커스텀 도메인
https://fitculator.com/api/auth/callback/google
https://www.fitculator.com/api/auth/callback/google

# 개발 환경
http://localhost:3000/api/auth/callback/google
```

### 7. 문제 해결

#### 여전히 오류가 발생하는 경우:

1. **캐시 클리어**
   - 브라우저 캐시 삭제
   - 시크릿 모드에서 테스트

2. **환경변수 재확인**
   ```bash
   # Vercel에서 확인
   vercel env ls
   ```

3. **로그 확인**
   ```bash
   # Vercel 로그 확인
   vercel logs
   ```

4. **Google OAuth 동의 화면 설정**
   - OAuth 동의 화면에서 앱 정보 완성
   - 테스트 사용자 추가 (필요시)

## 🔗 참고 링크

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google OAuth 2.0 문서](https://developers.google.com/identity/protocols/oauth2)
- [Better Auth 문서](https://www.better-auth.com/)
- [Vercel 환경변수 설정](https://vercel.com/docs/projects/environment-variables)
