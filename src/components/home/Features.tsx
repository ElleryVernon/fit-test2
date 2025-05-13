'use client';

import React from 'react';
import FadeUp from '../animations/FadeUp';
import ScrollReveal from '../animations/ScrollReveal';
import Shimmer from '../animations/Shimmer';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/utils/translations';
import { getTextByLanguage } from '@/utils/languageUtils';

const Features = () => {
  const { language } = useLanguage();
  return (
    <section id="features" className="bg-[#0d1117] text-white py-20">
      <div className="container mx-auto px-4">
        <FadeUp className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {getTextByLanguage(translations.features.title, language)}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {getTextByLanguage(translations.features.subtitle, language)}
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* 기능 1: Precision Exercise Quantification */}
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
              <h3 className="text-2xl font-bold mb-4">
                {getTextByLanguage(
                  translations.features.items.analytics.title,
                  language
                )}
              </h3>
              <p className="text-gray-300 mb-4">
                {getTextByLanguage(
                  translations.features.items.analytics.description,
                  language
                )}
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
                      ? '종합적인 운동 강도 측정'
                      : 'Comprehensive workout intensity metrics'}
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
                      ? '실시간 성과 추적'
                      : 'Real-time performance tracking'}
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
                      ? '독점 근력 훈련 알고리즘'
                      : 'Proprietary strength training algorithms'}
                  </span>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          {/* 기능 2: AI-Powered Retention Insights */}
          <ScrollReveal direction="right" delay={0.1} className="h-full">
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {getTextByLanguage(
                  translations.features.items.prediction.title,
                  language
                )}
              </h3>
              <p className="text-gray-300 mb-4">
                {getTextByLanguage(
                  translations.features.items.prediction.description,
                  language
                )}
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
                      ? '예측 이탈 분석'
                      : 'Predictive churn analysis'}
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
                      ? '참여도 점수 시스템'
                      : 'Engagement scoring system'}
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
                      ? '자동화된 개입 추천'
                      : 'Automated intervention recommendations'}
                  </span>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          {/* 기능 3: Seamless Integration */}
          <ScrollReveal direction="left" delay={0.2} className="h-full">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {getTextByLanguage(
                  translations.features.items.integration.title,
                  language
                )}
              </h3>
              <p className="text-gray-300 mb-4">
                {getTextByLanguage(
                  translations.features.items.integration.description,
                  language
                )}
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
                      ? '기존 시스템과 빠른 설정'
                      : 'Quick setup with existing systems'}
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
                      ? '모든 주요 웨어러블과 호환'
                      : 'Compatible with all major wearables'}
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
                      ? '맞춤 통합을 위한 오픈 API'
                      : 'Open API for custom integrations'}
                  </span>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          {/* 기능 4: Member Engagement Tools */}
          <ScrollReveal direction="right" delay={0.3} className="h-full">
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 h-full">
              <div className="w-16 h-16 rounded-full bg-fitculator-coral bg-opacity-20 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-fitculator-coral"
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
              <h3 className="text-2xl font-bold mb-4">
                {getTextByLanguage(
                  translations.features.items.personalization.title,
                  language
                )}
              </h3>
              <p className="text-gray-300 mb-4">
                {getTextByLanguage(
                  translations.features.items.personalization.description,
                  language
                )}
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
                      ? '개인화된 운동 제안'
                      : 'Personalized workout suggestions'}
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
                      ? '진행 상황 추적 및 축하'
                      : 'Progress tracking and celebrations'}
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
                      ? '커뮤니티 챌린지 및 게임화'
                      : 'Community challenges and gamification'}
                  </span>
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>

        {/* 데모 이미지 */}
        <ScrollReveal
          direction="up"
          delay={0.4}
          className="max-w-5xl mx-auto mt-16"
        >
          <Shimmer>
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-800">
              <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  {language === 'ko'
                    ? 'Fitculator 대시보드'
                    : 'Fitculator Dashboard'}
                </h3>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-fitculator-primary bg-opacity-20 flex items-center justify-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-fitculator-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h7"
                      />
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-fitculator-secondary bg-opacity-20 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-fitculator-secondary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6 flex justify-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">
                      {language === 'ko' ? '회원 유지율' : 'Member Retention'}
                    </h4>
                    <div className="text-3xl font-bold text-fitculator-accent mb-2">
                      87%
                    </div>
                    <div className="flex items-center text-green-500 text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        {language === 'ko'
                          ? '+27% vs 업계 평균'
                          : '+27% vs industry avg'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">
                      {language === 'ko' ? '수업 참석률' : 'Class Attendance'}
                    </h4>
                    <div className="text-3xl font-bold text-fitculator-secondary mb-2">
                      67%
                    </div>
                    <div className="flex items-center text-green-500 text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        {language === 'ko' ? '+67% 증가' : '+67% increase'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">
                      {language === 'ko' ? '이탈 위험 회원' : 'At-Risk Members'}
                    </h4>
                    <div className="text-3xl font-bold text-fitculator-primary mb-2">
                      12
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <span>
                        {language === 'ko' ? '조치 필요' : 'Action needed'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">
                      {language === 'ko' ? '투자 수익률' : 'ROI'}
                    </h4>
                    <div className="text-3xl font-bold text-fitculator-coral mb-2">
                      3.2x
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <span>
                        {language === 'ko' ? '6개월 내' : 'Within 6 months'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Shimmer>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Features;
