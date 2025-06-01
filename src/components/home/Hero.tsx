'use client';

import React from 'react';
import FadeUp from '../animations/FadeUp';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

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
            Build Smarter. Train Harder.
          </h2>
          <h3 className="text-xl md:text-3xl font-semibold mb-8 text-gray-300">
            The performance platform for athlete-led studios
          </h3>

          {/* 서브 헤드라인 */}
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            We transform training logs into programs, fans into customers, and
            studios into automated systems — helping athlete-coaches scale their
            business without burning out.
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://tally.so/r/wgpB11"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-lg !px-8 !py-4"
            >
              {language === 'ko' ? '시작하기' : 'Get Started'}
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default Hero;
