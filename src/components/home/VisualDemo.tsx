'use client';

import React from 'react';
import FadeUp from '../animations/FadeUp';
import ScrollReveal from '../animations/ScrollReveal';
import { useLanguage } from '@/contexts/LanguageContext';

const VisualDemo = () => {
  const { language } = useLanguage();
  return (
    <section id="visualdemo" className="bg-[#0d1117] text-white py-20">
      <div className="container mx-auto px-4">
        <FadeUp className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Visual Demo</h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Athlete Log → Program Generator */}
          <ScrollReveal direction="left" className="h-full">
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-800 h-full">
              <div className="aspect-square bg-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-fitculator-primary to-fitculator-secondary opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20 text-white opacity-30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  Athlete Log → Program Generator
                </h3>
                <p className="text-gray-400">
                  {language === 'ko'
                    ? '운동 로그를 분석하여 맞춤형 프로그램으로 자동 변환합니다.'
                    : 'Analyze training logs and automatically convert them into customized programs.'}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* 'Fitculator Athletes' Interface */}
          <ScrollReveal direction="up" delay={0.1} className="h-full">
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-800 h-full">
              <div className="aspect-square bg-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-fitculator-secondary to-fitculator-accent opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20 text-white opacity-30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  &apos;Fitculator Athletes&apos; Interface
                </h3>
                <p className="text-gray-400">
                  {language === 'ko'
                    ? '팬들이 선수의 일상 훈련에 참여하고 구독할 수 있는 직관적인 인터페이스입니다.'
                    : 'Intuitive interface for fans to engage with and subscribe to an athlete&apos;s daily training.'}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Studio Dashboard View */}
          <ScrollReveal direction="right" delay={0.2} className="h-full">
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-800 h-full">
              <div className="aspect-square bg-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-fitculator-accent to-fitculator-coral opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20 text-white opacity-30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  Studio Dashboard View
                </h3>
                <p className="text-gray-400">
                  {language === 'ko'
                    ? '스튜디오 운영을 자동화하고 관리 부담을 줄이는 강력한 대시보드입니다.'
                    : 'Powerful dashboard to automate studio operations and reduce administrative burden.'}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* 추가 설명 */}
        <ScrollReveal
          direction="up"
          delay={0.3}
          className="mt-16 max-w-3xl mx-auto text-center"
        >
          <p className="text-gray-400 italic">
            {language === 'ko'
              ? '* 현재 이미지는 대표 예시입니다. 실제 제품은 더 많은 기능과 맞춤형 옵션을 제공합니다.'
              : '* Current images are representative examples. The actual product offers more features and customization options.'}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default VisualDemo;
