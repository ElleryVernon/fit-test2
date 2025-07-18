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
          <h3 className="text-xl md:text-3xl font-semibold mb-8 text-gray-300">
            {getTextByLanguage(translations.hero.subtitle, language)}
          </h3>

          {/* 서브 헤드라인 */}
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            {getTextByLanguage(translations.hero.description, language)}
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/request-demo"
              className="btn-primary text-lg !px-8 !py-4"
            >
              {getTextByLanguage(translations.hero.cta, language)}
            </Link>
          </div>

          {/* 파트너십 */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <p className="text-gray-300">Officially partnered with</p>
            <Image
              src="/Garmin Logo Without Delta-white-low-res.png"
              alt="Garmin Logo"
              width={100}
              height={30}
              className="object-contain"
            />
            <Image
              src="/Amazfit_logo_white.png"
              alt="Amazfit Logo"
              width={90}
              height={27}
              className="object-contain"
            />
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default Hero;
