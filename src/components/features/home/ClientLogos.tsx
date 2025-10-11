'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/hooks';
import FadeUp from '@/components/ui/animations/FadeUp';

const ClientLogos = () => {
  const { language } = useLanguage();

  return (
    <section id="clients" className="bg-white py-12 md:py-20 text-center">
      <div className="container mx-auto px-4">
        <FadeUp className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {language === 'ko'
              ? '최고 성과를 내는 스튜디오들이 신뢰하는 서비스'
              : 'Trusted by top-performing studios'}
          </h2>
          <p className="text-gray-600 text-md font-semibold md:text-xl mb-6">
            {language === 'ko'
              ? '글로벌 프랜차이즈부터 엘리트 독립 스튜디오까지, Fitculator는 운동선수가 운영하는 피트니스 비즈니스를 지원합니다.'
              : 'From global franchises to elite independents, Fitculator powers athlete-run fitness businesses.'}
          </p>
        </FadeUp>

        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
          <Image
            src="/assets/images/customers/F45_logo.png"
            alt="F45"
            width={160}
            height={64}
            className="h-10 md:h-16 w-auto"
          />
          <Image
            src="/assets/images/customers/noeasyday_logo.png"
            alt="NED"
            width={160}
            height={64}
            className="h-10 md:h-16 w-auto"
          />
          <Image
            src="/assets/images/customers/roxflow_logo.png"
            alt="Roxflow"
            width={128}
            height={32}
            className="h-5 md:h-8 w-auto"
          />
          <Image
            src="/assets/images/customers/xon_training_logo.png"
            alt="XON"
            width={160}
            height={64}
            className="h-10 md:h-16 w-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
