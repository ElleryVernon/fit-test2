'use client';

import React from 'react';
import FadeUp from '../animations/FadeUp';
import ScrollReveal from '../animations/ScrollReveal';
import Shimmer from '../animations/Shimmer';

const CustomerStories = () => {
  const stories = [
    {
      id: 1,
      quote:
        'It helps us onboard new software engineers and get them productive right away. We have all our source code, issues, and pull requests in one place... GitHub is a complete platform that frees us from menial tasks and enables us to do our best work.',
      author: 'Fabian Faulhaber',
      position: 'Application manager at Mercedes-Benz',
    },
    {
      id: 2,
      quote: 'Duolingo boosts developer speed by 25% with GitHub Copilot',
      company: 'Duolingo',
      logo: '/assets/images/duolingo-logo.png',
    },
    {
      id: 3,
      quote: '2024 Gartner® Magic Quadrant™ for AI Code Assistants',
      company: 'Gartner',
      logo: '/assets/images/gartner-logo.png',
    },
  ];

  return (
    <section className="bg-[#0d1117] text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* 첫 번째 고객 사례 */}
          <FadeUp className="mb-20">
            <Shimmer>
              <div className="bg-gray-900 rounded-lg p-8 md:p-12 border border-gray-800">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-2/3">
                    <blockquote className="text-xl md:text-2xl mb-6 relative">
                      <span className="text-5xl text-gray-700 absolute -top-6 -left-4">
                        &quot;
                      </span>
                      <p className="relative z-10">{stories[0].quote}</p>
                    </blockquote>
                    <div>
                      <p className="font-semibold">{stories[0].author}</p>
                      <p className="text-gray-400">{stories[0].position}</p>
                    </div>
                  </div>
                  <div className="md:w-1/3 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center">
                      <span className="text-3xl">MB</span>
                    </div>
                  </div>
                </div>
              </div>
            </Shimmer>
          </FadeUp>

          {/* 통계 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <ScrollReveal
              direction="left"
              className="bg-gray-900 rounded-lg p-8 border border-gray-800 flex flex-col justify-between"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-2">Work 55% faster¹</h3>
                <p className="text-gray-300">
                  Increase productivity with AI-powered coding assistance,
                  including code completion, chat, and more.
                </p>
              </div>
              <a
                href="#"
                className="text-blue-400 hover:underline flex items-center"
              >
                Explore GitHub Copilot
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="M6 12L10 8L6 4"></path>
                </svg>
              </a>
            </ScrollReveal>
            <ScrollReveal
              direction="right"
              delay={0.2}
              className="bg-gray-900 rounded-lg p-8 border border-gray-800 flex flex-col justify-between"
            >
              <div className="mb-4">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                    <span>D</span>
                  </div>
                  <span className="text-xl">duolingo</span>
                </div>
                <p className="text-xl font-semibold">{stories[1].quote}</p>
              </div>
              <a
                href="#"
                className="text-blue-400 hover:underline flex items-center"
              >
                Read customer story
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="M6 12L10 8L6 4"></path>
                </svg>
              </a>
            </ScrollReveal>
          </div>

          {/* 추가 통계 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal
              direction="left"
              delay={0.3}
              className="bg-gray-900 rounded-lg p-8 border border-gray-800 flex flex-col justify-between"
            >
              <div className="mb-4">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                    <span>G</span>
                  </div>
                  <span className="text-xl">Gartner</span>
                </div>
                <p className="text-xl font-semibold">{stories[2].quote}</p>
              </div>
              <a
                href="#"
                className="text-blue-400 hover:underline flex items-center"
              >
                Read report
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="M6 12L10 8L6 4"></path>
                </svg>
              </a>
            </ScrollReveal>
            <ScrollReveal
              direction="right"
              delay={0.4}
              className="bg-gray-900 rounded-lg p-8 border border-gray-800 flex flex-col justify-between"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-2">90% coverage</h3>
                <p className="text-gray-300">
                  of alert types in all supported languages with Copilot Autofix
                </p>
              </div>
              <div className="text-sm text-gray-400">
                <p>
                  This 7X times factor is based on data from the industry&apos;s
                  longest running analysis of fix rates Veracode State of
                  Software Security 2023, which cites the average time to fix
                  50% of flaws as 198 days vs. GitHub&apos;s fix rates of 72% of
                  flaws with in 28 days which is at a minimum of 7X faster when
                  compared.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerStories;
