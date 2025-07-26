'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

const Navbar = () => {
  const { language, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 언어 전환 함수
  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };
  return (
    <nav className="top-0 left-0 right-0 z-50 bg-[#0d1117] text-white py-4">
      <div className="container mx-auto px-4 sm:px-6 max-w-full md:max-w-5xl flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center flex-shrink-0">
            <span className="text-2xl pl-1 sm:text-2xl md:text-4xl font-bold gradient-text">
              Fitculator
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="hidden md:flex ml-3 md:ml-4 space-x-4">
            <Link href="#features" className="text-gray-300 hover:text-white">
              {language === 'ko' ? '가치 제안' : 'Value Proposition'}
            </Link>
            <Link href="#visualdemo" className="text-gray-300 hover:text-white">
              {language === 'ko' ? '비주얼 데모' : 'Visual Demo'}
            </Link>
          </div>
          {/* PC 버전 - 지구 아이콘으로 언어 선택 */}
          <button
            onClick={toggleLanguage}
            className="hidden md:flex text-gray-300 hover:text-white px-3 py-1 text-sm items-center"
            aria-label="언어 변경"
          >
            <Image
              src="/globe.svg"
              alt="Language"
              width={16}
              height={16}
              className="mr-2"
            />
            {language === 'ko' ? 'EN' : 'KO'}
          </button>
          <Link
            href="/request-demo"
            className="btn-primary text-sm md:text-sm text-bold px-2 py-1 rounded-none whitespace-nowrap"
          >
            {language === 'ko' ? '데모 요청' : 'BOOK A DEMO'}
          </Link>
          {/* 모바일 햄버거 메뉴 버튼 */}
          <button
            className="md:hidden p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d1117] border-t border-gray-800">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <Link
              href="#features"
              className="block text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {language === 'ko' ? '가치 제안' : 'Value Proposition'}
            </Link>
            <Link
              href="#visualdemo"
              className="block text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {language === 'ko' ? '비주얼 데모' : 'Visual Demo'}
            </Link>
            {/* 모바일 버전 - 햄버거 메뉴 안에 언어 선택 */}
            <button
              onClick={() => {
                toggleLanguage();
                setMobileMenuOpen(false);
              }}
              className="flex items-center text-gray-300 hover:text-white py-2 w-full"
            >
              <Image
                src="/globe.svg"
                alt="Language"
                width={16}
                height={16}
                className="mr-2"
              />
              <span>{language === 'ko' ? 'English' : '한국어'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
