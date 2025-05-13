'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { detectBrowserLanguage } from '@/utils/languageUtils';
import Cookies from 'js-cookie';

// 언어 컨텍스트 타입 정의
type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

// 기본값으로 컨텍스트 생성
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
});

// 컨텍스트 훅
export const useLanguage = () => useContext(LanguageContext);

// 쿠키 이름 상수
export const LANGUAGE_COOKIE_NAME = 'NEXT_LOCALE';

// 컨텍스트 프로바이더 컴포넌트
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState('en');

  // 언어 설정 함수 (쿠키에도 저장)
  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    Cookies.set(LANGUAGE_COOKIE_NAME, lang, { expires: 365 });

    // HTML lang 속성 업데이트 (클라이언트 사이드에서)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  // 컴포넌트 마운트 시 쿠키에서 언어 설정 확인 또는 브라우저 언어 감지
  useEffect(() => {
    const cookieLang = Cookies.get(LANGUAGE_COOKIE_NAME);
    if (cookieLang) {
      setLanguageState(cookieLang);
      // HTML lang 속성 업데이트
      document.documentElement.lang = cookieLang;
    } else {
      const detectedLang = detectBrowserLanguage();
      setLanguage(detectedLang);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
