'use client';

import React from 'react';
import FadeUp from '../animations/FadeUp';
import ScrollReveal from '../animations/ScrollReveal';
import Shimmer from '../animations/Shimmer';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/utils/translations';
import { getTextByLanguage } from '@/utils/languageUtils';

const Vision = () => {
  const { language } = useLanguage();
  return (
    <section id="vision" className="bg-[#0d1117] text-white py-20">
      <div className="container mx-auto px-4">
        <FadeUp className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {getTextByLanguage(translations.vision.title, language)}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {getTextByLanguage(translations.vision.subtitle, language)}
          </p>
        </FadeUp>

        <div className="max-w-6xl mx-auto">
          {/* 미래지향적 그래픽 */}
          <ScrollReveal className="mb-16">
            <Shimmer>
              <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-800 p-6">
                <div className="relative h-64 md:h-80">
                  {/* 중앙 원 */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-r from-fitculator-primary to-fitculator-secondary flex items-center justify-center z-20">
                    <div className="text-white text-center">
                      <div className="font-bold text-lg">Fitculator</div>
                      <div className="text-xs">
                        {language === 'ko' ? 'AI 코어' : 'AI Core'}
                      </div>
                    </div>
                  </div>

                  {/* 연결선 */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
                    {/* 왼쪽 상단 */}
                    <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] border-t border-l border-gray-700 rounded-tl-full"></div>
                    {/* 오른쪽 상단 */}
                    <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] border-t border-r border-gray-700 rounded-tr-full"></div>
                    {/* 왼쪽 하단 */}
                    <div className="absolute bottom-[20%] left-[20%] w-[30%] h-[30%] border-b border-l border-gray-700 rounded-bl-full"></div>
                    {/* 오른쪽 하단 */}
                    <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] border-b border-r border-gray-700 rounded-br-full"></div>
                  </div>

                  {/* 주변 노드들 */}
                  <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-fitculator-primary bg-opacity-20 flex items-center justify-center mb-2">
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
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">
                      {language === 'ko' ? '생리학' : 'Physiology'}
                    </span>
                  </div>

                  <div className="absolute top-1/2 right-[5%] transform -translate-y-1/2 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-fitculator-secondary bg-opacity-20 flex items-center justify-center mb-2">
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
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">
                      {language === 'ko' ? '생체역학' : 'Biomechanics'}
                    </span>
                  </div>

                  <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-fitculator-accent bg-opacity-20 flex items-center justify-center mb-2">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">
                      {language === 'ko' ? '회복' : 'Recovery'}
                    </span>
                  </div>

                  <div className="absolute top-1/2 left-[5%] transform -translate-y-1/2 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-fitculator-coral bg-opacity-20 flex items-center justify-center mb-2">
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
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">
                      {language === 'ko' ? '예측' : 'Predictions'}
                    </span>
                  </div>
                </div>
              </div>
            </Shimmer>
          </ScrollReveal>

          {/* 로드맵 */}
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="space-y-6">
                <p className="text-xl text-gray-300 text-center mb-8">
                  {language === 'ko'
                    ? '우리의 로드맵은 운동 과학과 AI 기술의 혁신적인 발전을 포함합니다:'
                    : 'Our roadmap includes groundbreaking advancements in exercise science and AI technology:'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fitculator-secondary flex items-center justify-center mt-1 mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-1">
                          {language === 'ko'
                            ? '생리학적 반응 패턴'
                            : 'Physiological response patterns'}
                        </h4>
                        <p className="text-gray-400">
                          {language === 'ko'
                            ? '다양한 운동 자극에 대한 개인별 반응 이해'
                            : 'Understanding individual responses to different exercise stimuli'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fitculator-primary flex items-center justify-center mt-1 mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-1">
                          {language === 'ko'
                            ? '고급 생체역학 분석'
                            : 'Advanced biomechanics analysis'}
                        </h4>
                        <p className="text-gray-400">
                          {language === 'ko'
                            ? '자세를 최적화하고 부상을 예방하기 위한 상세한 움직임 패턴 인식'
                            : 'Detailed movement pattern recognition to optimize form and prevent injuries'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fitculator-accent flex items-center justify-center mt-1 mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
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
                      <div>
                        <h4 className="text-xl font-bold mb-1">
                          {language === 'ko'
                            ? '회복 및 적응 인사이트'
                            : 'Recovery and adaptation insights'}
                        </h4>
                        <p className="text-gray-400">
                          {language === 'ko'
                            ? '개인별 적응 속도에 기반한 맞춤형 회복 프로토콜'
                            : 'Personalized recovery protocols based on individual adaptation rates'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fitculator-coral flex items-center justify-center mt-1 mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
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
                      <div>
                        <h4 className="text-xl font-bold mb-1">
                          {language === 'ko'
                            ? '예측 피트니스 결과'
                            : 'Predictive fitness outcomes'}
                        </h4>
                        <p className="text-gray-400">
                          {language === 'ko'
                            ? '현재 트레이닝 패턴에 기반한 AI 기반 피트니스 결과 예측'
                            : 'AI-powered forecasting of fitness results based on current training patterns'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* 마무리 문구 */}
          <FadeUp className="text-center mt-16">
            <p className="text-xl font-semibold gradient-text">
              {language === 'ko'
                ? '데이터 기반 피트니스의 미래를 개척하는 데 함께하세요.'
                : 'Join us in pioneering the future of data-driven fitness.'}
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

export default Vision;
