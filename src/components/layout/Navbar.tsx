'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

// 햄버거 메뉴 아이콘 스타일
const hamburgerStyle = `
  .hamburger-icon {
    width: 24px;
    height: 24px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .hamburger-icon .line {
    display: block;
    height: 2px;
    width: 100%;
    background-color: white;
    position: absolute;
    left: 0;
    transition: all 0.3s ease-in-out;
  }

  .hamburger-icon .line-1 {
    top: 4px;
  }

  .hamburger-icon .line-2 {
    top: 12px;
    transition: all 0.2s ease-in-out;
  }

  .hamburger-icon .line-3 {
    top: 20px;
  }

  .hamburger-icon.open .line-1 {
    transform: translateY(8px) rotate(45deg);
  }

  .hamburger-icon.open .line-2 {
    opacity: 0;
  }

  .hamburger-icon.open .line-3 {
    transform: translateY(-8px) rotate(-45deg);
  }
`;

const Navbar = () => {
  const { language, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 언어 전환 함수
  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };
  return (
    <nav className="top-0 left-0 right-0 z-50 bg-[#0d1117] text-white py-4 w-full overflow-x-hidden">
      <style jsx>{hamburgerStyle}</style>
      <div className="container mx-auto px-4 sm:px-6 w-full max-w-full md:max-w-5xl flex items-center justify-between min-w-0">
        <div className="flex items-center min-w-0 flex-shrink">
          <Link href="/" className="flex pl-2 items-center flex-shrink-0">
            <Image
              src="/fitculator_logo_wh.svg"
              alt="Fitculator Logo"
              width={160}
              height={20}
              className="object-contain max-w-[140px] sm:max-w-[160px]"
            />
          </Link>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 min-w-0">
          <div className="hidden md:flex ml-2 md:ml-4 space-x-3 md:space-x-4">
            <Link
              href="#features"
              className="text-gray-300 hover:text-white whitespace-nowrap text-sm"
            >
              {language === 'ko' ? '가치 제안' : 'Value Proposition'}
            </Link>
            <Link
              href="#visualdemo"
              className="text-gray-300 hover:text-white whitespace-nowrap text-sm"
            >
              {language === 'ko' ? '비주얼 데모' : 'Visual Demo'}
            </Link>
          </div>
          {/* PC 버전 - 지구 아이콘으로 언어 선택 */}
          <button
            onClick={toggleLanguage}
            className="hidden md:flex text-gray-300 hover:text-white px-2 md:px-3 py-1 text-sm items-center flex-shrink-0"
            aria-label="언어 변경"
          >
            <Image
              src="/globe.svg"
              alt="Language"
              width={16}
              height={16}
              className="mr-1 md:mr-2 flex-shrink-0"
            />
            {language === 'ko' ? 'EN' : 'KO'}
          </button>
          <Link
            href="/request-demo"
            className="hidden md:block btn-primary text-xs sm:text-sm text-bold px-2 py-1 rounded-none whitespace-nowrap flex-shrink-0"
          >
            {language === 'ko' ? '데모 요청' : 'BOOK A DEMO'}
          </Link>
          {/* 모바일 햄버거 메뉴 버튼 */}
          <button
            className="md:hidden p-1 flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            <div className="w-[30px] h-[30px] relative flex items-center justify-center">
              <div className={`hamburger-icon ${mobileMenuOpen ? 'open' : ''}`}>
                <span className="line line-1"></span>
                <span className="line line-2"></span>
                <span className="line line-3"></span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d1117] border-t border-gray-800 w-full">
          <div className="container mx-auto px-4 py-3 space-y-3 max-w-full">
            <Link
              href="#features"
              className="block text-gray-300 hover:text-white py-2 rounded-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              {language === 'ko' ? '가치 제안' : 'Value Proposition'}
            </Link>
            <Link
              href="#visualdemo"
              className="block text-gray-300 hover:text-white py-2 rounded-none"
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
              className="flex items-center text-gray-300 hover:text-white py-2 w-full rounded-none"
            >
              <Image
                src="/globe.svg"
                alt="Language"
                width={16}
                height={16}
                className="mr-2 flex-shrink-0"
              />
              <span>{language === 'ko' ? 'English' : '한국어'}</span>
            </button>
            {/* 모바일 버전 - 햄버거 메뉴 안에 데모 요청 버튼 */}
            <Link
              href="/request-demo"
              className="block text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-2 px-3 mt-2 text-center rounded-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              {language === 'ko' ? '데모 요청' : 'BOOK A DEMO'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
