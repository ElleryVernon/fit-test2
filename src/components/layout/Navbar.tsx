'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/utils/translations';
import { getTextByLanguage } from '@/utils/languageUtils';

const Navbar = () => {
  const { language, setLanguage } = useLanguage();

  // 언어 전환 함수
  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117] text-white py-4 border-b border-gray-800">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button className="md:hidden mr-4">
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
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold gradient-text">Fitculator</span>
          </Link>
          <div className="hidden md:flex ml-6 space-x-6">
            <Link href="#features" className="text-gray-300 hover:text-white">
              {getTextByLanguage(translations.navbar.features, language)}
            </Link>
            <Link href="#usecases" className="text-gray-300 hover:text-white">
              {getTextByLanguage(translations.navbar.useCases, language)}
            </Link>
            <Link href="#vision" className="text-gray-300 hover:text-white">
              {getTextByLanguage(translations.navbar.vision, language)}
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white">
              {getTextByLanguage(translations.navbar.pricing, language)}
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleLanguage}
            className="text-gray-300 hover:text-white px-3 py-1 rounded border border-gray-700 text-sm"
          >
            {language === 'ko' ? 'EN' : 'KO'}
          </button>
          <Link href="#" className="btn-secondary text-sm">
            {getTextByLanguage(translations.common.scheduleCall, language)}
          </Link>
          <Link href="#" className="btn-primary text-sm">
            {getTextByLanguage(translations.common.getDemo, language)}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
