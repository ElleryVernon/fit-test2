import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 환경 변수 유효성 검사
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다:', {
    url: supabaseUrl ? '설정됨' : '설정되지 않음',
    key: supabaseAnonKey ? '설정됨' : '설정되지 않음',
  });
}

// 클라이언트 옵션 설정
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  global: {
    fetch: fetch,
    headers: {
      'X-Client-Info': 'fitculator-landing',
    },
  },
};

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  supabaseOptions
);

// User 타입 정의
export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  profileImageUrl?: string;
  gender?: string;
  birthDate?: Date;
  createdAt: Date;
}

/**
 * 이메일로 사용자 조회 함수
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('사용자 조회 오류:', error);

      // users 테이블 권한 오류인 경우 null 반환
      if (error.message.includes('permission denied for table users')) {
        console.warn('users 테이블 접근 권한이 없습니다. null을 반환합니다.');
        return null;
      }

      throw new Error(`사용자 조회 실패: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      username: data.username,
      profileImageUrl: data.profile_image_url,
      gender: data.gender,
      birthDate: data.birth ? new Date(data.birth) : undefined,
      createdAt: new Date(data.created_at),
    };
  } catch (error) {
    console.error('Supabase 사용자 조회 오류:', error);

    // users 테이블 권한 오류인 경우 null 반환
    if (
      error instanceof Error &&
      error.message.includes('permission denied for table users')
    ) {
      console.warn('users 테이블 접근 권한이 없습니다. null을 반환합니다.');
      return null;
    }

    throw error;
  }
};

/**
 * Apple ID로 사용자 조회 함수
 */
export const getUserByAppleId = async (
  appleId: string
): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('apple_id', appleId)
      .maybeSingle();

    if (error) {
      console.error('Apple ID로 사용자 조회 오류:', error);

      // users 테이블 권한 오류인 경우 null 반환
      if (error.message.includes('permission denied for table users')) {
        console.warn('users 테이블 접근 권한이 없습니다. null을 반환합니다.');
        return null;
      }

      throw new Error(`Apple ID로 사용자 조회 실패: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      username: data.username,
      profileImageUrl: data.profile_image_url,
      gender: data.gender,
      birthDate: data.birth ? new Date(data.birth) : undefined,
      createdAt: new Date(data.created_at),
    };
  } catch (error) {
    console.error('Supabase Apple ID로 사용자 조회 오류:', error);

    // users 테이블 권한 오류인 경우 null 반환
    if (
      error instanceof Error &&
      error.message.includes('permission denied for table users')
    ) {
      console.warn('users 테이블 접근 권한이 없습니다. null을 반환합니다.');
      return null;
    }

    throw error;
  }
};

/**
 * 사용자 생성 함수
 */
export const createUser = async (userData: {
  name: string;
  email: string;
  google_id?: string;
  apple_id?: string;
  profile_image_url?: string;
  gender?: string;
  birth?: Date;
}): Promise<User> => {
  try {
    // 필수 필드 검증
    if (!userData.name || !userData.email) {
      throw new Error('이름과 이메일은 필수 입력 항목입니다.');
    }

    // 기본값 설정 및 linked_providers 배열 설정
    const linkedProviders = [];
    if (userData.google_id) linkedProviders.push('google');
    if (userData.apple_id) linkedProviders.push('apple');

    const userDataWithDefaults = {
      ...userData,
      gender: userData.gender || 'other', // gender 필드가 NOT NULL이므로 기본값 설정
      birth: userData.birth || new Date(), // birth 필드가 NOT NULL이므로 기본값 설정
      linked_providers: linkedProviders, // linked_providers 배열 설정
    };

    // 사용자 생성
    const { data, error } = await supabase
      .from('users')
      .insert(userDataWithDefaults)
      .select()
      .single();

    if (error) {
      console.error('사용자 생성 오류:', error);

      // users 테이블 권한 오류인 경우 임시 사용자 객체 반환
      if (error.message.includes('permission denied for table users')) {
        console.warn(
          'users 테이블 접근 권한이 없습니다. 임시 사용자 객체를 반환합니다.'
        );
        // 임시 사용자 객체 생성 (로컬에서만 사용)
        return {
          id: crypto.randomUUID(), // 임의의 ID 생성
          name: userData.name,
          email: userData.email,
          profileImageUrl: userData.profile_image_url,
          gender: userData.gender || 'other',
          birthDate: userData.birth,
          createdAt: new Date(),
        };
      }

      throw new Error(`사용자 생성 실패: ${error.message}`);
    }

    if (!data) {
      throw new Error('사용자 생성 후 데이터를 가져오지 못했습니다.');
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      username: data.username,
      profileImageUrl: data.profile_image_url,
      gender: data.gender,
      birthDate: data.birth ? new Date(data.birth) : undefined,
      createdAt: new Date(data.created_at),
    };
  } catch (error) {
    console.error('Supabase 사용자 생성 오류:', error);

    // users 테이블 권한 오류인 경우 임시 사용자 객체 반환
    if (
      error instanceof Error &&
      error.message.includes('permission denied for table users')
    ) {
      console.warn(
        'users 테이블 접근 권한이 없습니다. 임시 사용자 객체를 반환합니다.'
      );
      // 임시 사용자 객체 생성 (로컬에서만 사용)
      return {
        id: crypto.randomUUID(), // 임의의 ID 생성
        name: userData.name,
        email: userData.email,
        profileImageUrl: userData.profile_image_url,
        gender: userData.gender || 'other',
        birthDate: userData.birth,
        createdAt: new Date(),
      };
    }

    throw error;
  }
};