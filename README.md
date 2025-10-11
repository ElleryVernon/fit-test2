# Fitculator Landing Page

AI 기반 운동 지능 플랫폼인 Fitculator의 랜딩 페이지입니다.

## 🚀 기술 스택

- **프레임워크**: Next.js 15 + React 19
- **언어**: TypeScript
- **API 프레임워크**: Elysia (고성능 타입 안전 API)
- **스타일링**: Tailwind CSS 4
- **인증**: Better Auth
- **데이터베이스**: PostgreSQL + Prisma ORM
- **패키지 매니저**: Bun
- **애니메이션**: Framer Motion

## 📋 주요 기능

- **소셜 로그인**: Google OAuth 지원
- **데모 요청**: 기업용 데모 요청 시스템
- **뉴스레터 구독**: 이메일 구독 서비스
- **Garmin 연동**: 웨어러블 디바이스 데이터 연동
- **다국어 지원**: 한국어/영어 지원
- **반응형 디자인**: 모바일/데스크톱 최적화

## 🛠️ 개발 환경 설정

### 1. 필수 요구사항

- Node.js 18+
- Bun (권장) 또는 npm
- PostgreSQL 데이터베이스

### 2. 프로젝트 클론 및 설치

```bash
git clone <repository-url>
cd fitculator-landing
bun install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```bash
# 데이터베이스
DATABASE_URL="postgresql://user:password@host:port/database"

# Better Auth
BETTER_AUTH_SECRET=your_generated_secret
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Slack Webhooks (선택사항)
SLACK_WEBHOOK_URL=your_slack_webhook_url
SLACK_NEWSLETTER_WEBHOOK_URL=your_newsletter_webhook_url
```

### 4. 데이터베이스 설정

```bash
# Better Auth 테이블 생성
psql $DATABASE_URL -f better-auth-schema.sql

# 또는 Prisma 마이그레이션
bun run db:generate
bun run db:push
```

### 5. 개발 서버 실행

```bash
bun run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조

> **자세한 구조는 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)를 참조하세요.**

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API 라우트
│   │   ├── auth/           # 인증 관련 API
│   │   ├── garmin/         # Garmin 데이터 API
│   │   ├── webhook/        # Webhook 엔드포인트
│   │   └── request-demo/   # 데모 요청
│   ├── garmin-test/        # 테스트 페이지
│   ├── globals.css         # 전역 스타일
│   ├── layout.tsx          # 루트 레이아웃
│   └── page.tsx            # 홈페이지
├── server/                 # Elysia API 서버
│   └── routes/             # API 라우트 정의
│       ├── auth.ts         # Auth/OAuth API 라우트
│       ├── garmin.ts       # Garmin API 라우트
│       ├── demo.ts         # 데모 요청 라우트
│       ├── subscribe.ts    # 구독 라우트
│       └── webhooks.ts     # Webhook API 라우트
├── components/             # React 컴포넌트
│   ├── features/           # 기능별 컴포넌트
│   │   ├── home/           # 홈 페이지 컴포넌트
│   │   ├── demo/           # 데모 관련 컴포넌트
│   │   └── newsletter/     # 뉴스레터 컴포넌트
│   ├── layout/             # 레이아웃 컴포넌트
│   └── ui/                 # 재사용 가능한 UI 컴포넌트
│       └── animations/     # 애니메이션 컴포넌트
├── core/                   # 비즈니스 로직 핵심 레이어
│   ├── repositories/       # 데이터 액세스 레이어
│   └── services/           # 비즈니스 로직 서비스
├── hooks/                  # Custom React Hooks
│   ├── useAuth.tsx         # 인증 훅
│   └── useLanguage.tsx     # 다국어 훅
├── lib/                    # 외부 라이브러리 설정
│   ├── auth.ts             # Better Auth 설정
│   ├── auth-client.ts      # Better Auth 클라이언트
│   └── db/                 # 데이터베이스 설정
│       └── client.ts       # Prisma 클라이언트
├── types/                  # TypeScript 타입 정의
├── config/                 # 설정 파일
├── constants/              # 상수 정의
├── validators/             # 입력 검증 및 스키마
└── utils/                  # 유틸리티 함수
   ├── languageUtils.ts    # 언어 유틸리티
   ├── slackNotifier.ts    # Slack 알림
   └── translations.ts     # 번역 데이터
```

## 🔧 사용 가능한 스크립트

```bash
# 개발 서버 실행
bun run dev

# 프로덕션 빌드
bun run build

# 프로덕션 서버 실행
bun run start

# 린트 검사
bun run lint

# 데이터베이스 마이그레이션 생성
bun run db:generate

# 데이터베이스 마이그레이션 실행
bun run db:migrate

# 데이터베이스 스키마 푸시
bun run db:push

# Prisma Studio 실행
bun run db:studio

# 타입 체크
bun run type-check
```

## 🔐 인증 시스템

이 프로젝트는 Better Auth를 사용하여 인증을 처리합니다.

### 주요 기능

- Google OAuth 로그인
- 세션 기반 인증
- 보안 쿠키 관리
- 자동 토큰 갱신

### 사용법

```tsx
import { useAuth } from "@/hooks";

