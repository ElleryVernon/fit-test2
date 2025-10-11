'use client';

import React from 'react';
import FadeUp from '@/components/ui/animations/FadeUp';
import ScrollReveal from '@/components/ui/animations/ScrollReveal';
import Shimmer from '@/components/ui/animations/Shimmer';
import { useLanguage } from '@/hooks';
import { translations } from '@/utils/translations';
import { getTextByLanguage } from '@/utils/languageUtils';

const Solution = () => {
  const { language } = useLanguage();
  return (
    <section className="py-20 bg-[#0d1117]">
      <div className="container mx-auto px-4">
        <FadeUp className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {getTextByLanguage(translations.solution.title, language)}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {getTextByLanguage(translations.solution.subtitle, language)}
          </p>
        </FadeUp>

        {/* 애니메이션: 웨어러블 디바이스 → 데이터 흐름 → 대시보드 시각화 */}
        <ScrollReveal className="max-w-5xl mx-auto mb-16">
          <Shimmer>
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-800 p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                {/* 웨어러블 디바이스 */}
                <div className="flex-1 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-fitculator-secondary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {language === 'ko'
                      ? '웨어러블 디바이스'
                      : 'Wearable Devices'}
                  </h3>
                  <p className="text-gray-400">
                    {language === 'ko'
                      ? '회원들의 운동 데이터 수집'
                      : 'Collect member workout data'}
                  </p>
                </div>

                {/* 화살표 */}
                <div className="hidden md:block text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
                <div className="block md:hidden text-gray-600 my-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>

                {/* 데이터 흐름 */}
                <div className="flex-1 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-fitculator-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {language === 'ko' ? 'AI 분석' : 'AI Analysis'}
                  </h3>
                  <p className="text-gray-400">
                    {language === 'ko'
                      ? '독점 알고리즘으로 데이터 처리'
                      : 'Process data with proprietary algorithms'}
                  </p>
                </div>

                {/* 화살표 */}
                <div className="hidden md:block text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
                <div className="block md:hidden text-gray-600 my-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>

                {/* 대시보드 시각화 */}
                <div className="flex-1 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-fitculator-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {language === 'ko' ? '인사이트 생성' : 'Generate Insights'}
                  </h3>
                  <p className="text-gray-400">
                    {language === 'ko'
                      ? '맞춤형 회원 경험을 위한 데이터'
                      : 'Data for personalized member experiences'}
                  </p>
                </div>
              </div>
            </div>
          </Shimmer>
        </ScrollReveal>

        {/* 작동 방식 */}
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-2">
              {language === 'ko' ? '작동 방식:' : 'How It Works:'}
            </h3>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal direction="left">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 h-full">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fitculator-primary flex items-center justify-center mr-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">
                      {language === 'ko'
                        ? '회원의 웨어러블 디바이스를 시스템에 연결'
                        : "Connect members' wearable devices to our system"}
                    </h4>
                    <p className="text-gray-400">
                      {language === 'ko'
                        ? '모든 주요 피트니스 트래커 및 스마트워치와 원활하게 통합하여 실시간 운동 데이터를 수집합니다.'
                        : 'Seamlessly integrate with all major fitness trackers and smartwatches to collect real-time exercise data.'}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.1}>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 h-full">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fitculator-primary flex items-center justify-center mr-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">
                      {language === 'ko'
                        ? '독점 알고리즘으로 운동 패턴 및 강도 분석'
                        : 'Our proprietary algorithms analyze exercise patterns and intensity'}
                    </h4>
                    <p className="text-gray-400">
                      {language === 'ko'
                        ? '고급 AI 기술로 유산소 및 근력 운동을 비교할 수 없는 정밀도로 정량화합니다.'
                        : 'Advanced AI technology quantifies both aerobic and strength training with unmatched precision.'}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.2}>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 h-full">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fitculator-primary flex items-center justify-center mr-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">
                      {language === 'ko'
                        ? '개인화된 회원 경험을 위한 실행 가능한 인사이트 생성'
                        : 'Generate actionable insights for personalized member experiences'}
                    </h4>
                    <p className="text-gray-400">
                      {language === 'ko'
                        ? '위험에 처한 회원을 식별하고, 프로그래밍을 최적화하며, 맞춤형 추천을 생성합니다.'
                        : 'Identify at-risk members, optimize programming, and create tailored recommendations.'}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.3}>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 h-full">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fitculator-primary flex items-center justify-center mr-4">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">
                      {language === 'ko'
                        ? '참여도, 만족도 및 유지율이 상승하는 것을 지켜보세요'
                        : 'Watch as engagement, satisfaction, and retention soar'}
                    </h4>
                    <p className="text-gray-400">
                      {language === 'ko'
                        ? '데이터를 측정 가능한 ROI로 실질적인 비즈니스 결과로 전환합니다.'
                        : 'Transform data into tangible business results with measurable ROI.'}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* 통합 가능한 웨어러블 디바이스 로고들 */}
        <FadeUp className="mt-16 text-center">
          <p className="text-lg text-gray-400 mb-8">
            {language === 'ko'
              ? '모든 주요 웨어러블 디바이스와 호환'
              : 'Compatible with all major wearable devices'}
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {/* 웨어러블 디바이스 로고 자리 */}
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-xs">Apple</span>
            </div>
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-xs">Fitbit</span>
            </div>
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-xs">Garmin</span>
            </div>
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-xs">Samsung</span>
            </div>
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-xs">Polar</span>
            </div>
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-xs">Whoop</span>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default Solution;
