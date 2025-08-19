'use client';

import { useState } from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { motion } from 'framer-motion';
import { FiCreditCard, FiCheck, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

interface StudioInfo {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  memberCount: number;
  programName: string;
}

export default function StudioPaymentPage() {
  const [step, setStep] = useState(1);
  const [studioInfo, setStudioInfo] = useState<StudioInfo>({
    name: '',
    email: '',
    phone: '',
    countryCode: '+82',
    memberCount: 10,
    programName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [emailError, setEmailError] = useState('');

  const { language, setLanguage } = useLanguage();

  // 언어 전환 함수
  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };
  
  const translations = {
    ko: {
      title: '스튜디오 프로그램 구독 신청',
      description: 'Fitculator의 강력한 트레이닝 프로그램 관리 시스템을 활용하여 회원들의 운동 성과를 극대화하세요.\n멤버당 월 10,000원의 합리적인 가격으로 시작하세요.',
      headerText: '스튜디오 프로그램 구독 신청',
      steps: {
        studioInfo: '스튜디오 정보',
        memberCount: '멤버 수 선택',
        checkout: '결제 확인'
      },
      form: {
        studioName: '스튜디오명',
        programName: '프로그램명',
        email: '이메일',
        phone: '연락처',
        memberCountLabel: '프로그램 참여 멤버 수',
        pricePerMember: '멤버당 가격',
        totalAmount: '총 결제 금액',
        nextStep: '다음 단계',
        previousStep: '이전 단계',
        paymentInfo: '결제 정보 확인',
        processing: '처리 중...',
        payNow: '결제하기',
        checkout: '결제 확인',
        minMaxMembers: '최소 1명 ~ 최대 200명'
      },
      placeholders: {
        studioName: '예: Fitculator Seoul',
        programName: '예: 12주 체력 향상 프로그램',
        email: '예: studio@fitculator.io',
        phone: '1012345678'
      },
      notices: [
        '• 멤버 수는 매월 변경 가능합니다',
        '• 결제 완료 후 즉시 서비스 이용 가능합니다'
      ]
    },
    en: {
      title: 'Studio Program Subscription',
      description: 'Maximize your members\' fitness results with Fitculator\'s powerful training program management system.\nStart with a reasonable price of 10,000 KRW per member per month.',
      headerText: 'Studio Program Subscription',
      steps: {
        studioInfo: 'Studio Info',
        memberCount: 'Member Count',
        checkout: 'Checkout'
      },
      form: {
        studioName: 'Studio Name',
        programName: 'Program Name',
        email: 'Email',
        phone: 'Phone',
        memberCountLabel: 'Number of Program Members',
        pricePerMember: 'Price per Member',
        totalAmount: 'Total Amount',
        nextStep: 'Next Step',
        previousStep: 'Previous Step',
        paymentInfo: 'Payment Information',
        processing: 'Processing...',
        payNow: 'Pay Now',
        checkout: 'Checkout',
        minMaxMembers: 'Min 1 ~ Max 200 members'
      },
      placeholders: {
        studioName: 'e.g., Fitculator Seoul',
        programName: 'e.g., 12-week Fitness Program',
        email: 'e.g., studio@fitculator.io',
        phone: '1012345678'
      },
      notices: [
        '• Member count can be changed monthly',
        '• Service available immediately after payment'
      ]
    }
  };
  
  const t = translations[language as keyof typeof translations];
  
  const countryCodes = [
    { code: '+82', country: '🇰🇷 대한민국', flag: '🇰🇷' },
    { code: '+1', country: '🇺🇸 미국', flag: '🇺🇸' },
    { code: '+81', country: '🇯🇵 일본', flag: '🇯🇵' },
    { code: '+86', country: '🇨🇳 중국', flag: '🇨🇳' },
    { code: '+44', country: '🇬🇧 영국', flag: '🇬🇧' },
    { code: '+49', country: '🇩🇪 독일', flag: '🇩🇪' },
    { code: '+33', country: '🇫🇷 프랑스', flag: '🇫🇷' },
    { code: '+61', country: '🇦🇺 호주', flag: '🇦🇺' },
    { code: '+65', country: '🇸🇬 싱가포르', flag: '🇸🇬' },
  ];

  const pricePerMember = 10000;
  const totalAmount = studioInfo.memberCount * pricePerMember;

  // Toss Payments용 전화번호 포맷팅 (한국 번호는 01012345678 형식)
  const formatPhoneForToss = (countryCode: string, phone: string) => {
    if (countryCode === '+82') {
      // 한국 번호: 10자리를 01012345678 형식으로 변환
      return '0' + phone;
    }
    // 다른 국가: 국가코드 + 전화번호
    return countryCode.replace('+', '') + phone;
  };

  // DB 저장용 전화번호 포맷팅 (국제 표준 형식)
  const formatPhoneForDB = (countryCode: string, phone: string) => {
    return countryCode + phone;
  };

  // 이메일 포맷 검증
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 연락처 숫자만 입력 허용 (+82인 경우 0 제거)
  const handlePhoneChange = (value: string) => {
    const numbersOnly = value.replace(/[^0-9]/g, '');
    
    // +82인 경우 0으로 시작하면 제거
    let formattedPhone = numbersOnly;
    if (studioInfo.countryCode === '+82' && numbersOnly.startsWith('0')) {
      formattedPhone = numbersOnly.substring(1);
    }
    
    setStudioInfo({ ...studioInfo, phone: formattedPhone });
  };

  // 이메일 변경 핸들러
  const handleEmailChange = (value: string) => {
    setStudioInfo({ ...studioInfo, email: value });
    if (value && !validateEmail(value)) {
      setEmailError(language === 'ko' ? '올바른 이메일 형식을 입력해주세요' : 'Please enter a valid email format');
    } else {
      setEmailError('');
    }
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      // 토스페이먼츠 SDK 로드
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      
      // 주문 ID 생성
      const orderId = `studio_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      const orderName = `${studioInfo.name} - ${studioInfo.programName} (${studioInfo.memberCount}명)`;
      
      // 결제 요청
      await tossPayments.requestPayment('카드', {
        amount: totalAmount,
        orderId,
        orderName,
        successUrl: `${window.location.origin}/studio/payment/success?studioName=${encodeURIComponent(studioInfo.name)}&programName=${encodeURIComponent(studioInfo.programName)}&email=${encodeURIComponent(studioInfo.email)}&phone=${encodeURIComponent(formatPhoneForDB(studioInfo.countryCode, studioInfo.phone))}&memberCount=${studioInfo.memberCount}`,
        failUrl: `${window.location.origin}/studio/payment/fail`,
        customerEmail: studioInfo.email,
        customerName: studioInfo.name,
        customerMobilePhone: formatPhoneForToss(studioInfo.countryCode, studioInfo.phone),
      });
    } catch (error) {
      console.error('결제 요청 오류:', error);
      alert('결제 요청 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Header with Logo */}
      <nav className="top-0 left-0 right-0 z-50 bg-[#0d1117] text-white py-6 w-full overflow-x-hidden">
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
            {/* 언어 선택 버튼 */}
            <button
              onClick={toggleLanguage}
              className="flex text-gray-300 hover:text-white px-2 md:px-3 py-1 text-sm items-center flex-shrink-0"
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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-2 md:pt-6 pb-12 md:pb-20 bg-[#0d1117] relative overflow-hidden">
        <div className="container mt-6 md:mt-4 mx-auto px-4 relative z-10 max-w-3xl">
        {/* Page Description */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">
            {t.title}
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto whitespace-pre-line">
            {t.description}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-2 md:space-x-4">
            {[
              { num: 1, label: t.steps.studioInfo },
              { num: 2, label: t.steps.memberCount },
              { num: 3, label: t.steps.checkout }
            ].map((item, idx) => (
              <div key={item.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-medium mb-2 text-sm md:text-base ${
                      step >= item.num
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-gray-800 text-gray-500 border border-gray-700'
                    }`}
                  >
                    {step > item.num ? <FiCheck /> : item.num}
                  </div>
                  <span className={`text-xs text-center whitespace-nowrap ${
                    step >= item.num ? 'text-cyan-400' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`w-12 md:w-20 h-1 mt-[-16px] md:mt-[-20px] ${
                      step > item.num 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                        : 'bg-gray-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Studio Info */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#161b22] border border-gray-800 rounded-2xl p-8 md:w-1/2 mx-auto"
          >
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.form.studioName} *
                </label>
                <input
                  type="text"
                  value={studioInfo.name}
                  onChange={(e) => setStudioInfo({ ...studioInfo, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0d1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder={t.placeholders.studioName}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.form.programName} *
                </label>
                <input
                  type="text"
                  value={studioInfo.programName}
                  onChange={(e) => setStudioInfo({ ...studioInfo, programName: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0d1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder={t.placeholders.programName}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.form.email} *
                </label>
                <input
                  type="email"
                  value={studioInfo.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`w-full px-4 py-3 bg-[#0d1117] border rounded-lg text-white focus:outline-none focus:ring-2 focus:border-transparent ${
                    emailError 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-700 focus:ring-cyan-500'
                  }`}
                  placeholder={t.placeholders.email}
                />
                {emailError && (
                  <p className="text-red-400 text-sm mt-1">{emailError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.form.phone} *
                </label>
                <div className="flex space-x-2">
                  <select
                    value={studioInfo.countryCode}
                    onChange={(e) => {
                      const newCountryCode = e.target.value;
                      let newPhone = studioInfo.phone;
                      
                      // 기존 +82에서 다른 국가로 변경시 앞에 0 추가
                      if (studioInfo.countryCode === '+82' && newCountryCode !== '+82') {
                        newPhone = '0' + studioInfo.phone;
                      }
                      // 다른 국가에서 +82로 변경시 맨 앞 0 제거
                      else if (studioInfo.countryCode !== '+82' && newCountryCode === '+82') {
                        newPhone = studioInfo.phone.startsWith('0') ? studioInfo.phone.substring(1) : studioInfo.phone;
                      }
                      
                      setStudioInfo({ ...studioInfo, countryCode: newCountryCode, phone: newPhone });
                    }}
                    className="w-20 md:w-auto px-2 md:px-3 py-3 bg-[#0d1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={studioInfo.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="md:flex-1 px-4 py-3 bg-[#0d1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    style={{ width: 'calc(100% - 5.5rem)' }}
                    placeholder={t.placeholders.phone}
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!studioInfo.name || !studioInfo.email || !studioInfo.phone || !studioInfo.programName || !!emailError}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {t.form.nextStep}
                <FiArrowRight className="ml-2" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Member Count */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#161b22] border border-gray-800 rounded-2xl p-8 md:w-1/2 mx-auto"
          >
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-300 mb-4">
                {t.form.memberCountLabel}
              </label>
              
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setStudioInfo({ ...studioInfo, memberCount: Math.max(1, studioInfo.memberCount - 1) })}
                  className="w-12 h-12 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={studioInfo.memberCount}
                    onChange={(e) => {
                      const value = Math.max(1, Math.min(200, Number(e.target.value)));
                      setStudioInfo({ ...studioInfo, memberCount: value });
                    }}
                    className="w-full px-4 pr-12 py-3 bg-[#0d1117] border border-gray-700 rounded-lg text-white text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl font-medium pointer-events-none">
                    {language === 'ko' ? '명' : 'people'}
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={() => setStudioInfo({ ...studioInfo, memberCount: Math.min(200, studioInfo.memberCount + 1) })}
                  className="w-12 h-12 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="text-center text-sm text-gray-400 mt-2">
                {t.form.minMaxMembers}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-cyan-500/30 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300">{t.form.pricePerMember}</span>
                <span className="font-medium">₩{pricePerMember.toLocaleString()}/{language === 'ko' ? '월' : 'month'}</span>
              </div>
              <div className="flex items-center justify-between text-xl font-bold">
                <span className="text-white">{t.form.totalAmount}</span>
                <span className="text-cyan-400">₩{totalAmount.toLocaleString()}/{language === 'ko' ? '월' : 'month'}</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-800 text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors border border-gray-700 flex items-center justify-center"
              >
                <FiArrowLeft className="mr-2" />
                {t.form.previousStep}
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center"
              >
                {t.form.checkout}
                <FiArrowRight className="ml-2" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Payment Confirmation */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#161b22] border border-gray-800 rounded-2xl p-8 md:w-1/2 mx-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              {t.form.paymentInfo}
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">{t.form.studioName}</span>
                <span className="font-medium">{studioInfo.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">{t.form.programName}</span>
                <span className="font-medium">{studioInfo.programName}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">{t.form.email}</span>
                <span className="font-medium">{studioInfo.email}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">{t.form.phone}</span>
                <span className="font-medium">{formatPhoneForDB(studioInfo.countryCode, studioInfo.phone)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">{t.form.memberCountLabel}</span>
                <span className="font-medium">{studioInfo.memberCount}{language === 'ko' ? '명' : ' people'}</span>
              </div>
              <div className="flex justify-between py-3 text-xl font-bold">
                <span>{t.form.totalAmount}</span>
                <span className="text-cyan-400">₩{totalAmount.toLocaleString()}/{language === 'ko' ? '월' : 'month'}</span>
              </div>
            </div>

            <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-400">
                {t.notices.map((notice, idx) => (
                  <p key={idx}>{notice}</p>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-800 text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors border border-gray-700 flex items-center justify-center"
              >
                <FiArrowLeft className="mr-2" />
                {t.form.previousStep}
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  t.form.processing
                ) : (
                  <>
                    <FiCreditCard className="mr-2" />
                    {t.form.payNow}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
}