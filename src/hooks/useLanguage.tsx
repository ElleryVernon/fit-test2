"use client";

/**
 * 다국어 관련 커스텀 훅
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { detectBrowserLanguage } from "@/utils/languageUtils";
import { LANGUAGE_COOKIE_NAME } from "@/constants";
import type { LanguageContextType } from "@/types";

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});

/**
 * 다국어 컨텍스트 제공자
 */
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState("en");

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    Cookies.set(LANGUAGE_COOKIE_NAME, lang, { expires: 365 });

    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    const cookieLang = Cookies.get(LANGUAGE_COOKIE_NAME);
    if (cookieLang) {
      setLanguageState(cookieLang);
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

/**
 * 현재 언어 및 언어 변경 메서드를 사용하는 커스텀 훅
 */
export const useLanguage = () => useContext(LanguageContext);
