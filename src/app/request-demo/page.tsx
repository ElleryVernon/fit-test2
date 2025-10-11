"use client";

import React from "react";
import Link from "next/link";
import DemoRequestForm from "@/components/features/demo/DemoRequestForm";
import { useLanguage } from "@/hooks";

export default function RequestDemoPage() {
  const { language } = useLanguage();

  return (
    <main className="bg-[#0d1117] min-h-screen text-white">
      {/* 네비게이션 바 아래 여백 */}
      <div className="h-8 md:h-20"></div>

      <div className="container mx-auto px-4 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* 뒤로 가기 링크 */}
          <Link
            href="/"
            className="text-gray-400 hover:text-white flex items-center mb-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {language === "ko" ? "홈으로 돌아가기" : "Back to Home"}
          </Link>

          {/* 페이지 제목 */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            {language === "ko" ? "데모 요청하기" : "Request a Demo"}
          </h1>

          {/* 페이지 설명 */}
          <p className="text-lg text-gray-300 mb-12 text-center max-w-2xl mx-auto">
            {language === "ko"
              ? "Fitculator가 어떻게 여러분의 비즈니스를 성장시킬 수 있는지 알아보세요. 아래 양식을 작성하시면 곧 연락드리겠습니다."
              : "Discover how Fitculator can help grow your business. Fill out the form below and we'll get in touch with you soon."}
          </p>

          {/* 데모 요청 폼 */}
          <DemoRequestForm origin="demo-page" />
        </div>
      </div>
    </main>
  );
}
