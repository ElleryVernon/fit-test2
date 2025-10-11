'use client';

import React from 'react';
import FadeUp from '@/components/ui/animations/FadeUp';
import ScrollReveal from '@/components/ui/animations/ScrollReveal';
import { useLanguage } from '@/hooks';
import { translations } from '@/utils/translations';
import { getTextByLanguage } from '@/utils/languageUtils';

const Challenge = () => {
  const { language } = useLanguage();
  return (
    <section className="py-20 bg-[#0d1117]">
      <div className="container mx-auto px-4">
        <FadeUp className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {getTextByLanguage(translations.challenge.title, language)}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {getTextByLanguage(translations.challenge.subtitle, language)}
          </p>
        </FadeUp>

        <div className="flex justify-center">
          {/* 텍스트 부분 */}
          <ScrollReveal direction="right">
            <div className="space-y-6 max-w-5xl mx-auto">
              <ul className="space-y-4 max-w-2xl mx-auto pl-16">
                {translations.challenge.points[
                  language === 'ko' ? 'ko' : 'en'
                ].map((point, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-fitculator-coral flex items-center justify-center mt-1 mr-3">
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

              <p className="mt-16 text-3xl font-bold text-[#0066cc] text-center">
                {language === 'ko'
                  ? '운동 데이터를 가장 강력한 회원 유지 도구로 전환할 수 있다면 어떨까요?'
                  : 'What if you could turn exercise data into your most powerful retention tool?'}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Challenge;
