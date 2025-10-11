'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks';

interface NewsletterFormProps {
  origin: string;
}

export default function NewsletterForm({ origin }: NewsletterFormProps) {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [referrer, setReferrer] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // URL 파라미터에서 referrer 정보 가져오기
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setReferrer(params.get('ref') || params.get('utm_source') || 'direct');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage(
        language === 'ko' ? '이메일을 입력해주세요' : 'Please enter your email'
      );
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, referrer, origin, honeypot }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage(
          language === 'ko'
            ? '구독해주셔서 감사합니다!'
            : 'Thanks for subscribing!'
        );
        setEmail('');
      } else {
        setMessage(
          data.error ||
            (language === 'ko' ? '구독 실패' : 'Subscription failed')
        );
      }
    } catch {
      setMessage(language === 'ko' ? '네트워크 오류' : 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow relative">
          <input
            type="email"
            placeholder={
              language === 'ko' ? '이메일 주소' : 'Your email address'
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || isSuccess}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-fitculator-secondary"
          />
          {/* Honeypot 필드 (숨김) - 스팸 방지 */}
          <input
            type="text"
            name="nickname"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: 'none' }}
            autoComplete="off"
            tabIndex={-1}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || isSuccess}
          className={`btn-primary ${isLoading ? 'opacity-70' : ''} ${
            isSuccess ? 'bg-green-600 hover:bg-green-700' : ''
          }`}
        >
          {isLoading
            ? language === 'ko'
              ? '처리 중...'
              : 'Processing...'
            : isSuccess
            ? language === 'ko'
              ? '구독 완료!'
              : 'Subscribed!'
            : language === 'ko'
            ? '구독하기'
            : 'Subscribe'}
        </button>
      </div>
      {message && (
        <p
          className={`mt-2 text-sm ${
            isSuccess ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
