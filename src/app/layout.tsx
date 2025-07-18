import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { LanguageProvider } from '@/contexts/LanguageContext';
import './globals.css';
import { GoogleTagManager } from '@next/third-parties/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Google Tag Manager ID
const GTM_ID = process.env.GOOGLE_TAG_MANAGER_ID as string;

// 메타데이터는 서버 컴포넌트에서만 사용 가능
export const metadata: Metadata = {
  title: 'Fitculator: AI-Powered Exercise Intelligence',
  description:
    'Fitculator is the first AI-powered platform that precisely quantifies both aerobic and strength training to boost member retention for boutique fitness studios.',
  icons: {
    icon: '/favicon.svg',
  },
};

// 루트 레이아웃 컴포넌트
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId={`${GTM_ID}`} />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
