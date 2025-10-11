# 🚀 프로덕션 배포 가이드

## CORS 오류 해결 방법

### 문제 상황
```
Access to fetch at 'http://localhost:3000/api/auth/get-session' from origin 'https://fit-test2.vercel.app' has been blocked by CORS policy
```

### 원인
프로덕션 환경에서 `NEXT_PUBLIC_BASE_URL`이 localhost로 설정되어 있어 CORS 오류가 발생합니다.

## 🔧 Vercel 환경변수 설정

### 1. Vercel 대시보드에서 환경변수 설정

Vercel 프로젝트 설정 → Environment Variables에서 다음 변수들을 설정하세요:

```bash
# 필수 환경변수
NEXT_PUBLIC_BASE_URL=https://fit-test2.vercel.app
BETTER_AUTH_URL=https://fit-test2.vercel.app
BETTER_AUTH_SECRET=<새로 생성된 시크릿>

# 데이터베이스 (개발과 동일한 Supabase 사용)
DATABASE_URL=postgresql://postgres.owlfvaunyrsrxzmydfky:RPYrng7kwnEJcS46@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
DIRECT_URL=postgresql://postgres.owlfvaunyrsrxzmydfky:RPYrng7kwnEJcS46@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require

# OAuth 설정 (개발과 동일)
GOOGLE_CLIENT_SECRET=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
NEXT_PUBLIC_GOOGLE_CLIENT_ID=86531919140-bdrn9qhonccvv9nefa088v86nlejtveu.apps.googleusercontent.com
GARMIN_CLIENT_ID=a02b2b4f-98d3-489c-92a9-aa4549a2a76b
GARMIN_CLIENT_SECRET=9E6iErHoC2IVdEhVn0p9vp9G1xUIrBbmWmzfBpahuc4
```

### 2. BETTER_AUTH_SECRET 생성

터미널에서 실행:
```bash
openssl rand -base64 32
```

생성된 값을 `BETTER_AUTH_SECRET`에 설정하세요.

### 3. Google OAuth 콜백 URL 설정

Google Cloud Console에서 OAuth 2.0 클라이언트 ID 설정에 다음 콜백 URL을 추가:

```
https://fit-test2.vercel.app/api/auth/callback/google
```

## 🔄 배포 후 확인사항

### 1. 환경변수 확인
```bash
# Vercel CLI로 확인
vercel env ls
```

### 2. 로그 확인
```bash
# Vercel 로그 확인
vercel logs
```

### 3. 테스트
- [ ] 홈페이지 로드 확인
- [ ] Google 로그인 테스트
- [ ] Garmin 연결 테스트
- [ ] API 엔드포인트 테스트

## 🐛 문제 해결

### CORS 오류가 계속 발생하는 경우

1. **환경변수 재설정**
   ```bash
   # Vercel에서 환경변수 삭제 후 재설정
   ```

2. **재배포**
   ```bash
   vercel --prod
   ```

3. **브라우저 캐시 클리어**
   - 개발자 도구 → Application → Storage → Clear storage

### 데이터베이스 연결 오류

1. **Supabase 연결 확인**
   - Supabase 대시보드에서 연결 상태 확인
   - IP 화이트리스트 설정 확인

2. **Prisma 마이그레이션**
   ```bash
   # 로컬에서 마이그레이션 실행
   bun run db:push
   ```

## 📋 체크리스트

- [ ] Vercel 환경변수 설정 완료
- [ ] Google OAuth 콜백 URL 추가
- [ ] BETTER_AUTH_SECRET 새로 생성
- [ ] 프로덕션 배포 완료
- [ ] 로그인 기능 테스트
- [ ] Garmin 연결 테스트
- [ ] API 엔드포인트 테스트

## 🔗 유용한 링크

- [Vercel 환경변수 설정](https://vercel.com/docs/projects/environment-variables)
- [Google OAuth 설정](https://console.cloud.google.com/apis/credentials)
- [Better Auth 문서](https://www.better-auth.com/)
- [Supabase 연결 가이드](https://supabase.com/docs/guides/database/connecting-to-postgres)
