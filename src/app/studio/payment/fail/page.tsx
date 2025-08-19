'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiXCircle, FiArrowLeft, FiHelpCircle } from 'react-icons/fi';
import Link from 'next/link';

export default function StudioPaymentFailPage() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  const getErrorMessage = (code: string | null): string => {
    switch (code) {
      case 'PAY_PROCESS_CANCELED':
        return '결제를 취소하셨습니다.';
      case 'INVALID_CARD_EXPIRY':
        return '카드 유효기간이 올바르지 않습니다.';
      case 'INVALID_STOPPED_CARD':
        return '정지된 카드입니다.';
      case 'INVALID_CARD_INSTALLMENT_PLAN':
        return '할부가 불가능한 카드입니다.';
      case 'EXCEED_MAX_DAILY_PAYMENT_COUNT':
        return '일일 결제 한도를 초과했습니다.';
      case 'NOT_SUPPORTED_CARD':
        return '지원하지 않는 카드입니다.';
      case 'INVALID_CARD_LOST_OR_STOLEN':
        return '분실 또는 도난 카드입니다.';
      case 'RESTRICTED_TRANSFER_ACCOUNT':
        return '계좌이체가 제한된 계좌입니다.';
      default:
        return errorMessage || '결제 처리 중 오류가 발생했습니다.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <FiXCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              결제를 완료할 수 없습니다
            </h1>
            <p className="text-gray-600">
              {getErrorMessage(errorCode)}
            </p>
            {errorCode && (
              <p className="text-sm text-gray-500 mt-2">
                오류 코드: {errorCode}
              </p>
            )}
          </div>

          {/* Help Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <FiHelpCircle className="w-6 h-6 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  이런 방법을 시도해보세요
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 카드 정보를 다시 확인해주세요</li>
                  <li>• 다른 결제 수단을 이용해보세요</li>
                  <li>• 카드사에 문의하여 결제 제한이 있는지 확인해주세요</li>
                  <li>• 잠시 후 다시 시도해주세요</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600 text-center">
              계속 문제가 발생한다면 고객센터로 문의해주세요<br />
              <a href="mailto:support@fitculator.com" className="text-blue-600 hover:underline">
                support@fitculator.com
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Link
              href="/"
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center"
            >
              <FiArrowLeft className="mr-2" />
              홈으로 돌아가기
            </Link>
            <Link
              href="/studio/payment"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
            >
              다시 시도하기
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}