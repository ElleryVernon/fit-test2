'use client';

import React from 'react';
import FadeUp from '../animations/FadeUp';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/utils/translations';
import { getTextByLanguage } from '@/utils/languageUtils';

const Hero = () => {
  const { language } = useLanguage();
  return (
    <section className="pt-6 md:pt-12 md:pb-20 bg-[#0d1117] relative overflow-hidden">
      {/* 배경 그래디언트 효과 */}
      <div className="absolute top-0 left-0 max-w-full h-full">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-fitculator-primary opacity-10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-fitculator-secondary opacity-10 blur-[100px] rounded-full"></div>
      </div>

      <div className="container mt-8 md:mt-18 mx-auto px-4 relative z-10">
        <FadeUp className="text-center max-w-4xl mx-auto">
          <h3 className="text-md md:text-xl font-normal mb-6 text-gray-200">
            {getTextByLanguage(translations.hero.subtitle, language)}
          </h3>

          {/* 메인 헤드라인 */}
          <h2 className="text-4xl md:text-7xl font-bold mb-6">
            {language === 'ko' ? (
              <>
                {getTextByLanguage(translations.hero.title, language).split(
                  ','
                )[0] + ','}
                <br />
                <span className="inline-block mt-2">
                  {
                    getTextByLanguage(translations.hero.title, language).split(
                      ','
                    )[1]
                  }
                </span>
              </>
            ) : (
              getTextByLanguage(translations.hero.title, language)
            )}
          </h2>

          {/* 서브 헤드라인 */}
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            {getTextByLanguage(translations.hero.description, language)}
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/request-demo"
              className="btn-primary text-lg !px-8 !py-4 w-1/2 mx-auto sm:w-auto"
            >
              {getTextByLanguage(translations.hero.cta, language)}
            </Link>
          </div>

          {/* 파트너십 */}
          <div className="mt-8 flex flex-col items-center gap-3 md:flex-row md:items-baseline md:justify-center">
            <p className="text-gray-300">Officially partnered with</p>
            <div className="flex items-end gap-3">
              <Image
                src="/Garmin Logo Without Delta-white-low-res.png"
                alt="Garmin Logo"
                width={120}
                height={27}
                className="object-contain"
              />
              <Image
                src="/Amazfit_logo_white.png"
                alt="Amazfit Logo"
                width={110}
                height={20}
                className="object-contain"
              />
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default Hero;
