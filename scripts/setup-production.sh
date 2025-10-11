#!/bin/bash

# Fitculator Landing Page - 프로덕션 설정 스크립트

echo "🚀 Fitculator 프로덕션 설정을 시작합니다..."

# 1. 의존성 설치
echo "📦 의존성 설치 중..."
bun install

# 2. 환경 변수 확인
echo "🔍 환경 변수 확인 중..."
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local 파일이 없습니다."
    echo "📝 .env.example을 참고하여 .env.local 파일을 생성하세요."
    exit 1
fi

# 필수 환경 변수 확인
required_vars=("DATABASE_URL" "BETTER_AUTH_SECRET" "NEXT_PUBLIC_GOOGLE_CLIENT_ID" "GOOGLE_CLIENT_SECRET")
for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env.local; then
        echo "❌ 필수 환경 변수 ${var}가 설정되지 않았습니다."
        exit 1
    fi
done

echo "✅ 환경 변수 확인 완료"

# 3. 데이터베이스 마이그레이션
echo "🗄️ 데이터베이스 마이그레이션 실행 중..."
if [ -f "better-auth-schema.sql" ]; then
    echo "Better Auth 테이블 생성 중..."
    psql $DATABASE_URL -f better-auth-schema.sql
    if [ $? -eq 0 ]; then
        echo "✅ 데이터베이스 마이그레이션 완료"
    else
        echo "❌ 데이터베이스 마이그레이션 실패"
        exit 1
    fi
else
    echo "⚠️ better-auth-schema.sql 파일이 없습니다. 수동으로 마이그레이션을 실행하세요."
fi

# 4. 빌드 테스트
echo "🔨 프로덕션 빌드 테스트 중..."
bun run build
if [ $? -eq 0 ]; then
    echo "✅ 빌드 테스트 성공"
else
    echo "❌ 빌드 테스트 실패"
    exit 1
fi

# 5. 린트 검사
echo "🔍 코드 품질 검사 중..."
bun run lint
if [ $? -eq 0 ]; then
    echo "✅ 린트 검사 통과"
else
    echo "⚠️ 린트 오류가 있습니다. 수정을 권장합니다."
fi

# 6. 보안 검사
echo "🔒 보안 검사 중..."
if grep -q "BETTER_AUTH_SECRET=generate-a-secure-random-string" .env.local; then
    echo "❌ BETTER_AUTH_SECRET이 기본값입니다. 보안을 위해 변경하세요."
    echo "💡 다음 명령어로 안전한 시크릿을 생성하세요:"
    echo "   openssl rand -base64 32"
    exit 1
fi

echo "✅ 보안 검사 완료"

# 7. 완료 메시지
echo ""
echo "🎉 프로덕션 설정이 완료되었습니다!"
echo ""
echo "📋 다음 단계:"
echo "1. 프로덕션 서버에서 환경 변수를 설정하세요"
echo "2. 데이터베이스 백업을 생성하세요"
echo "3. SSL 인증서를 설정하세요"
echo "4. 모니터링 도구를 설정하세요"
echo ""
echo "🚀 배포 준비 완료!"
