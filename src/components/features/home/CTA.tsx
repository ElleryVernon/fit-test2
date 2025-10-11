"use client";

import React from "react";
import Link from "next/link";
import FadeUp from "@/components/ui/animations/FadeUp";
import Shimmer from "@/components/ui/animations/Shimmer";
import { useLanguage } from "@/hooks";
import { translations } from "@/utils/translations";

const CTA = () => {
  const { language } = useLanguage();
  return (
    <section className="bg-[#0d1117] text-white py-20 relative overflow-hidden">
      {/* 배경 그래디언트 효과 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-fitculator-primary opacity-10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-fitculator-secondary opacity-10 blur-[150px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <FadeUp className="text-center max-w-4xl mx-auto">
          <h2
            className={`font-bold mb-6 ${
              language === "ko"
                ? "text-2xl md:text-4xl"
                : "text-3xl md:text-5xl"
            }`}
          >
            {language === "ko"
              ? translations.cta.title.ko
              : translations.cta.title.en}
          </h2>
          <p
            className={`text-gray-300 mb-10 ${
              language === "ko" ? "text-lg md:text-xl" : "text-xl md:text-2xl"
            }`}
          >
            {language === "ko"
              ? translations.cta.subtitle.ko
              : translations.cta.subtitle.en}
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Shimmer>
              <Link
                href="/request-demo"
                className="btn-primary text-lg px-10 py-5 text-center inline-block"
              >
                {language === "ko"
                  ? translations.cta.buttonText.ko
                  : translations.cta.buttonText.en}
              </Link>
            </Shimmer>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default CTA;
