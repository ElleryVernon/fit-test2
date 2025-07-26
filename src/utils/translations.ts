// 다국어 텍스트 타입 정의
type LanguageKey = 'en' | 'ko';

type TextByLanguage = {
  [key in LanguageKey]: string;
};

type PointsByLanguage = {
  [key in LanguageKey]: string[];
};

// 다국어 텍스트 정의
export const translations: {
  common: {
    getDemo: TextByLanguage;
    scheduleCall: TextByLanguage;
    features: TextByLanguage;
    useCases: TextByLanguage;
    vision: TextByLanguage;
    pricing: TextByLanguage;
  };
  navbar: {
    features: TextByLanguage;
    useCases: TextByLanguage;
    vision: TextByLanguage;
    pricing: TextByLanguage;
  };
  hero: {
    title: TextByLanguage;
    subtitle: TextByLanguage;
    description: TextByLanguage;
    cta: TextByLanguage;
    imageAlt: TextByLanguage;
  };
  challenge: {
    title: TextByLanguage;
    subtitle: TextByLanguage;
    points: PointsByLanguage;
  };
  solution: {
    title: TextByLanguage;
    subtitle: TextByLanguage;
    points: PointsByLanguage;
  };
  features: {
    title: TextByLanguage;
    subtitle: TextByLanguage;
    items: {
      [key: string]: {
        title: TextByLanguage;
        description: TextByLanguage;
      };
    };
  };
  vision: {
    title: TextByLanguage;
    subtitle: TextByLanguage;
    description: TextByLanguage;
  };
  cta: {
    title: TextByLanguage;
    subtitle: TextByLanguage;
    buttonText: TextByLanguage;
  };
  footer: {
    copyright: TextByLanguage;
    links: {
      [key: string]: TextByLanguage;
    };
  };
  useCases: {
    title: TextByLanguage;
    subtitle: TextByLanguage;
    retention: {
      title: TextByLanguage;
      description: TextByLanguage;
      points: PointsByLanguage;
    };
    programming: {
      title: TextByLanguage;
      description: TextByLanguage;
      points: PointsByLanguage;
    };
    trainer: {
      title: TextByLanguage;
      description: TextByLanguage;
      points: PointsByLanguage;
    };
    community: {
      title: TextByLanguage;
      description: TextByLanguage;
      points: PointsByLanguage;
    };
    revenue: {
      title: TextByLanguage;
      description: TextByLanguage;
      points: PointsByLanguage;
    };
  };
} = {
  common: {
    getDemo: {
      en: 'BOOK A DEMO',
      ko: '데모 요청',
    },
    scheduleCall: {
      en: 'Schedule Call',
      ko: '상담 예약',
    },
    features: {
      en: 'Features',
      ko: '기능',
    },
    useCases: {
      en: 'Use Cases',
      ko: '활용 사례',
    },
    vision: {
      en: 'Vision',
      ko: '비전',
    },
    pricing: {
      en: 'Pricing',
      ko: '가격',
    },
  },
  navbar: {
    features: {
      en: 'Features',
      ko: '기능',
    },
    useCases: {
      en: 'Use Cases',
      ko: '활용 사례',
    },
    vision: {
      en: 'Vision',
      ko: '비전',
    },
    pricing: {
      en: 'Pricing',
      ko: '가격',
    },
  },
  hero: {
    title: {
      en: 'Train Hard, Grow Fast',
      ko: '더 열심히 훈련하고, 더 빠르게 성장하세요',
    },
    subtitle: {
      en: 'The performance platform for athlete-run fitness businesses',
      ko: '선수를 위한 퍼포먼스 기반 피트니스 비즈니스 플랫폼',
    },
    description: {
      en: 'Turn training logs into programs. Turn fans into customers. Grow your studio — without burning out.',
      ko: '훈련 로그를 프로그램으로, 팬을 수익 고객으로, 스튜디오는 자동화된 시스템으로 전환하세요 — 번아웃 없이 비즈니스를 확장할 수 있도록 돕습니다.',
    },
    cta: {
      en: 'BOOK A DEMO',
      ko: '데모 요청',
    },
    imageAlt: {
      en: 'Minimal gradient or boutique fitness space image placeholder',
      ko: '미니멀한 그래디언트 또는 부티크 피트니스 공간 이미지가 들어갈 자리입니다',
    },
  },
  challenge: {
    title: {
      en: 'The Challenge',
      ko: '도전 과제',
    },
    subtitle: {
      en: "Boutique fitness studios face unique challenges in today's competitive market",
      ko: '오늘날 경쟁이 치열한 시장에서 부티크 피트니스 스튜디오는 독특한 도전에 직면해 있습니다',
    },
    points: {
      en: [
        'High member churn rates cutting into profitability',
        'Difficulty quantifying workout effectiveness',
        'Limited insights into member engagement patterns',
        'Increasing competition from digital fitness platforms',
        'Challenges in personalizing member experiences at scale',
      ],
      ko: [
        '수익성을 저하시키는 높은 회원 이탈률',
        '운동 효과를 정량화하기 어려움',
        '회원 참여 패턴에 대한 제한된 인사이트',
        '디지털 피트니스 플랫폼과의 경쟁 증가',
        '대규모로 회원 경험을 개인화하는 데 따른 어려움',
      ],
    },
  },
  solution: {
    title: {
      en: 'Our Solution',
      ko: '우리의 솔루션',
    },
    subtitle: {
      en: 'Fitculator transforms exercise data into actionable intelligence',
      ko: 'Fitculator는 운동 데이터를 실행 가능한 인텔리전스로 변환합니다',
    },
    points: {
      en: [
        'Precise quantification of both aerobic and strength training',
        'AI-powered insights to predict and prevent member churn',
        'Personalized member engagement strategies',
        'Data-driven programming optimization',
        'Comprehensive analytics dashboard for business intelligence',
      ],
      ko: [
        '유산소 및 근력 운동 모두에 대한 정확한 정량화',
        '회원 이탈을 예측하고 방지하기 위한 AI 기반 인사이트',
        '개인화된 회원 참여 전략',
        '데이터 기반 프로그래밍 최적화',
        '비즈니스 인텔리전스를 위한 종합 분석 대시보드',
      ],
    },
  },
  features: {
    title: {
      en: 'Key Features',
      ko: '주요 기능',
    },
    subtitle: {
      en: 'Powerful tools designed specifically for boutique fitness studios',
      ko: '부티크 피트니스 스튜디오를 위해 특별히 설계된 강력한 도구',
    },
    items: {
      analytics: {
        title: {
          en: 'Comprehensive Analytics',
          ko: '종합 분석',
        },
        description: {
          en: 'Track member performance, engagement, and retention metrics in real-time.',
          ko: '회원 성과, 참여도 및 유지율 지표를 실시간으로 추적합니다.',
        },
      },
      prediction: {
        title: {
          en: 'Churn Prediction',
          ko: '이탈 예측',
        },
        description: {
          en: 'AI algorithms identify at-risk members before they leave.',
          ko: 'AI 알고리즘이 회원이 떠나기 전에 위험에 처한 회원을 식별합니다.',
        },
      },
      personalization: {
        title: {
          en: 'Personalized Engagement',
          ko: '개인화된 참여',
        },
        description: {
          en: 'Tailor communication and programming to individual member needs.',
          ko: '개별 회원 요구에 맞게 커뮤니케이션 및 프로그래밍을 조정합니다.',
        },
      },
      integration: {
        title: {
          en: 'Seamless Integration',
          ko: '원활한 통합',
        },
        description: {
          en: 'Works with your existing systems and wearable technology.',
          ko: '기존 시스템 및 웨어러블 기술과 함께 작동합니다.',
        },
      },
    },
  },
  vision: {
    title: {
      en: 'Our Vision',
      ko: '우리의 비전',
    },
    subtitle: {
      en: 'Transforming the future of fitness through AI',
      ko: 'AI를 통해 피트니스의 미래를 변화시킵니다',
    },
    description: {
      en: 'We believe that the future of fitness lies in the intelligent application of exercise data. Our mission is to empower boutique fitness studios with the tools they need to thrive in an increasingly competitive market, while helping their members achieve better results through science-backed training approaches.',
      ko: '우리는 피트니스의 미래가 운동 데이터의 지능적인 적용에 있다고 믿습니다. 우리의 사명은 부티크 피트니스 스튜디오가 점점 더 경쟁이 치열해지는 시장에서 번창하는 데 필요한 도구를 제공하는 동시에, 과학적으로 검증된 트레이닝 접근 방식을 통해 회원들이 더 나은 결과를 얻도록 돕는 것입니다.',
    },
  },
  cta: {
    title: {
      en: 'Start with Hybrid Training. Scale beyond.',
      ko: '하이브리드 트레이닝부터 시작해 그 이상으로 확장합니다.',
    },
    subtitle: {
      en: "Fitculator is built for high-performance athlete-coaches, starting with the world's fastest-growing fitness sport.",
      ko: 'Fitculator는 세계에서 가장 빠르게 성장하고 있는 피트니스 스포츠부터 시작해 선수와 코치를 위해 만들어졌습니다.',
    },
    buttonText: {
      en: 'Get Started Today',
      ko: '바로 시작하기',
    },
  },
  footer: {
    copyright: {
      en: '© 2025 Fitculator. All rights reserved.',
      ko: '© 2025 Fitculator. All rights reserved.',
    },
    links: {
      about: {
        en: 'About',
        ko: '소개',
      },
      features: {
        en: 'Features',
        ko: '기능',
      },
      pricing: {
        en: 'Pricing',
        ko: '가격',
      },
      contact: {
        en: 'Contact',
        ko: '연락처',
      },
      privacy: {
        en: 'Privacy Policy',
        ko: '개인정보 보호정책',
      },
      terms: {
        en: 'Terms',
        ko: '이용약관',
      },
    },
  },
  useCases: {
    title: {
      en: 'How Leading Studios Use Fitculator',
      ko: 'Fitculator를 활용하는 선도적인 스튜디오',
    },
    subtitle: {
      en: 'Discover how boutique fitness studios are transforming their business with exercise intelligence',
      ko: '부티크 피트니스 스튜디오가 운동 인텔리전스로 비즈니스를 혁신하는 방법을 알아보세요',
    },
    retention: {
      title: {
        en: 'Member Retention',
        ko: '회원 유지',
      },
      description: {
        en: 'Identify at-risk members before they leave and implement targeted retention strategies.',
        ko: '이탈 위험이 있는 회원을 미리 식별하고 맞춤형 유지 전략을 구현합니다.',
      },
      points: {
        en: [
          'Predictive algorithms identify at-risk members',
          'Automated personalized engagement strategies',
          'Improved member retention rates',
        ],
        ko: [
          '예측 알고리즘으로 이탈 위험이 있는 회원 식별',
          '개인화된 참여 전략 자동 생성',
          '회원 유지율 개선',
        ],
      },
    },
    programming: {
      title: {
        en: 'Programming Optimization',
        ko: '프로그래밍 최적화',
      },
      description: {
        en: 'Use exercise data to optimize class schedules and programming for maximum member engagement.',
        ko: '운동 데이터를 활용하여 회원 참여를 극대화하는 수업 일정과 프로그래밍을 최적화합니다.',
      },
      points: {
        en: [
          'Optimize class schedules based on member preferences and engagement',
          'Identify popular workout types and intensities',
          'Increased class attendance',
        ],
        ko: [
          '회원 선호도 및 참여도 기반 수업 일정 최적화',
          '인기 있는 운동 유형 및 강도 식별',
          '수업 참석률 향상',
        ],
      },
    },
    trainer: {
      title: {
        en: 'Trainer Effectiveness',
        ko: '트레이너 효율성',
      },
      description: {
        en: 'Measure and improve trainer effectiveness with objective exercise data and member feedback.',
        ko: '객관적인 운동 데이터와 회원 피드백으로 트레이너 효율성을 측정하고 개선합니다.',
      },
      points: {
        en: [
          'Measure member engagement and results by trainer',
          'Identify coaching improvement opportunities',
          'Enhanced trainer effectiveness',
        ],
        ko: [
          '트레이너별 회원 참여도 및 성과 측정',
          '개인화된 코칭 개선 기회 식별',
          '트레이너 효율성 향상',
        ],
      },
    },
    community: {
      title: {
        en: 'Community Building',
        ko: '커뮤니티 구축',
      },
      description: {
        en: 'Foster a stronger fitness community with data-driven challenges and social engagement features.',
        ko: '데이터 기반 챌린지와 소셜 참여 기능으로 더 강력한 피트니스 커뮤니티를 구축합니다.',
      },
      points: {
        en: [
          'Create data-driven community challenges',
          'Foster healthy competition among members',
          'Increased social engagement',
        ],
        ko: [
          '데이터 기반 커뮤니티 챌린지 생성',
          '회원 간 건강한 경쟁 촉진',
          '소셜 참여도 증가',
        ],
      },
    },
    revenue: {
      title: {
        en: 'Revenue Growth',
        ko: '매출 성장',
      },
      description: {
        en: 'Drive revenue growth through improved retention, referrals, and targeted upselling opportunities.',
        ko: '향상된 회원 유지, 추천 및 맞춤형 업셀링 기회를 통해 매출 성장을 촉진합니다.',
      },
      points: {
        en: [
          'Increased revenue through improved member retention',
          'Identify data-driven upselling opportunities',
          'Accelerated business growth',
        ],
        ko: [
          '회원 유지 개선으로 인한 매출 증가',
          '데이터 기반 추가 서비스 판매 기회 식별',
          '비즈니스 성장 가속화',
        ],
      },
    },
  },
};