function MyComponent() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) return <div>로딩 중...</div>;

  if (!user) {
    return <button onClick={signInWithGoogle}>Google 로그인</button>;
  }

  return (
    <div>
      <p>환영합니다, {user.email}</p>
      <button onClick={signOut}>로그아웃</button>
    </div>
  );
}
```

## 🌐 API 엔드포인트

> 💡 **Elysia API**: 대부분의 API가 고성능 타입 안전 Elysia 프레임워크로 구현되었습니다.
> 자세한 내용은 [ELYSIA_MIGRATION.md](./ELYSIA_MIGRATION.md)를 참조하세요.

### 헬스 체크

- `GET /api` - API 서버 상태 확인

### 인증 (Better Auth)

- `GET /api/auth/session` - 세션 조회
- `POST /api/auth/sign-in/social` - 소셜 로그인
- `POST /api/auth/sign-out` - 로그아웃

### Garmin API (Elysia)

- `GET /api/garmin/connection-status` - 연결 상태 조회 (**자동 동기화**)
- `GET /api/garmin/activities` - 활동 목록 조회 (페이지네이션, 필터링, **자동 동기화**)
- `GET /api/garmin/stats` - 통계 조회 (기간별 통계, 트렌드 분석, **자동 동기화**)
- `POST /api/garmin/sync` - ⚡ **NEW!** 수동 동기화 (즉시 실행)
- `GET /api/garmin/user-id` - Garmin 사용자 ID 조회
- `GET /api/garmin/permissions` - 권한 조회
- `POST /api/garmin/disconnect` - 연결 해제
- `PUT /api/garmin/disconnect` - Soft disconnect (재인증 필요)

**자동 동기화**: 10분 TTL 기반으로 백그라운드에서 자동으로 가민 API 데이터 갱신

### Auth/OAuth API (Elysia)

- `POST /api/auth/callback/apple` - Apple 로그인 콜백
- `GET /api/auth/garmin/start` - Garmin OAuth 시작
- `GET /api/auth/garmin/callback` - Garmin OAuth 콜백

### Webhook API (Elysia)

- `POST /api/webhook/garmin/activities` - 활동 웹훅
- `POST /api/webhook/garmin/activity-details` - 활동 상세 웹훅
- `POST /api/webhook/garmin/activity-files` - 활동 파일 웹훅
- `POST /api/webhook/garmin/manual-activities` - 수동 활동 웹훅
- `POST /api/webhook/garmin/moveiq` - MoveIQ 웹훅
- `POST /api/webhook/garmin/deregistrations` - 등록 해제 웹훅
- `POST /api/webhook/garmin/permissions` - 권한 웹훅
- `GET /api/webhook/garmin/status` - 웹훅 통계 조회
- `POST /api/webhook/garmin/retry` - 실패한 웹훅 재처리 (관리자 전용)

### 비즈니스 로직 (Elysia)

- `POST /api/request-demo` - 데모 요청 제출
- `POST /api/subscribe` - 뉴스레터 구독

## 🚀 배포

### Vercel 배포 (권장)

1. Vercel에 프로젝트 연결
2. 환경 변수 설정
3. 자동 배포 활성화

### 기타 플랫폼

```bash
# 프로덕션 빌드
bun run build

# 정적 파일 생성
bun run export
```

## ⚡ 성능 최적화

이 프로젝트는 **구글 로그인 처리 시간을 5-10초에서 1-2초로 단축**하는 다양한 성능 최적화가 적용되어 있습니다:

### 적용된 최적화

- ✅ **데이터베이스 인덱스**: Users, Sessions, Accounts 테이블에 전략적 인덱스 추가
- ✅ **Connection Pool**: 효율적인 DB 연결 관리 (connection_limit=20, pool_timeout=10)
- ✅ **세션 캐싱**: 5분간 세션 쿠키 캐싱으로 DB 쿼리 감소
- ✅ **쿼리 로깅 최적화**: 개발 모드에서 불필요한 쿼리 로깅 제거
- ✅ **OAuth Scope 최적화**: 필요한 scope만 요청하여 인증 속도 향상

### 성능 개선 결과

| 항목 | 개선 전 | 개선 후 | 개선율 |
|------|---------|---------|--------|
| 로그인 처리 시간 | 5-10초 | 1-2초 | **70-80% 단축** |
| DB 쿼리 시간 | 100-500ms | 5-20ms | **95% 단축** |
| 동시 처리 가능 사용자 | 10명 | 50명 | **5배 증가** |

자세한 내용은 [성능 최적화 가이드](./PERFORMANCE_OPTIMIZATION.md)를 참조하세요.

## 📚 추가 문서

- [성능 최적화 가이드](./PERFORMANCE_OPTIMIZATION.md) - ⚡ 로그인 성능 개선 전략 및 적용 방법
- [Garmin 자동 동기화 가이드](./GARMIN_SYNC_GUIDE.md) - 🔄 **NEW!** 10분 TTL 기반 스마트 캐싱 전략
- [Elysia API 마이그레이션 가이드](./ELYSIA_MIGRATION.md) - Elysia 프레임워크 통합 및 성능 최적화
- [프로젝트 구조 가이드](./PROJECT_STRUCTURE.md) - 상세한 프로젝트 구조 및 아키텍처 설명
- [마이그레이션 가이드](./MIGRATION_GUIDE.md) - Supabase에서 Better Auth + Prisma로의 마이그레이션
- [Garmin API 가이드](./GARMIN_API_GUIDE.md) - Garmin 연동 설정

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

문제가 발생하거나 질문이 있으시면 다음을 통해 연락해주세요:

- 이메일: support@fitculator.io
- 이슈 트래커: GitHub Issues

---

**Fitculator** - AI-Powered Exercise Intelligence Platform
