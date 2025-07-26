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
    <section className="pt-2 md:pt-12 md:pb-20 bg-[#0d1117] relative overflow-hidden">
      <div className="container mt-6 md:mt-18 mx-auto px-4 relative z-10 max-w-full">
        <FadeUp className="text-center mx-auto max-w-full">
          <h3 className="text-sm md:text-xl font-medium mb-6 text-gray-400">
            {getTextByLanguage(translations.hero.subtitle, language)}
          </h3>

          {/* 메인 헤드라인 */}
          <h2 className="text-4xl md:text-7xl font-bold mb-6 break-keep word-break-keep-all">
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
              <>
                <span className="block md:inline">
                  {getTextByLanguage(translations.hero.title, language).split(
                    ','
                  )[0] + ','}
                </span>
                <span className="block md:inline mt-2 md:mt-0">
                  {
                    getTextByLanguage(translations.hero.title, language).split(
                      ','
                    )[1]
                  }
                </span>
              </>
            )}
          </h2>

          {/* 서브 헤드라인 */}
          <p className="text-md md:text-xl text-gray-300 mb-10 mx-auto max-w-3xl break-keep word-break-keep-all">
            {getTextByLanguage(translations.hero.description, language)}
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/request-demo"
              className="btn-primary text-lg !px-8 !py-4 w-3/5 max-w-xs mx-auto sm:w-auto"
            >
              {getTextByLanguage(translations.hero.cta, language)}
            </Link>
          </div>

          {/* 파트너십 */}
          <div className="mt-8 flex flex-col items-center gap-3 md:flex-row md:items-baseline md:justify-center max-w-full">
            <p className="text-gray-300 text-center">
              Officially partnered with
            </p>
            <div className="flex items-end gap-3 justify-center flex-wrap">
              <Image
                src="/Garmin Logo Without Delta-white-low-res.png"
                alt="Garmin Logo"
                width={120}
                height={27}
                className="object-contain max-w-[100px] sm:max-w-[120px]"
              />
              <Image
                src="/Amazfit_logo_white.png"
                alt="Amazfit Logo"
                width={110}
                height={20}
                className="object-contain max-w-[90px] sm:max-w-[110px]"
              />
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default Hero;
