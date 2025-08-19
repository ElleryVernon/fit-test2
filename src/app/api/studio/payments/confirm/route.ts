import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 토스페이먼츠 시크릿 키
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || 'test_sk_5OWRapdA8dJwzRlXGrPo1o2YnYe7';

// 슬랙 웹훅 URL (스튜디오 결제용)
const SLACK_STUDIO_PAYMENT_WEBHOOK_URL = process.env.SLACK_STUDIO_PAYMENT_WEBHOOK_URL;

interface PaymentConfirmRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
  studioName?: string;
  programName?: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  memberCount?: number;
  serviceType: 'studio_program';
}

export async function POST(req: Request) {
  try {
    const {
      paymentKey,
      orderId,
      amount,
      studioName,
      programName,
      email,
      phone,
      countryCode,
      memberCount = 0,
      serviceType
    }: PaymentConfirmRequest = await req.json();

    console.log('스튜디오 결제 확인 요청:', {
      orderId,
      studioName,
      programName,
      email,
      phone,
      countryCode,
      memberCount,
      amount,
      serviceType
    });

    // 1. 토스페이먼츠 결제 승인 API 호출
    const url = 'https://api.tosspayments.com/v1/payments/confirm';
    const basicToken = Buffer.from(TOSS_SECRET_KEY + ':', 'utf-8').toString('base64');

    const tossResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const tossData = await tossResponse.json();
    
    console.log('==========================================');
    console.log('토스페이먼츠 응답 데이터:');
    console.log('status:', tossData.status);
    console.log('orderId:', tossData.orderId);
    console.log('amount:', tossData.totalAmount);
    console.log('method:', tossData.method);
    console.log('==========================================');

    if (!tossResponse.ok) {
      console.error('토스페이먼츠 API 오류:', tossData);
      return NextResponse.json(
        {
          message: '결제 확인 실패',
          error: tossData.message || '알 수 없는 오류',
        },
        { status: tossResponse.status }
      );
    }

    // 2. 결제 성공 시 DB에 저장
    console.log('토스 결제 상태 확인: tossData.status =', tossData.status);
    if (tossData.status === 'DONE') {
      console.log('결제 상태 DONE 확인 - DB 저장 프로세스 시작');
      try {
        console.log('DB 저장 시작 - 서비스 타입:', serviceType);
        
        // 하드코딩된 ID 사용
        const serviceTypeId = 'd0e6cb62-1e5b-4f3c-87b3-df9f2ecad34b';
        const planId = 'cad53416-8f14-422c-a36a-dc2edc361ef0';
        
        console.log('하드코딩된 service_type_id:', serviceTypeId);
        console.log('하드코딩된 plan_id:', planId);

        // 스튜디오 정보 생성 또는 조회 (실제로는 이미 존재해야 함)
        // 여기서는 임시로 slug 생성
        const studioSlug = studioName?.toLowerCase().replace(/\s+/g, '-') || `studio-${Date.now()}`;

        // 구독 정보 저장
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1); // 1개월 후

        // user_id 하드코딩
        const userId = '01063347-84ef-4d79-8e1d-6406ed744dfa';
        console.log('User ID (하드코딩):', userId);

        const subscriptionData = {
          user_id: userId,
          plan_id: planId,
          service_type_id: serviceTypeId,
          reference_id: studioSlug,
          reference_name: studioName || 'Studio',
          status: 'active',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          auto_renew: true,
          metadata: {
            member_count: memberCount,
            initial_order_id: orderId,
            program_name: programName,
            contact_email: email,
            contact_phone: `${countryCode}${phone}`
          }
        };
        
        console.log('==========================================');
        console.log('구독 데이터 저장 시도 (subscriptions 테이블)');
        console.log('==========================================');
        console.log('user_id:', subscriptionData.user_id);
        console.log('plan_id:', subscriptionData.plan_id);
        console.log('service_type_id:', subscriptionData.service_type_id);
        console.log('reference_id:', subscriptionData.reference_id);
        console.log('reference_name:', subscriptionData.reference_name);
        console.log('status:', subscriptionData.status);
        console.log('start_date:', subscriptionData.start_date);
        console.log('end_date:', subscriptionData.end_date);
        console.log('auto_renew:', subscriptionData.auto_renew);
        console.log('metadata:', JSON.stringify(subscriptionData.metadata, null, 2));
        console.log('==========================================');

        const { data: subscription, error: subError } = await supabase
          .from('subscriptions')
          .insert(subscriptionData)
          .select()
          .single();

        if (subError) {
          console.error('구독 정보 저장 실패 상세:', {
            error: subError,
            message: subError.message,
            details: subError.details,
            hint: subError.hint,
            code: subError.code
          });
          throw new Error(`구독 정보 저장에 실패했습니다: ${subError.message}`);
        }
        
        console.log('구독 정보 저장 성공:', subscription);

        // 결제 정보 저장
        const paymentData = {
          subscription_id: subscription.id,
          user_id: userId,
          payment_key: paymentKey,
          order_id: orderId,
          order_name: tossData.orderName,
          amount: amount,
          currency: tossData.currency || 'KRW',
          payment_method: tossData.method,
          status: tossData.status,
          card_type: tossData.card?.cardType,
          owner_type: tossData.card?.ownerType,
          approve_no: tossData.card?.approveNo,
          payment_date: tossData.approvedAt,
          billing_cycle: 'monthly',
          metadata: {
            studio_name: studioName,
            program_name: programName,
            contact_email: email,
            contact_phone: `${countryCode}${phone}`,
            member_count: memberCount,
            service_type: serviceType
          }
        };
        
        console.log('결제 데이터 저장 시도:', paymentData);
        
        const { error: paymentError } = await supabase
          .from('payments')
          .insert(paymentData);

        if (paymentError) {
          console.error('결제 정보 저장 실패 상세:', {
            error: paymentError,
            message: paymentError.message,
            details: paymentError.details,
            hint: paymentError.hint,
            code: paymentError.code
          });
          throw new Error(`결제 정보 저장에 실패했습니다: ${paymentError.message}`);
        }
        
        console.log('결제 정보 저장 성공');

        console.log('스튜디오 구독 및 결제 정보 저장 성공');

        // 슬랙 알림 전송
        if (SLACK_STUDIO_PAYMENT_WEBHOOK_URL) {
          try {
            const slackMessage = {
              text: "🎉 새로운 스튜디오 구독 결제가 완료되었습니다!",
              blocks: [
                {
                  type: "header",
                  text: {
                    type: "plain_text",
                    text: "🏋️ 스튜디오 프로그램 구독 결제 완료"
                  }
                },
                {
                  type: "section",
                  fields: [
                    {
                      type: "mrkdwn",
                      text: `*스튜디오명:*\n${studioName || 'N/A'}`
                    },
                    {
                      type: "mrkdwn", 
                      text: `*프로그램명:*\n${programName || 'N/A'}`
                    },
                    {
                      type: "mrkdwn",
                      text: `*이메일:*\n${email || 'N/A'}`
                    },
                    {
                      type: "mrkdwn",
                      text: `*연락처:*\n${countryCode}${phone || 'N/A'}`
                    },
                    {
                      type: "mrkdwn",
                      text: `*멤버 수:*\n${memberCount}명`
                    },
                    {
                      type: "mrkdwn",
                      text: `*결제 금액:*\n₩${amount.toLocaleString()}`
                    }
                  ]
                },
                {
                  type: "section",
                  fields: [
                    {
                      type: "mrkdwn",
                      text: `*주문 ID:*\n${orderId}`
                    },
                    {
                      type: "mrkdwn",
                      text: `*결제 시간:*\n${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`
                    }
                  ]
                }
              ]
            };

            const slackResponse = await fetch(SLACK_STUDIO_PAYMENT_WEBHOOK_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(slackMessage),
            });

            if (!slackResponse.ok) {
              const slackErrorText = await slackResponse.text();
              console.error('슬랙 API 응답 오류:', slackResponse.status, slackErrorText);
            } else {
              console.log('슬랙 알림 전송 성공');
            }
          } catch (slackError) {
            console.error('슬랙 알림 전송 실패:', slackError);
            // 슬랙 알림 실패는 결제 프로세스에 영향을 주지 않음
          }
        } else {
          console.log('슬랙 웹훅 URL이 설정되지 않음');
        }

      } catch (dbError) {
        console.error('==========================================');
        console.error('DB 저장 중 오류 발생!!!');
        console.error('오류 내용:', dbError);
        console.error('오류 타입:', typeof dbError);
        if (dbError instanceof Error) {
          console.error('오류 메시지:', dbError.message);
          console.error('오류 스택:', dbError.stack);
        }
        console.error('==========================================');
        
        // 결제는 성공했지만 DB 저장 실패 - 관리자에게 알림 필요
        return NextResponse.json(
          {
            ...tossData,
            warning: '결제는 성공했으나 구독 정보 저장에 실패했습니다. 고객센터에 문의해주세요.',
          },
          { status: 200 }
        );
      }
    } else {
      console.log('결제 상태가 DONE이 아님. status:', tossData.status);
    }

    // 성공 응답 반환
    return NextResponse.json(tossData, { status: 200 });

  } catch (error) {
    console.error('결제 처리 오류:', error);
    return NextResponse.json(
      { 
        error: '결제 처리 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}