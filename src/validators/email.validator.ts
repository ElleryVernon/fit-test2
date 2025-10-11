/**
 * 이메일 관련 검증
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateEmailWithMessage = (
  email: string
): { isValid: boolean; message?: string } => {
  if (!email || email.trim().length === 0) {
    return {
      isValid: false,
      message: "이메일은 필수 항목입니다.",
    };
  }

  if (!validateEmail(email)) {
    return {
      isValid: false,
      message: "유효한 이메일 주소를 입력해주세요.",
    };
  }

  return { isValid: true };
};
