/**
 * 다국어 관련 타입 정의
 */

export type LanguageKey = "en" | "ko";

export interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

export type TextByLanguage = {
  [key in LanguageKey]: string;
};

export type PointsByLanguage = {
  [key in LanguageKey]: string[];
};
