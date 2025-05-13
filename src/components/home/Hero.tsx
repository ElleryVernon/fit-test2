'use client';

import React from 'react';
import FadeUp from '../animations/FadeUp';
// import Shimmer from '../animations/Shimmer';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/utils/translations';
import { getTextByLanguage } from '@/utils/languageUtils';

const Hero = () => {
  const { language } = useLanguage();
  return (
    <section className="pt-32 pb-20 bg-[#0d1117] relative overflow-hidden">
      {/* 배경 그래디언트 효과 */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-fitculator-primary opacity-10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-fitculator-secondary opacity-10 blur-[100px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <FadeUp className="text-center max-w-4xl mx-auto">
          {/* 로고 */}
          <div className="mb-8 flex justify-center">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text">
              Fitculator
            </h1>
          </div>

          {/* 메인 헤드라인 */}
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {getTextByLanguage(translations.hero.title, language)}
          </h2>

          {/* 서브 헤드라인 */}
          <p className="text-xl md:text-2xl text-gray-300 mb-10">
            {getTextByLanguage(translations.hero.subtitle, language)}
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <Shimmer> */}
            <Link href="#" className="btn-primary text-lg px-8 py-4">
              {getTextByLanguage(translations.common.getDemo, language)}
            </Link>
            {/* </Shimmer> */}
            <Link href="#" className="btn-secondary text-lg px-8 py-4">
              {getTextByLanguage(translations.common.scheduleCall, language)}
            </Link>
          </div>
        </FadeUp>

        {/* 히어로 이미지 */}
        {/* <FadeUp delay={0.2} className="mt-16 max-w-5xl mx-auto">
          <Shimmer>
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-800 p-4">
              <div className="aspect-video bg-gray-800 rounded-md flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-fitculator-primary to-fitculator-secondary flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-white"
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
                  <p className="text-xl text-gray-300">
                    {getTextByLanguage(translations.hero.imageAlt, language)}
                  </p>
                </div>
              </div>
            </div>
          </Shimmer>
        </FadeUp> */}
      </div>
    </section>
  );
};

export default Hero;
