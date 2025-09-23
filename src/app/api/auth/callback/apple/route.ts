import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // Apple OAuth 처리 로직을 여기에 구현
    // 현재는 기본적인 응답만 반환
    return NextResponse.json({
      success: true,
      message: 'Apple login callback received',
    });
  } catch (error) {
    console.error('Apple OAuth callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}