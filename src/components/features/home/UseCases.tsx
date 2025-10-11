'use client';

import React, { useState } from 'react';
import FadeUp from '@/components/ui/animations/FadeUp';
import ScrollReveal from '@/components/ui/animations/ScrollReveal';
import { useLanguage } from '@/hooks';
import { translations } from '@/utils/translations';
import { getTextByLanguage } from '@/utils/languageUtils';

const UseCases = () => {
  const [activeTab, setActiveTab] = useState('retention');
  const { language: langCode } = useLanguage();
  // 타입 안전성을 위해 language를 'en' | 'ko'로 타입 단언
  const language = (langCode === 'ko' ? 'ko' : 'en') as 'en' | 'ko';

  // 언어 변경 시 사용 사례 데이터 업데이트
  const useCases = [
    {
      id: 'retention',
      title: getTextByLanguage(translations.useCases.retention.title, language),
      description: getTextByLanguage(
        translations.useCases.retention.description,
        language
      ),
      isActive: activeTab === 'retention',
      points:
        translations.useCases.retention.points[language] ||
        translations.useCases.retention.points.en,
    },
    {
      id: 'programming',
      title: getTextByLanguage(
        translations.useCases.programming.title,
        language
      ),
      description: getTextByLanguage(
        translations.useCases.programming.description,
        language
      ),
      isActive: activeTab === 'programming',
      points:
        translations.useCases.programming.points[language] ||
        translations.useCases.programming.points.en,
    },
    {
      id: 'trainer',
      title: getTextByLanguage(translations.useCases.trainer.title, language),
      description: getTextByLanguage(
        translations.useCases.trainer.description,
        language
      ),
      isActive: activeTab === 'trainer',
      points:
        translations.useCases.trainer.points[language] ||
        translations.useCases.trainer.points.en,
    },
    {
      id: 'community',
      title: getTextByLanguage(translations.useCases.community.title, language),
      description: getTextByLanguage(
        translations.useCases.community.description,
        language
      ),
      isActive: activeTab === 'community',
      points:
        translations.useCases.community.points[language] ||
        translations.useCases.community.points.en,
    },
    {
      id: 'revenue',
      title: getTextByLanguage(translations.useCases.revenue.title, language),
      description: getTextByLanguage(
        translations.useCases.revenue.description,
        language
      ),
      isActive: activeTab === 'revenue',
      points:
        translations.useCases.revenue.points[language] ||
        translations.useCases.revenue.points.en,
    },
  ];

  return (
    <section id="usecases" className="bg-[#0d1117] text-white py-20">
      <div className="container mx-auto px-4">
        <FadeUp className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {getTextByLanguage(translations.useCases.title, language)}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {getTextByLanguage(translations.useCases.subtitle, language)}
          </p>
        </FadeUp>

        {/* 탭 메뉴 */}
        <FadeUp className="max-w-4xl mx-auto mb-16">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
            {useCases.map((useCase) => (
              <button
                key={useCase.id}
                onClick={() => setActiveTab(useCase.id)}
                className={`px-6 py-3 rounded-full text-lg font-medium transition-colors ${
                  useCase.isActive
                    ? 'bg-gray-700 text-white'
                    : 'bg-transparent text-white hover:bg-gray-800'
                }`}
              >
                {useCase.title}
              </button>
            ))}
          </div>

          {/* 활성화된 탭 내용 */}
          {useCases
            .filter((u) => u.isActive)
            .map((useCase) => (
              <ScrollReveal key={useCase.id}>
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4">{useCase.title}</h3>
                  <p className="text-lg text-gray-300 mb-6">
                    {useCase.description}
                  </p>
                  <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
                    <ul className="space-y-4">
                      {useCase.points.map((point: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-fitculator-accent flex items-center justify-center mt-1 mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <p className="text-lg">{point}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            ))}
        </FadeUp>
      </div>
    </section>
  );
};

export default UseCases;
