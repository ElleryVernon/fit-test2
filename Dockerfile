# Fitculator Landing Page - 프로덕션 Docker 이미지

# Node.js 18 Alpine 이미지 사용
FROM node:18-alpine AS base

# Bun 설치
RUN npm install -g bun

# 의존성 설치 단계
FROM base AS deps
WORKDIR /app

# 패키지 파일 복사
COPY package.json bun.lockb* ./

# 의존성 설치
RUN bun install --frozen-lockfile

# 빌드 단계
FROM base AS builder
WORKDIR /app

# 의존성 복사
COPY --from=deps /app/node_modules ./node_modules

# 소스 코드 복사
COPY . .

# 환경 변수 설정 (빌드 시 필요)
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# 프로덕션 빌드
RUN bun run build

# 프로덕션 실행 단계
FROM base AS runner
WORKDIR /app

# 프로덕션 환경 설정
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# 시스템 사용자 생성
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 필요한 파일만 복사
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 권한 설정
RUN chown -R nextjs:nodejs /app
USER nextjs

# 포트 노출
EXPOSE 3000

# 환경 변수 설정
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# 애플리케이션 실행
CMD ["node", "server.js"]
