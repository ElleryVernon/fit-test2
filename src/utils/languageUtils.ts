// 브라우저 언어 감지 함수
export const detectBrowserLanguage = (): string => {
  if (typeof window === 'undefined') {
    return 'en'; // 서버 사이드 렌더링 시 기본값
  }

  // navigator.userLanguage는 IE에서 사용되던 속성으로, 타입 정의를 명시적으로 처리
  const browserLang =
    navigator.language ||
    (navigator as Navigator & { userLanguage?: string }).userLanguage ||
    '';

  // 한국어인 경우에만 'ko' 반환, 그 외에는 'en' 반환
  return browserLang.startsWith('ko') ? 'ko' : 'en';
};

// 언어 코드에 따라 텍스트 반환
export const getTextByLanguage = (
  texts: { [key: string]: string },
  lang: string
): string => {
  return texts[lang] || texts['en']; // 해당 언어가 없으면 영어 반환
};
