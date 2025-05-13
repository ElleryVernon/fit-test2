'use client';

import React from 'react';
import Link from 'next/link';
import FadeUp from '../animations/FadeUp';
import Shimmer from '../animations/Shimmer';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/utils/translations';
import { getTextByLanguage } from '@/utils/languageUtils';

const CTA = () => {
  const { language } = useLanguage();
  return (
    <section className="bg-[#0d1117] text-white py-20 relative overflow-hidden">
      {/* 배경 그래디언트 효과 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-fitculator-primary opacity-10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-fitculator-secondary opacity-10 blur-[150px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <FadeUp className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {getTextByLanguage(translations.cta.title, language)}
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-10">
            {getTextByLanguage(translations.cta.subtitle, language)}
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Shimmer>
              <Link
                href="#"
                className="btn-primary text-lg px-10 py-5 text-center inline-block"
              >
                {getTextByLanguage(translations.cta.buttonText, language)}
              </Link>
            </Shimmer>
            <Link
              href="#"
              className="btn-secondary text-lg px-10 py-5 text-center inline-block"
            >
              {getTextByLanguage(translations.common.scheduleCall, language)}
            </Link>
          </div>

          {/* 신뢰 요소 */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 bg-opacity-60 rounded-lg p-6 border border-gray-800">
              <div className="w-12 h-12 rounded-full bg-fitculator-primary bg-opacity-20 flex items-center justify-center mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-fitculator-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">
                {language === 'ko'
                  ? '기업급 보안'
                  : 'Enterprise-Grade Security'}
              </h3>
              <p className="text-gray-400 text-center">
                {language === 'ko'
                  ? '귀하의 데이터는 은행 수준의 암호화 및 보안 프로토콜로 보호됩니다.'
                  : 'Your data is protected with bank-level encryption and security protocols.'}
              </p>
            </div>

            <div className="bg-gray-900 bg-opacity-60 rounded-lg p-6 border border-gray-800">
              <div className="w-12 h-12 rounded-full bg-fitculator-secondary bg-opacity-20 flex items-center justify-center mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-fitculator-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">
                {language === 'ko' ? '빠른 구현' : 'Quick Implementation'}
              </h3>
              <p className="text-gray-400 text-center">
                {language === 'ko'
                  ? '원활한 온보딩 프로세스로 하루 만에 시작하세요.'
                  : 'Be up and running in less than a day with our seamless onboarding process.'}
              </p>
            </div>

            <div className="bg-gray-900 bg-opacity-60 rounded-lg p-6 border border-gray-800">
              <div className="w-12 h-12 rounded-full bg-fitculator-accent bg-opacity-20 flex items-center justify-center mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-fitculator-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">
                {language === 'ko' ? '전담 지원' : 'Dedicated Support'}
              </h3>
              <p className="text-gray-400 text-center">
                {language === 'ko'
                  ? '고객 성공 팀이 24/7 지원하여 귀하의 성공을 보장합니다.'
                  : 'Our customer success team is available 24/7 to ensure your success.'}
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default CTA;
