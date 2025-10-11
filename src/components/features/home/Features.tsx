'use client';

import React from 'react';
import FadeUp from '@/components/ui/animations/FadeUp';
import ScrollReveal from '@/components/ui/animations/ScrollReveal';
import { useLanguage } from '@/hooks';

const Features = () => {
  const { language } = useLanguage();
  return (
    <section id="features" className="bg-[#0d1117] text-white py-20">
      <div className="container mx-auto px-4">
        <FadeUp className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Value Proposition
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* F1: Training → Programs */}
          <ScrollReveal direction="left" className="h-full">
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 h-full">
              <div className="w-16 h-16 rounded-full bg-fitculator-primary bg-opacity-20 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-fitculator-primary"
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
              <h3 className="text-2xl font-bold mb-4">Training → Programs</h3>
              <p className="text-gray-300 mb-4">
                Turn your training logs into plug-and-play workout sessions.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-fitculator-accent mr-2 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {language === 'ko'
                      ? '확장 가능한 형식으로 제공'
                      : 'Delivered in scalable, ready-to-use formats'}
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-fitculator-accent mr-2 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {language === 'ko'
                      ? '난이도, 시간, 방식별 맞춤화 가능'
                      : 'Customizable by difficulty, time, and modality'}
                  </span>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          {/* F2: Fans → Customers */}
          <ScrollReveal direction="up" delay={0.1} className="h-full">
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 h-full">
              <div className="w-16 h-16 rounded-full bg-fitculator-secondary bg-opacity-20 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-fitculator-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Fans → Customers</h3>
              <p className="text-gray-300 mb-4">
                Let fans subscribe to your daily training.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-fitculator-accent mr-2 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {language === 'ko'
                      ? '원클릭으로 챌린지 시작'
                      : 'Launch challenges with one click'}
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-fitculator-accent mr-2 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {language === 'ko'
                      ? '가치를 타협하지 않고 팔로워 수익화'
                      : 'Monetize your following — without compromising your values'}
                  </span>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          {/* F3: Studios → Systems */}
          <ScrollReveal direction="right" delay={0.2} className="h-full">
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 h-full">
              <div className="w-16 h-16 rounded-full bg-fitculator-accent bg-opacity-20 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-fitculator-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Studios → Systems</h3>
              <p className="text-gray-300 mb-4">
                Automate programming, session planning, and engagement.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-fitculator-accent mr-2 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {language === 'ko'
                      ? '관리 오버헤드 감소'
                      : 'Reduce admin overhead'}
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-fitculator-accent mr-2 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {language === 'ko'
                      ? '당신이 주도하는 기계처럼 스튜디오 운영'
                      : 'Run your studio like a machine — powered by you'}
                  </span>
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Features;
