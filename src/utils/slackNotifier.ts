/**
 * 슬랙 알림 전송 유틸리티
 *
 * 이 모듈은 슬랙 웹훅을 통해 알림을 보내는 기능을 제공합니다.
 * 다양한 이벤트 유형에 따라 적절한 메시지 포맷을 생성합니다.
 */

// 슬랙 메시지 타입 정의
export interface SlackMessageBlock {
  type: string;
  text?: {
    type: string;
    text: string;
    emoji?: boolean;
  };
  fields?: Array<{
    type: string;
    text: string;
  }>;
  elements?: Array<{
    type: string;
    text: string;
  }>;
}

export interface SlackMessage {
  blocks: SlackMessageBlock[];
}

/**
 * 슬랙 알림 전송 함수
 * @param webhookUrl 슬랙 웹훅 URL
 * @param message 전송할 메시지 객체
 * @returns 전송 결과
 */
export async function sendSlackNotification(
  webhookUrl: string,
  message: SlackMessage
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Slack API error: ${response.status} ${errorText}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * 뉴스레터 구독 알림 메시지 생성
 * @param email 구독자 이메일
 * @param referrer 리퍼러 정보
 * @param origin 구독 출처
 * @returns 슬랙 메시지 객체
 */
export function createNewsletterSubscriptionMessage(
  email: string,
  referrer: string | null,
  origin: string
) {
  const now = new Date();
  const koreanTime = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now);

  return {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🎉 새로운 뉴스레터 구독',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*이메일:*\n${email}`,
          },
          {
            type: 'mrkdwn',
            text: `*구독 시간:*\n${koreanTime}`,
          },
        ],
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*출처:*\n${origin}`,
          },
          {
            type: 'mrkdwn',
            text: `*리퍼러:*\n${referrer || '직접 방문'}`,
          },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: '📊 Fitculator 랜딩 페이지에서 발생한 뉴스레터 구독입니다.',
          },
        ],
      },
      {
        type: 'divider',
      },
    ],
  };
}

/**
 * 데모 요청 알림 메시지 생성
 * @param companyName 회사명
 * @param name 이름
 * @param email 이메일
 * @param message 메시지
 * @param origin 요청 출처
 * @returns 슬랙 메시지 객체
 */
export function createDemoRequestMessage(
  companyName: string,
  name: string,
  email: string,
  message: string,
  origin: string
) {
  const now = new Date();
  const koreanTime = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now);

  return {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🚀 새로운 데모 요청',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*회사:*\n${companyName}`,
          },
          {
            type: 'mrkdwn',
            text: `*이름:*\n${name}`,
          },
        ],
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*이메일:*\n${email}`,
          },
          {
            type: 'mrkdwn',
            text: `*요청 시간:*\n${koreanTime}`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*메시지:*\n${message}`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `📌 출처: ${origin}`,
          },
        ],
      },
      {
        type: 'divider',
      },
    ],
  };
}
