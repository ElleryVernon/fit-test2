'use client';

/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

interface PrivacyPolicyItem {
  title: {
    en: string;
    ko: string;
  };
  content: {
    en: React.ReactNode;
    ko: React.ReactNode;
  };
}

type LanguageType = 'ko' | 'en';

const PrivacyPolicy = () => {
  const { language } = useLanguage();
  const currentLanguage = language as LanguageType;

  const privacyPolicyItems: PrivacyPolicyItem[] = [
    {
      title: {
        ko: '제1조(목적)',
        en: 'Article 1 (Purpose)',
      },
      content: {
        ko: (
          <>
            핏큘레이터(이하 &apos;회사&apos; 라고 함)는 회사가 제공하고자 하는
            서비스(이하 &apos;회사 서비스&apos;)를 이용하는 개인(이하
            &apos;이용자&apos; 또는 &apos;개인&apos;)의 정보(이하
            &apos;개인정보&apos;)를 보호하기 위해, 개인정보보호법, 정보통신망
            이용촉진 및 정보보호 등에 관한 법률(이하 &apos;정보통신망법&apos;)
            등 관련 법령을 준수하고, 서비스 이용자의 개인정보 보호 관련한 고충을
            신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이
            개인정보처리방침(이하 &apos;본 방침&apos;)을 수립합니다.
          </>
        ),
        en: (
          <>
            Fitculator (hereinafter referred to as the &quot;Company&quot;)
            establishes the following Privacy Policy (hereinafter referred to as
            the &quot;Policy&quot;) in order to protect the information
            (hereinafter referred to as &quot;personal information&quot;) of
            individuals (hereinafter referred to as &quot;users&quot; or
            &quot;individuals&quot;) who use the services that the Company
            intends to provide (hereinafter referred to as &quot;Company
            services&quot;), comply with relevant laws such as the Personal
            Information Protection Act and the Act on Promotion of Information
            and Communications Network Utilization and Information Protection
            (hereinafter referred to as the &quot;Information and Communications
            Network Act&quot;), and to promptly and smoothly handle grievances
            related to the protection of personal information of service users.
          </>
        ),
      },
    },
    {
      title: {
        ko: '제2조(개인정보 처리의 원칙)',
        en: 'Article 2 (Principles of Personal Information Processing)',
      },
      content: {
        ko: (
          <>
            개인정보 관련 법령 및 본 방침에 따라 회사는 이용자의 개인정보를
            수집할 수 있으며 수집된 개인정보는 개인의 동의가 있는 경우에 한해
            제3자에게 제공될 수 있습니다. 단, 법령의 규정 등에 의해 적법하게
            강제되는 경우 회사는 수집한 이용자의 개인정보를 사전에 개인의 동의
            없이 제3자에게 제공할 수도 있습니다.
          </>
        ),
        en: (
          <>
            In accordance with the relevant laws and regulations on personal
            information and this Policy, the Company may collect personal
            information of users, and the collected personal information may be
            provided to third parties only with the consent of the individual.
            However, in cases where it is legally enforced in accordance with
            the provisions of laws and regulations, the Company may provide the
            collected personal information of users to third parties without the
            prior consent of the individual.
          </>
        ),
      },
    },
    {
      title: {
        ko: '제3조(본 방침의 공개)',
        en: 'Article 3 (Disclosure of this Policy)',
      },
      content: {
        ko: (
          <>
            <p>
              1. 회사는 이용자가 언제든지 쉽게 본 방침을 확인할 수 있도록 회사
              홈페이지 첫 화면 또는 첫 화면과의 연결화면을 통해 본 방침을
              공개하고 있습니다.
            </p>
            <p>
              2. 회사는 제1항에 따라 본 방침을 공개하는 경우 글자 크기 색상 등을
              활용하여 이용자가 본 방침을 쉽게 확인할 수 있도록 합니다.
            </p>
          </>
        ),
        en: (
          <>
            <p>
              1. The Company discloses this Policy through the Company's
              homepage first screen or a screen connected to the first screen so
              that users can easily check this Policy at any time.
            </p>
            <p>
              2. When disclosing this Policy in accordance with Paragraph 1, the
              Company utilizes font size, color, etc. to make it easy for users
              to check this Policy.
            </p>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제4조(본 방침의 변경)',
        en: 'Article 4 (Changes to this Policy)',
      },
      content: {
        ko: (
          <>
            <p>
              회사는 이용자의 회사 서비스에 대한 회원가입을 위하여 다음과 같은
              정보를 수집합니다.
            </p>
            <p>
              2. 회사는 제1항에 따라 본 방침을 개정하는 경우 다음 각 호 하나
              이상의 방법으로 공지합니다.
            </p>
            <ul className="pl-6 list-decimal">
              <li>
                회사가 운영하는 인터넷 홈페이지의 첫 화면의 공지사항란 또는
                별도의 창을 통하여 공지하는 방법
              </li>
              <li>
                서면·모사전송·전자우편 또는 이와 비슷한 방법으로 이용자에게
                공지하는 방법
              </li>
              <li>
                회사는 제2항의 공지는 본 방침 개정의 시행일로부터 최소 7일
                이전에 공지합니다. 다만 이용자 권리의 중요한 변경이 있을
                경우에는 최소 30일 전에 공지합니다.
              </li>
            </ul>
          </>
        ),
        en: (
          <>
            <p>
              The Company collects the following information for user membership
              registration for the Company's services.
            </p>
            <p>
              2. When the Company revises this Policy in accordance with
              Paragraph 1, it shall notify through one or more of the following
              methods.
            </p>
            <ul className="pl-6 list-decimal">
              <li>
                Notification through the notice section on the first screen of
                the internet homepage operated by the Company or through a
                separate window
              </li>
              <li>
                Notification to users by means of written document, facsimile
                transmission, electronic mail, or similar methods
              </li>
              <li>
                The Company shall notify at least 7 days prior to the effective
                date of the revision of this Policy. However, in case of
                significant changes to user rights, it shall notify at least 30
                days in advance.
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제5조(회원 가입을 위한 정보)',
        en: 'Article 5 (Information for Membership Registration)',
      },
      content: {
        ko: (
          <>
            <p>
              회사는 이용자의 회사 서비스에 대한 회원가입을 위하여 다음과 같은
              정보를 수집합니다.
            </p>

            <ul className="pl-6 list-decimal">
              <li>
                필수 수집 정보: 이메일 주소, 비밀번호, 이름, 닉네임, 생년월일 및
                휴대폰 번호
              </li>
            </ul>
          </>
        ),
        en: (
          <>
            <p>
              The Company collects the following information for user membership
              registration for the Company's services.
            </p>

            <ul className="pl-6 list-decimal">
              <li>
                Required information: Email address, password, name, nickname,
                date of birth, and mobile phone number
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제6조(본인 인증을 위한 정보)',
        en: 'Article 6 (Information for Identity Verification)',
      },
      content: {
        ko: (
          <>
            <p>
              회사는 이용자의 본인인증을 위하여 다음과 같은 정보를 수집합니다.
            </p>

            <ul className="pl-6 list-decimal">
              <li>
                필수 수집 정보: 휴대폰 번호, 이메일 주소, 이름, 생년월일, 성별,
                본인확인값(CI,DI), 이동통신사, 아이핀 정보(아이핀 확인 시) 및
                내/외국인 여부
              </li>
            </ul>
          </>
        ),
        en: (
          <>
            <p>
              The Company collects the following information for user identity
              verification.
            </p>

            <ul className="pl-6 list-decimal">
              <li>
                Required information: Mobile phone number, email address, name,
                date of birth, gender, personal identification values (CI, DI),
                mobile carrier, i-PIN information (when i-PIN is verified), and
                whether the person is a Korean national or a foreigner
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제7조(법정대리인 동의를 위한 정보)',
        en: 'Article 7 (Information for Legal Representative Consent)',
      },
      content: {
        ko: (
          <>
            <p>
              회사는 법정대리인의 동의가 필요한 경우 법정대리인의 동의를 위하여
              다음과 같은 정보를 수집합니다.
            </p>

            <ul className="pl-6 list-decimal">
              <li>
                필수 수집 정보: 보호자 이름, 보호자 생년월일, 보호자 성별,
                보호자 내/외국인 여부, 보호자 휴대폰 번호, 보호자 이동통신사
                정보, 보호자 아이핀 정보(아이핀 확인 시), 보호자
                본인확인값(CI,DI) 및 본인과의 관계
              </li>
            </ul>
          </>
        ),
        en: (
          <>
            <p>
              The Company collects the following information for the consent of
              legal representatives when such consent is required.
            </p>

            <ul className="pl-6 list-decimal">
              <li>
                Required information: Guardian's name, guardian's date of birth,
                guardian's gender, whether the guardian is a Korean national or
                a foreigner, guardian's mobile phone number, guardian's mobile
                carrier information, guardian's i-PIN information (when i-PIN is
                verified), guardian's personal identification values (CI, DI),
                and relationship with the user
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제8조(결제 서비스를 위한 정보)',
        en: 'Article 8 (Information for Payment Services)',
      },
      content: {
        ko: (
          <>
            <p>
              회사는 이용자에게 회사의 결제 서비스 제공을 위하여 다음과 같은
              정보를 수집합니다.
            </p>
            <ul className="pl-6 list-decimal">
              <li>
                필수 수집 정보: 카드번호, 카드비밀번호, 유효기간, 생년월일
                6자리(yy/mm/dd), 은행명 및 계좌번호
              </li>
            </ul>
          </>
        ),
        en: (
          <>
            <p>
              The Company collects the following information to provide payment
              services to users.
            </p>
            <ul className="pl-6 list-decimal">
              <li>
                Required information: Card number, card password, expiration
                date, 6-digit date of birth (yy/mm/dd), bank name, and account
                number
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제9조(현금 영수증 발행을 위한 정보)',
        en: 'Article 9 (Information for Issuing Cash Receipts)',
      },
      content: {
        ko: (
          <>
            <p>
              회사는 이용자의 현금영수증을 발행하기 위하여 다음과 같은 정보를
              수집합니다.
            </p>
            <ul className="pl-6 list-decimal">
              <li>
                필수 수집 정보: 현금영수증 발행 대상자 이름, 현금영수증 발행
                대상자 생년월일, 현금영수증 발행 대상자 주소, 휴대폰 번호 및
                현금영수증 카드번호
              </li>
            </ul>
          </>
        ),
        en: (
          <>
            <p>
              The Company collects the following information to issue cash
              receipts for users.
            </p>
            <ul className="pl-6 list-decimal">
              <li>
                Required information: Name of the cash receipt recipient, date
                of birth of the cash receipt recipient, address of the cash
                receipt recipient, mobile phone number, and cash receipt card
                number
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제10조(회사 서비스 제공을 위한 정보)',
        en: 'Article 10 (Information for Providing Company Services)',
      },
      content: {
        ko: (
          <>
            <p>
              회사는 이용자에게 회사의 서비스를 제공하기 위하여 다음과 같은
              정보를 수집합니다.
            </p>
            <ul className="pl-6 list-decimal">
              <li>
                필수 수집 정보: 아이디, 이메일 주소, 이름, 생년월일 및 연락처
              </li>
            </ul>
          </>
        ),
        en: (
          <>
            <p>
              The Company collects the following information to provide services
              to users.
            </p>
            <ul className="pl-6 list-decimal">
              <li>
                Required information: ID, email address, name, date of birth,
                and contact information
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제11조(서비스 이용 및 부정 이용 확인을 위한 정보)',
        en: 'Article 11 (Information for Service Usage and Verification of Improper Use)',
      },
      content: {
        ko: (
          <>
            <p>
              회사는 이용자의 서비스 이용에 따른 통계∙분석 및 부정이용의
              확인∙분석을 위하여 다음과 같은 정보를 수집합니다. (부정이용이란
              회원탈퇴 후 재가입, 상품구매 후 구매취소 등을 반복적으로 행하는 등
              회사가 제공하는 할인쿠폰, 이벤트 혜택 등의 경제상 이익을
              불·편법적으로 수취하는 행위, 이용약관 등에서 금지하고 있는 행위,
              명의도용 등의 불·편법행위 등을 말합니다.)
            </p>
            <ul className="pl-6 list-decimal">
              <li>
                필수 수집 정보: 서비스 이용기록, 쿠키, 접속지 정보 및 기기정보
              </li>
            </ul>
          </>
        ),
        en: (
          <>
            <p>
              The Company collects the following information for statistical
              analysis of service usage and verification and analysis of
              improper use. (Improper use refers to acts such as repeatedly
              withdrawing membership and rejoining, repeatedly purchasing and
              canceling products, improperly receiving economic benefits such as
              discount coupons and event benefits provided by the Company, acts
              prohibited in the terms of use, identity theft, and other improper
              or illegal acts.)
            </p>
            <ul className="pl-6 list-decimal">
              <li>
                Required information: Service usage records, cookies, access
                location information, and device information
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제12조(개인정보 수집 방법)',
        en: 'Article 12 (Methods of Collecting Personal Information)',
      },
      content: {
        ko: (
          <>
            <p>회사는 다음과 같은 방법으로 이용자의 개인정보를 수집합니다.</p>
            <ul className="pl-6 list-decimal">
              <li>
                이용자가 회사의 홈페이지에 자신의 개인정보를 입력하는 방식
              </li>
              <li>
                어플리케이션 등 회사가 제공하는 홈페이지 외의 서비스를 통해
                이용자가 자신의 개인정보를 입력하는 방식
              </li>
              <li>
                이용자가 회사가 발송한 이메일을 수신받아 개인정보를 입력하는
                방식
              </li>
              <li>
                이용자가 고객센터의 상담, 게시판에서의 활동 등 회사의 서비스를
                이용하는 과정에서 이용자가 입력하는 방식
              </li>
            </ul>
          </>
        ),
        en: (
          <>
            <p>
              The Company collects users' personal information through the
              following methods.
            </p>
            <ul className="pl-6 list-decimal">
              <li>
                When users enter their personal information on the Company's
                homepage
              </li>
              <li>
                When users enter their personal information through services
                other than the Company's homepage, such as applications
              </li>
              <li>
                When users receive emails sent by the Company and enter personal
                information
              </li>
              <li>
                When users enter information during the process of using the
                Company's services, such as customer center consultations and
                activities on bulletin boards
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제13조(개인정보의 이용)',
        en: 'Article 13 (Use of Personal Information)',
      },
      content: {
        ko: (
          <>
            <p>회사는 개인정보를 다음 각 호의 경우에 이용합니다.</p>
            <ul className="pl-6 list-decimal">
              <li>공지사항의 전달 등 회사운영에 필요한 경우</li>
              <li>
                이용문의에 대한 회신, 불만의 처리 등 이용자에 대한 서비스 개선을
                위한 경우
              </li>
              <li>회사의 서비스를 제공하기 위한 경우</li>
              <li>
                법령 및 회사 약관을 위반하는 회원에 대한 이용 제한 조치, 부정
                이용 행위를 포함하여 서비스의 원활한 운영에 지장을 주는 행위에
                대한 방지 및 제재를 위한 경우
              </li>
              <li>신규 서비스 개발을 위한 경우</li>
              <li>이벤트 및 행사 안내 등 마케팅을 위한 경우</li>
              <li>
                인구통계학적 분석, 서비스 방문 및 이용기록의 분석을 위한 경우
              </li>
              <li>
                개인정보 및 관심에 기반한 이용자간 관계의 형성을 위한 경우
              </li>
            </ul>
          </>
        ),
        en: (
          <>
            <p>The Company uses personal information in the following cases.</p>
            <ul className="pl-6 list-decimal">
              <li>
                When necessary for company operations, such as delivering
                notices
              </li>
              <li>
                For service improvement for users, such as responding to usage
                inquiries, handling complaints, etc.
              </li>
              <li>To provide the Company's services</li>
              <li>
                For restriction measures against members who violate laws and
                Company terms, prevention and sanctions against acts that
                interfere with the smooth operation of services, including
                improper use
              </li>
              <li>For developing new services</li>
              <li>
                For marketing purposes, such as event and event notifications
              </li>
              <li>
                For demographic analysis, analysis of service visits and usage
                records
              </li>
              <li>
                For forming relationships between users based on personal
                information and interests
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제14조(개인정보의 보유 및 이용기간)',
        en: 'Article 14 (Retention and Usage Period of Personal Information)',
      },
      content: {
        ko: (
          <>
            <ul className="pl-6 list-decimal">
              <li>
                회사는 이용자의 개인정보에 대해 개인정보의 수집·이용 목적 달성을
                위한 기간 동안 개인정보를 보유 및 이용합니다.
              </li>
              <li>
                전항에도 불구하고 회사는 내부 방침에 의해 서비스 부정이용기록은
                부정 가입 및 이용 방지를 위하여 회원 탈퇴 시점으로부터 최대
                1년간 보관합니다.
              </li>
            </ul>
          </>
        ),
        en: (
          <>
            <ul className="pl-6 list-decimal">
              <li>
                The Company retains and uses users' personal information for the
                period necessary to achieve the purpose of collecting and using
                personal information.
              </li>
              <li>
                Notwithstanding the preceding paragraph, the Company retains
                records of improper service use for up to 1 year from the time
                of membership withdrawal in accordance with internal policies to
                prevent fraudulent registration and use.
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제15조(법령에 따른 개인정보의 보유 및 이용기간)',
        en: 'Article 15 (Retention and Usage Period of Personal Information According to Laws)',
      },
      content: {
        ko: (
          <>
            <p>
              회사는 관계법령에 따라 다음과 같이 개인정보를 보유 및 이용합니다.
            </p>
            <ul className="pl-6 list-decimal">
              <li>
                전자상거래 등에서의 소비자보호에 관한 법률에 따른 보유정보 및
                보유기간
              </li>
              <ul className="pl-6 list-decimal">
                <li>계약 또는 청약철회 등에 관한 기록 : 5년</li>
                <li>대금결제 및 재화 등의 공급에 관한 기록 : 5년</li>
                <li>소비자의 불만 또는 분쟁처리에 관한 기록 : 3년</li>
                <li>표시•광고에 관한 기록 : 6개월</li>
              </ul>
              <li>통신비밀보호법에 따른 보유정보 및 보유기간</li>
              <ul className="pl-6 list-decimal">
                <li>계약 또는 청약철회 등에 관한 기록 : 5년</li>
              </ul>
              <li>전자금융거래법에 따른 보유정보 및 보유기간</li>
              <ul className="pl-6 list-decimal">
                <li>전자금융거래에 관한 기록 : 5년</li>
              </ul>
              <li>위치정보의 보호 및 이용 등에 관한 법률</li>
              <ul className="pl-6 list-decimal">
                <li>개인위치정보에 관한 기록 : 6개월</li>
              </ul>
            </ul>
          </>
        ),
        en: (
          <>
            <p>
              The Company retains and uses personal information as follows in
              accordance with relevant laws.
            </p>
            <ul className="pl-6 list-decimal">
              <li>
                Information retained and retention period under the Act on
                Consumer Protection in Electronic Commerce, etc.
              </li>
              <ul className="pl-6 list-decimal">
                <li>
                  Records of contracts or subscription withdrawals: 5 years
                </li>
                <li>Records of payment and supply of goods: 5 years</li>
                <li>
                  Records of consumer complaints or dispute handling: 3 years
                </li>
                <li>Records of labeling/advertising: 6 months</li>
              </ul>
              <li>
                Information retained and retention period under the Protection
                of Communications Secrets Act
              </li>
              <ul className="pl-6 list-decimal">
                <li>
                  Records of contracts or subscription withdrawals: 5 years
                </li>
              </ul>
              <li>
                Information retained and retention period under the Electronic
                Financial Transactions Act
              </li>
              <ul className="pl-6 list-decimal">
                <li>Records of electronic financial transactions: 5 years</li>
              </ul>
              <li>Act on the Protection and Use of Location Information</li>
              <ul className="pl-6 list-decimal">
                <li>Records of personal location information: 6 months</li>
              </ul>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제16조(개인정보의 파기원칙)',
        en: 'Article 16 (Principles for Destruction of Personal Information)',
      },
      content: {
        ko: (
          <>
            <p>
              회사는 원칙적으로 이용자의 개인정보 처리 목적의 달성,
              보유·이용기간의 경과 등 개인정보가 필요하지 않을 경우에는 해당
              정보를 지체 없이 파기합니다.
            </p>
          </>
        ),
        en: (
          <>
            <p>
              In principle, the Company destroys the relevant information
              without delay when personal information is no longer needed, such
              as when the purpose of processing personal information has been
              achieved or the retention and usage period has expired.
            </p>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제17조(개인정보파기절차)',
        en: 'Article 17 (Procedures for Destruction of Personal Information)',
      },
      content: {
        ko: (
          <>
            <ul className="pl-6 list-decimal">
              <li>
                이용자가 회원가입 등을 위해 입력한 정보는 개인정보 처리 목적이
                달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부
                방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및
                이용기간 참조) 일정 기간 저장된 후 파기 되어집니다.
              </li>
              <li>
                회사는 파기 사유가 발생한 개인정보를 개인정보보호 책임자의
                승인절차를 거쳐 파기합니다.
              </li>
            </ul>
          </>
        ),
        en: (
          <>
            <ul className="pl-6 list-decimal">
              <li>
                Information entered by users for membership registration, etc.,
                is moved to a separate DB (or a separate document file in the
                case of paper) after the purpose of personal information
                processing has been achieved, and is stored for a certain period
                according to internal policies and other relevant laws (refer to
                retention and usage period) before being destroyed.
              </li>
              <li>
                The Company destroys personal information for which destruction
                reasons have occurred through an approval procedure by the
                personal information protection officer.
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제18조(개인정보파기방법)',
        en: 'Article 18 (Methods for Destruction of Personal Information)',
      },
      content: {
        ko: (
          <>
            <p>
              회사는 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는
              기술적 방법을 사용하여 삭제하며, 종이로 출력된 개인정보는 분쇄기로
              분쇄하거나 소각 등을 통하여 파기합니다.
            </p>
          </>
        ),
        en: (
          <>
            <p>
              The Company deletes personal information stored in electronic file
              format using technical methods that prevent reproduction of
              records, and personal information printed on paper is destroyed by
              shredding with a shredder or through incineration.
            </p>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제19조(광고성 정보의 전송 조치)',
        en: 'Article 19 (Measures for Transmission of Advertising Information)',
      },
      content: {
        ko: (
          <>
            <ul className="pl-6 list-decimal">
              <li>
                회사는 전자적 전송매체를 이용하여 영리목적의 광고성 정보를
                전송하는 경우 이용자의 명시적인 사전동의를 받습니다. 다만, 다음
                각호 어느 하나에 해당하는 경우에는 사전 동의를 받지 않습니다
              </li>
              <ul className="pl-6 list-decimal">
                <li>
                  회사가 재화 등의 거래관계를 통하여 수신자로부터 직접 연락처를
                  수집한 경우, 거래가 종료된 날로부터 6개월 이내에 회사가
                  처리하고 수신자와 거래한 것과 동종의 재화 등에 대한 영리목적의
                  광고성 정보를 전송하려는 경우
                </li>
                <li>
                  &lsquo;방문판매 등에 관한 법률&rsquo;에 따른 전화권유판매자가
                  육성으로 수신자에게 개인정보의 수집출처를 고지하고 전화권유를
                  하는 경우
                </li>
              </ul>
              <li>
                회사는 전항에도 불구하고 수신자가 수신거부의사를 표시하거나 사전
                동의를 철회한 경우에는 영리목적의 광고성 정보를 전송하지 않으며
                수신거부 및 수신동의 철회에 대한 처리 결과를 알립니다.
              </li>
              <li>
                회사는 오후 9시부터 그다음 날 오전 8시까지의 시간에 전자적
                전송매체를 이용하여 영리목적의 광고성 정보를 전송하는 경우에는
                제1항에도 불구하고 그 수신자로부터 별도의 사전 동의를 받습니다.
              </li>
              <li>
                회사는 전자적 전송매체를 이용하여 영리목적의 광고성 정보를
                전송하는 경우 다음의 사항 등을 광고성 정보에 구체적으로
                밝힙니다.
              </li>
              <ul className="pl-6 list-decimal">
                <li>회사명 및 연락처</li>
                <li>
                  수신 거부 또는 수신 동의의 철회 의사표시에 관한 사항의 표시
                </li>
              </ul>
              <li>
                회사는 전자적 전송매체를 이용하여 영리목적의 광고성 정보를
                전송하는 경우 다음 각 호의 어느 하나에 해당하는 조치를 하지
                않습니다.
              </li>
              <ul className="pl-6 list-decimal">
                <li>
                  광고성 정보 수신자의 수신거부 또는 수신동의의 철회를
                  회피·방해하는 조치
                </li>
                <li>
                  숫자·부호 또는 문자를 조합하여 전화번호·전자우편주소 등
                  수신자의 연락처를 자동으로 만들어 내는 조치
                </li>
                <li>
                  영리목적의 광고성 정보를 전송할 목적으로 전화번호 또는
                  전자우편주소를 자동으로 등록하는 조치
                </li>
                <li>
                  광고성 정보 전송자의 신원이나 광고 전송 출처를 감추기 위한
                  각종 조치
                </li>
                <li>
                  영리목적의 광고성 정보를 전송할 목적으로 수신자를 기망하여
                  회신을 유도하는 각종 조치
                </li>
              </ul>
            </ul>
          </>
        ),
        en: (
          <>
            <ul className="pl-6 list-decimal">
              <li>
                When the Company transmits advertising information for
                commercial purposes using electronic transmission media, it
                obtains the explicit prior consent of users. However, prior
                consent is not required in any of the following cases:
              </li>
              <ul className="pl-6 list-decimal">
                <li>
                  When the Company collects contact information directly from
                  the recipient through a transaction relationship for goods,
                  etc., and intends to transmit advertising information for
                  commercial purposes regarding goods of the same kind as those
                  processed by the Company and traded with the recipient within
                  6 months from the date the transaction ended
                </li>
                <li>
                  When a telemarketing seller under the &quot;Door-to-Door Sales
                  Act&quot; verbally notifies the recipient of the source of
                  personal information collection and makes telemarketing calls
                </li>
              </ul>
              <li>
                Notwithstanding the preceding paragraph, the Company does not
                transmit advertising information for commercial purposes if the
                recipient expresses an intention to refuse reception or
                withdraws prior consent, and notifies the result of processing
                the refusal of reception and withdrawal of reception consent.
              </li>
              <li>
                When the Company transmits advertising information for
                commercial purposes using electronic transmission media during
                the time from 9 p.m. to 8 a.m. the next day, it obtains separate
                prior consent from the recipient, notwithstanding Paragraph 1.
              </li>
              <li>
                When the Company transmits advertising information for
                commercial purposes using electronic transmission media, it
                specifically indicates the following matters in the advertising
                information.
              </li>
              <ul className="pl-6 list-decimal">
                <li>Company name and contact information</li>
                <li>
                  Indication of matters related to expressing intention to
                  refuse reception or withdraw reception consent
                </li>
              </ul>
              <li>
                When the Company transmits advertising information for
                commercial purposes using electronic transmission media, it does
                not take any of the following measures:
              </li>
              <ul className="pl-6 list-decimal">
                <li>
                  Measures to avoid or obstruct the recipient's refusal of
                  reception or withdrawal of reception consent
                </li>
                <li>
                  Measures to automatically create the recipient's contact
                  information, such as phone number or email address, by
                  combining numbers, symbols, or characters
                </li>
                <li>
                  Measures to automatically register phone numbers or email
                  addresses for the purpose of transmitting advertising
                  information for commercial purposes
                </li>
                <li>
                  Various measures to hide the identity of the sender of
                  advertising information or the source of advertising
                  transmission
                </li>
                <li>
                  Various measures to induce responses by deceiving recipients
                  for the purpose of transmitting advertising information for
                  commercial purposes
                </li>
              </ul>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제20조(이용자의 의무)',
        en: 'Article 20 (User Obligations)',
      },
      content: {
        ko: (
          <>
            <ul className="pl-6 list-decimal">
              <li>
                이용자는 자신의 개인정보를 최신의 상태로 유지해야 하며, 이용자의
                부정확한 정보 입력으로 발생하는 문제의 책임은 이용자 자신에게
                있습니다.
              </li>
              <li>
                타인의 개인정보를 도용한 회원가입의 경우 이용자 자격을
                상실하거나 관련 개인정보보호 법령에 의해 처벌받을 수 있습니다.
              </li>
              <li>
                이용자는 전자우편주소, 비밀번호 등에 대한 보안을 유지할 책임이
                있으며 제3자에게 이를 양도하거나 대여할 수 없습니다.
              </li>
            </ul>
          </>
        ),
        en: (
          <>
            <ul className="pl-6 list-decimal">
              <li>
                Users must keep their personal information up to date, and the
                responsibility for problems arising from inaccurate information
                input by users lies with the users themselves.
              </li>
              <li>
                In the case of membership registration using another person's
                personal information, the user may lose user qualification or be
                punished under relevant personal information protection laws.
              </li>
              <li>
                Users are responsible for maintaining the security of their
                email addresses, passwords, etc., and may not transfer or lend
                them to third parties.
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제21조(회사의 개인정보 관리)',
        en: "Article 21 (Company's Personal Information Management)",
      },
      content: {
        ko: (
          <>
            <p>
              회사는 이용자의 개인정보를 처리함에 있어 개인정보가 분실, 도난,
              유출, 변조, 훼손 등이 되지 아니하도록 안전성을 확보하기 위하여
              필요한 기술적·관리적 보호대책을 강구하고 있습니다.
            </p>
          </>
        ),
        en: (
          <>
            <p>
              The Company takes necessary technical and managerial protection
              measures to ensure security to prevent personal information from
              being lost, stolen, leaked, altered, damaged, etc., when
              processing users' personal information.
            </p>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제22조(삭제된 정보의 처리)',
        en: 'Article 22 (Processing of Deleted Information)',
      },
      content: {
        ko: (
          <>
            <p>
              회사는 이용자 혹은 법정 대리인의 요청에 의해 해지 또는 삭제된
              개인정보는 회사가 수집하는 &lsquo;개인정보의 보유 및 이용기간
              &rsquo;에 명시된 바에 따라 처리하고 그 외의 용도로 열람 또는
              이용할 수 없도록 처리하고 있습니다.
            </p>
            <ul>
              <li>유출 등이 된 개인정보 항목</li>
              <li>유출 등이 발생한 시점</li>
              <li>이용자가 취할 수 있는 조치</li>
              <li>정보통신서비스 제공자 등의 대응 조치</li>
              <li>이용자가 상담 등을 접수할 수 있는 부서 및 연락처</li>
            </ul>
          </>
        ),
        en: (
          <>
            <p>
              Personal information that has been terminated or deleted at the
              request of users or legal representatives is processed according
              to what is specified in the 'Retention and Usage Period of
              Personal Information' collected by the Company, and cannot be
              viewed or used for other purposes.
            </p>
            <ul>
              <li>Personal information items that have been leaked, etc.</li>
              <li>Time when the leakage, etc., occurred</li>
              <li>Measures that users can take</li>
              <li>
                Countermeasures by the information and communications service
                provider, etc.
              </li>
              <li>
                Department and contact information where users can receive
                consultations, etc.
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제23조(비밀번호의 암호화)',
        en: 'Article 23 (Password Encryption)',
      },
      content: {
        ko: (
          <>
            <p>
              이용자의 비밀번호는 일방향 암호화하여 저장 및 관리되고 있으며,
              개인정보의 확인, 변경은 비밀번호를 알고 있는 본인에 의해서만
              가능합니다.
            </p>
          </>
        ),
        en: (
          <>
            <p>
              Users' passwords are stored and managed with one-way encryption,
              and confirmation and modification of personal information are only
              possible by the person who knows the password.
            </p>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제24조(해킹 등에 대비한 대책)',
        en: 'Article 24 (Countermeasures Against Hacking, etc.)',
      },
      content: {
        ko: (
          <>
            <ul className="pl-6 list-decimal">
              <li>
                회사는 해킹, 컴퓨터 바이러스 등 정보통신망 침입에 의해 이용자의
                개인정보가 유출되거나 훼손되는 것을 막기 위해 최선을 다하고
                있습니다.
              </li>
              <li>
                회사는 최신 백신프로그램을 이용하여 이용자들의 개인정보나 자료가
                유출 또는 손상되지 않도록 방지하고 있습니다.
              </li>
              <li>
                회사는 만일의 사태에 대비하여 침입차단 시스템을 이용하여 보안에
                최선을 다하고 있습니다.
              </li>
              <li>
                회사는 민감한 개인정보(를 수집 및 보유하고 있는 경우)를 암호화
                통신 등을 통하여 네트워크상에서 개인정보를 안전하게 전송할 수
                있도록 하고 있습니다.
              </li>
            </ul>
          </>
        ),
        en: (
          <>
            <ul className="pl-6 list-decimal">
              <li>
                The Company does its best to prevent users' personal information
                from being leaked or damaged due to intrusions into information
                and communication networks such as hacking and computer viruses.
              </li>
              <li>
                The Company uses the latest anti-virus programs to prevent
                users' personal information or data from being leaked or
                damaged.
              </li>
              <li>
                The Company does its best to ensure security by using intrusion
                blocking systems in preparation for any contingency.
              </li>
              <li>
                The Company ensures that personal information can be safely
                transmitted over networks through encrypted communication, etc.,
                when collecting and possessing sensitive personal information.
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제25조(개인정보 처리 최소화 및 교육)',
        en: 'Article 25 (Minimization of Personal Information Processing and Education)',
      },
      content: {
        ko: (
          <>
            <p>
              회사는 개인정보 관련 처리 담당자를 최소한으로 제한하며, 개인정보
              처리자에 대한 교육 등 관리적 조치를 통해 법령 및 내부방침 등의
              준수를 강조하고 있습니다.
            </p>
          </>
        ),
        en: (
          <>
            <p>
              The Company minimizes the number of personnel handling personal
              information and emphasizes compliance with laws and internal
              policies through administrative measures such as education for
              personal information processors.
            </p>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제26조(개인정보 유출 등에 대한 조치)',
        en: 'Article 26 (Measures for Personal Information Leakage, etc.)',
      },
      content: {
        ko: (
          <>
            <p>
              회사는 개인정보의 분실·도난·유출(이하 &lsquo;유출 등 &rsquo; 이라
              한다) 사실을 안 때에는 지체 없이 다음 각 호의 모든 사항을 해당
              이용자에게 알리고 방송통신위원회 또는 한국인터넷진흥원에
              신고합니다.
            </p>
            <ul className="pl-6 list-decimal">
              <li>유출 등이 된 개인정보 항목</li>
              <li>유출 등이 발생한 시점</li>
              <li>이용자가 취할 수 있는 조치</li>
              <li>정보통신서비스 제공자 등의 대응 조치</li>
              <li>이용자가 상담 등을 접수할 수 있는 부서 및 연락처</li>
            </ul>
          </>
        ),
        en: (
          <>
            <p>
              When the Company becomes aware of the fact of loss, theft, or
              leakage (hereinafter referred to as "leakage, etc.") of personal
              information, it shall notify the relevant users of all of the
              following matters without delay and report to the Korea
              Communications Commission or the Korea Internet & Security Agency.
            </p>
            <ul className="pl-6 list-decimal">
              <li>Personal information items that have been leaked, etc.</li>
              <li>Time when the leakage, etc., occurred</li>
              <li>Measures that users can take</li>
              <li>
                Countermeasures by the information and communications service
                provider, etc.
              </li>
              <li>
                Department and contact information where users can receive
                consultations, etc.
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제27조(개인정보 유출 등에 대한 조치의 예외)',
        en: 'Article 27 (Exceptions to Measures for Personal Information Leakage, etc.)',
      },
      content: {
        ko: (
          <>
            <p>
              회사는 전조에도 불구하고 이용자의 연락처를 알 수 없는 등 정당한
              사유가 있는 경우에는 회사의 홈페이지에 30일 이상 게시하는 방법으로
              전조의 통지를 갈음하는 조치를 취할 수 있습니다.
            </p>
          </>
        ),
        en: (
          <>
            <p>
              Notwithstanding the preceding Article, the Company may take
              measures to substitute the notification of the preceding Article
              by posting on the Company's homepage for at least 30 days if there
              is a legitimate reason such as not knowing the user's contact
              information.
            </p>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제28조(국외 이전 개인정보의 보호)',
        en: 'Article 28 (Protection of Personal Information Transferred Overseas)',
      },
      content: {
        ko: (
          <>
            <ul className="pl-6 list-decimal">
              <li>
                회사는 이용자의 개인정보에 관하여 개인정보보호법 등 관계 법규를
                위반하는 사항을 내용으로 하는 국제계약을 체결하지 않습니다.
              </li>
              <li>
                회사는 이용자의 개인정보를 국외에 제공(조회되는 경우를
                포함)ㆍ처리위탁ㆍ보관(이하 '이전' 이라 함)하려면 이용자의 동의를
                받습니다. 다만, 본조 제3항 각 호의 사항 모두를 개인정보보호법 등
                관계 법규에 따라 공개하거나 전자우편 등 대통령령으로 정하는
                방법에 따라 이용자에게 알린 경우에는 개인정보 처리위탁ㆍ보관에
                따른 동의절차를 거치지 아니할 수 있습니다.
              </li>
              <li>
                회사는 본조 제2항 본문에 따른 동의를 받으려면 미리 다음 각 호의
                사항 모두를 이용자에게 고지합니다.
              </li>
              <ul className="pl-6 list-decimal">
                <li>이전되는 개인정보 항목</li>
                <li>개인정보가 이전되는 국가, 이전일시 및 이전방법</li>
                <li>
                  개인정보를 이전받는 자의 성명(법인인 경우 그 명칭 및 정보관리
                  책임자의 연락처를 말한다)
                </li>
                <li>
                  개인정보를 이전받는 자의 개인정보 이용목적 및 보유ㆍ이용 기간
                </li>
              </ul>
              <li>
                회사는 본조 제2항 본문에 따른 동의를 받아 개인정보를 국외로
                이전하는 경우 개인정보보호법 대통령령 등 관계법규에서 정하는
                바에 따라 보호조치를 합니다.
              </li>
            </ul>
          </>
        ),
        en: (
          <>
            <ul className="pl-6 list-decimal">
              <li>
                The Company does not enter into international contracts with
                contents that violate relevant laws and regulations such as the
                Personal Information Protection Act regarding users' personal
                information.
              </li>
              <li>
                The Company obtains the consent of users when it intends to
                provide (including viewing), process, or store (hereinafter
                referred to as "transfer") users' personal information overseas.
                However, the consent procedure for personal information
                processing and storage may not be required if all matters in
                each subparagraph of Paragraph 3 of this Article are disclosed
                in accordance with relevant laws and regulations such as the
                Personal Information Protection Act or notified to users by
                methods prescribed by Presidential Decree, such as email.
              </li>
              <li>
                In order to obtain consent in accordance with the main text of
                Paragraph 2 of this Article, the Company shall notify users of
                all of the following matters in advance.
              </li>
              <ul className="pl-6 list-decimal">
                <li>Personal information items to be transferred</li>
                <li>
                  Country to which personal information is transferred, transfer
                  time, and transfer method
                </li>
                <li>
                  Name of the person receiving the personal information (in the
                  case of a corporation, its name and contact information of the
                  information management officer)
                </li>
                <li>
                  Purpose of use of personal information and retention and usage
                  period by the person receiving the personal information
                </li>
              </ul>
              <li>
                When the Company transfers personal information overseas after
                obtaining consent in accordance with the main text of Paragraph
                2 of this Article, it takes protective measures in accordance
                with the Presidential Decree of the Personal Information
                Protection Act and other relevant laws and regulations.
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제29조(개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)',
        en: 'Article 29 (Installation, Operation, and Rejection of Automatic Personal Information Collection Devices)',
      },
      content: {
        ko: (
          <>
            <ul className="pl-6 list-decimal">
              <li>
                회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용
                정보를 저장하고 수시로 불러오는 개인정보 자동 수집장치(이하
                '쿠키')를 사용합니다. 쿠키는 웹사이트를 운영하는데 이용되는
                서버(http)가 이용자의 웹브라우저(PC 및 모바일을 포함)에게 보내는
                소량의 정보이며 이용자의 저장공간에 저장되기도 합니다.
              </li>
              <li>
                이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서
                이용자는 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를
                허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든
                쿠키의 저장을 거부할 수도 있습니다.
              </li>
              <li>
                다만, 쿠키의 저장을 거부할 경우에는 로그인이 필요한 회사의 일부
                서비스는 이용에 어려움이 있을 수 있습니다.
              </li>
            </ul>
          </>
        ),
        en: (
          <>
            <ul className="pl-6 list-decimal">
              <li>
                The Company uses automatic personal information collection
                devices (hereinafter referred to as "cookies") that store and
                periodically retrieve usage information to provide
                individualized customized services to users. Cookies are small
                amounts of information sent by the server (http) used to operate
                the website to the user's web browser (including PC and mobile)
                and may also be stored in the user's storage space.
              </li>
              <li>
                Users have the option regarding cookie installation. Therefore,
                users can allow all cookies, go through confirmation each time
                cookies are stored, or refuse to store all cookies by setting
                options in the web browser.
              </li>
              <li>
                However, if you refuse to store cookies, some of the Company's
                services that require login may be difficult to use.
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제30조(쿠키 설치 허용 지정 방법)',
        en: 'Article 30 (Method for Allowing Cookie Installation)',
      },
      content: {
        ko: (
          <>
            <p>
              웹브라우저 옵션 설정을 통해 쿠키 허용, 쿠키 차단 등의 설정을 할 수
              있습니다.
            </p>
            <ul className="pl-6 list-decimal">
              <li>
                Edge : 웹브라우저 우측 상단의 설정 메뉴 &gt; 쿠키 및 사이트 권한
                &gt; 쿠키 및 사이트 데이터 관리 및 삭제
              </li>
              <li>
                Chrome : 웹브라우저 우측 상단의 설정 메뉴 &gt; 개인정보 및 보안
                &gt; 쿠키 및 기타 사이트 데이터
              </li>
              <li>
                Whale : 웹브라우저 우측 상단의 설정 메뉴 &gt; 개인정보 보호 &gt;
                쿠키 및 기타 사이트 데이터
              </li>
            </ul>
          </>
        ),
        en: (
          <>
            <p>
              You can set cookie allowance, cookie blocking, etc. through web
              browser option settings.
            </p>
            <ul className="pl-6 list-decimal">
              <li>
                Edge: Settings menu in the upper right corner of the web browser
                &gt; Cookies and site permissions &gt; Manage and delete cookies
                and site data
              </li>
              <li>
                Chrome: Settings menu in the upper right corner of the web
                browser &gt; Privacy and security &gt; Cookies and other site
                data
              </li>
              <li>
                Whale: Settings menu in the upper right corner of the web
                browser &gt; Privacy protection &gt; Cookies and other site data
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제31조(회사의 개인정보 보호 책임자 지정)',
        en: "Article 31 (Designation of the Company's Personal Information Protection Officer)",
      },
      content: {
        ko: (
          <>
            <p>
              회사는 이용자의 개인정보를 보호하고 개인정보와 관련한 불만을
              처리하기 위하여 아래와 같이 관련 부서 및 개인정보 보호 책임자를
              지정하고 있습니다.
            </p>
            <ul className="pl-6 list-decimal">
              <li>개인정보 보호 책임자</li>
              <ul className="pl-6 list-decimal">
                <li>성명: 박영진</li>
                <li>직책: COO</li>
                <li>전화번호: 010-7977-1101</li>
                <li>이메일: info@fitculator.io</li>
              </ul>
              <li>
                회사는 개인정보의 보호를 위해 개인정보보호 전담부서를 운영하고
                있으며 개인정보처리방침의 이행사항 및 담당자의 준수여부를
                확인하여 문제가 발견될 경우 즉시 해결하고 바로 잡을 수 있도록
                최선을 다하고 있습니다.
              </li>
              <li>
                정보주체는 개인정보 보호법 제35조에 따른 개인정보의 열람 청구를
                아래의 부서에 할 수 있습니다. 회사는 정보주체의 개인정보
                열람청구가 신속하게 처리되도록 노력하겠습니다.
              </li>
            </ul>
          </>
        ),
        en: (
          <>
            <p>
              The Company designates relevant departments and personal
              information protection officers as follows to protect users'
              personal information and handle complaints related to personal
              information.
            </p>
            <ul className="pl-6 list-decimal">
              <li>Personal Information Protection Officer</li>
              <ul className="pl-6 list-decimal">
                <li>Name: Park Young-jin</li>
                <li>Position: COO</li>
                <li>Phone number: 010-7977-1101</li>
                <li>Email: info@fitculator.io</li>
              </ul>
              <li>
                The Company operates a dedicated department for personal
                information protection and does its best to immediately solve
                and correct problems if they are found by checking the
                implementation of the personal information processing policy and
                compliance of the person in charge.
              </li>
              <li>
                The data subject may request access to personal information in
                accordance with Article 35 of the Personal Information
                Protection Act to the department below. The Company will strive
                to ensure that the data subject's request for access to personal
                information is processed promptly.
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      title: {
        ko: '제32조(권익침해에 대한 구제방법)',
        en: 'Article 32 (Remedies for Infringement of Rights and Interests)',
      },
      content: {
        ko: (
          <>
            <ul className="pl-6 list-decimal">
              <li>
                정보주체는 개인정보침해로 인한 구제를 받기 위하여
                개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터
                등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타
                개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기
                바랍니다.
              </li>

              <ul className="pl-6 list-decimal">
                <li>
                  정보주체는 개인정보침해로 인한 구제를 받기 위하여
                  개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터
                  등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타
                  개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기
                  바랍니다.
                </li>
                <li>
                  개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr)
                </li>
                <li>대검찰청 : (국번없이) 1301 (www.spo.go.kr)</li>
                <li>경찰청 : (국번없이) 182 (ecrm.cyber.go.kr)</li>
              </ul>
              <li>
                회사는 정보주체의 개인정보자기결정권을 보장하고, 개인정보침해로
                인한 상담 및 피해 구제를 위해 노력하고 있으며, 신고나 상담이
                필요한 경우 제1항의 담당부서로 연락해주시기 바랍니다.
              </li>
              <li>
                개인정보 보호법 제35조(개인정보의 열람), 제36조(개인정보의
                정정·삭제), 제37조(개인정보의 처리정지 등)의 규정에 의한 요구에
                대 하여 공공기관의 장이 행한 처분 또는 부작위로 인하여 권리 또는
                이익의 침해를 받은 자는 행정심판법이 정하는 바에 따라 행정심판을
                청구할 수 있습니다.
              </li>
              <ul className="pl-6 list-decimal">
                <li>중앙행정심판위원회 : (국번없이) 110 (www.simpan.go.kr)</li>
              </ul>
            </ul>
          </>
        ),
        en: (
          <>
            <ul className="pl-6 list-decimal">
              <li>
                The data subject may apply for dispute resolution or
                consultation to the Personal Information Dispute Mediation
                Committee, Korea Internet & Security Agency Personal Information
                Infringement Report Center, etc. to receive remedies for
                infringement of personal information. For other reports and
                consultations on personal information infringement, please
                contact the following institutions.
              </li>

              <ul className="pl-6 list-decimal">
                <li>
                  The data subject may apply for dispute resolution or
                  consultation to the Personal Information Dispute Mediation
                  Committee, Korea Internet & Security Agency Personal
                  Information Infringement Report Center, etc. to receive
                  remedies for infringement of personal information. For other
                  reports and consultations on personal information
                  infringement, please contact the following institutions.
                </li>
                <li>
                  Personal Information Infringement Report Center: (without area
                  code) 118 (privacy.kisa.or.kr)
                </li>
                <li>
                  Supreme Prosecutors' Office: (without area code) 1301
                  (www.spo.go.kr)
                </li>
                <li>
                  National Police Agency: (without area code) 182
                  (ecrm.cyber.go.kr)
                </li>
              </ul>
              <li>
                The Company guarantees the data subject's right to
                self-determination of personal information and strives for
                consultation and remedies for damages caused by personal
                information infringement. If you need to report or consult,
                please contact the department in charge mentioned in Paragraph
                1.
              </li>
              <li>
                A person who has suffered infringement of rights or interests
                due to disposition or inaction by the head of a public
                institution regarding a request under the provisions of Article
                35 (Access to Personal Information), Article 36 (Correction and
                Deletion of Personal Information), and Article 37 (Suspension of
                Processing of Personal Information, etc.) of the Personal
                Information Protection Act may request an administrative appeal
                in accordance with the Administrative Appeals Act.
              </li>
              <ul className="pl-6 list-decimal">
                <li>
                  Central Administrative Appeals Commission: (without area code)
                  110 (www.simpan.go.kr)
                </li>
              </ul>
            </ul>
          </>
        ),
      },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {currentLanguage === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}
        </h1>
        <div className="space-y-8">
          {privacyPolicyItems.map((item, index) => (
            <div key={index} className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">
                {item.title[currentLanguage]}
              </h2>
              <div className="text-gray-700">
                {item.content[currentLanguage]}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
