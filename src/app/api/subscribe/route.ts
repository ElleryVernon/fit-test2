import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  sendSlackNotification,
  createNewsletterSubscriptionMessage,
} from '@/utils/slackNotifier';

// 환경 변수 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const slackWebhookUrl = process.env.SLACK_NEWSLETTER_WEBHOOK_URL;

// Supabase 클라이언트 초기화
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, referrer, origin, honeypot } = body;

    // Honeypot 체크 (스팸 방지)
    if (honeypot) {
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 });
    }

    // 이메일 유효성 검사 (간단)
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    if (!origin) {
      return NextResponse.json(
        { error: 'Origin is required' },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const { data: existingEmail } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    // 이메일이 존재하지 않는 경우에만 삽입 (중복 방지)
    let error = null;
    if (!existingEmail) {
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, referrer, origin }]);
      error = insertError;
    }

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 슬랙 알림 전송 (새 구독자인 경우에만)
    if (!existingEmail && slackWebhookUrl) {
      try {
        const slackMessage = createNewsletterSubscriptionMessage(
          email,
          referrer,
          origin
        );

        await sendSlackNotification(slackWebhookUrl, slackMessage);
      } catch (notificationError) {
        // 슬랙 알림 실패는 사용자 응답에 영향을 주지 않도록 함
        console.error('Slack notification error:', notificationError);
      }
    }

    return NextResponse.json(
      { message: 'Subscribed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
