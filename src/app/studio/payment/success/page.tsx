'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiHome, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [, setPaymentData] = useState<{ status: string; amount: number; orderId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');
      const studioName = searchParams.get('studioName');
      const programName = searchParams.get('programName');
      const email = searchParams.get('email');
      const phone = searchParams.get('phone');
      const countryCode = searchParams.get('countryCode');
      const memberCount = searchParams.get('memberCount');

      if (!paymentKey || !orderId || !amount) {
        setError('필수 결제 정보가 누락되었습니다.');
        setIsProcessing(false);
        return;
      }

      try {
        const response = await fetch('/api/studio/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
            studioName,
            programName,
            email,
            phone,
            countryCode,
            memberCount: Number(memberCount),
            serviceType: 'studio_program',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '결제 승인 실패');
        }

        const data = await response.json();
        setPaymentData(data);
        console.log('Payment confirmed:', data);
      } catch (err) {
        console.error('결제 승인 오류:', err);
        setError(err instanceof Error ? err.message : '결제 처리 중 오류가 발생했습니다.');
      } finally {
        setIsProcessing(false);
      }
    };

    confirmPayment();
  }, [searchParams]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">결제를 처리하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">결제 처리 실패</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href="/studio/payment"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            다시 시도하기
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-2xl shadow-lg p-8"
        >
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center">
              <FiCheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              결제가 완료되었습니다!
            </h1>
            <p className="text-gray-400">
              스튜디오 프로그램 구독이 성공적으로 활성화되었습니다.
            </p>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">결제 정보</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">주문번호</span>
                <span className="font-medium text-gray-200">{searchParams.get('orderId')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">스튜디오명</span>
                <span className="font-medium text-gray-200">{searchParams.get('studioName') || '스튜디오'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">참여 멤버 수</span>
                <span className="font-medium text-gray-200">{searchParams.get('memberCount') || '0'}명</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">결제 금액</span>
                <span className="font-medium text-blue-400">
                  ₩{Number(searchParams.get('amount') || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">결제 상태</span>
                <span className="font-medium text-green-400">완료</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-900/30 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-white mb-2">다음 단계</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• 등록하신 이메일로 상세 안내가 발송됩니다</li>
              <li>• 관리자 계정으로 로그인하여 프로그램을 설정하세요</li>
              <li>• 멤버들에게 초대 링크를 공유하세요</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Link
              href="/"
              className="flex-1 bg-gray-700 text-gray-200 py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center justify-center"
            >
              <FiHome className="mr-2" />
              홈으로
            </Link>
            <button
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              onClick={() => window.print()}
            >
              영수증 출력
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function StudioPaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}