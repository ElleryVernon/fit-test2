/**
 * 데모 요청 폼 검증 스키마
 */

export interface DemoRequestData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
}

export const validateDemoRequest = (
  data: DemoRequestData
): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};

  // 이름 검증
  if (!data.name || data.name.trim().length === 0) {
    errors.name = "이름은 필수 항목입니다.";
  }

  // 이메일 검증
  if (!data.email || data.email.trim().length === 0) {
    errors.email = "이메일은 필수 항목입니다.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "유효한 이메일 주소를 입력해주세요.";
  }

  // 전화번호 검증 (선택사항이지만 입력된 경우)
  if (data.phone && data.phone.trim().length > 0) {
    const phoneRegex = /^[0-9\s\-+()]+$/;
    if (!phoneRegex.test(data.phone)) {
      errors.phone = "유효한 전화번호를 입력해주세요.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
