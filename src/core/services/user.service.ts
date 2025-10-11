/**
 * 사용자 관련 비즈니스 로직 서비스
 */

import { userRepository } from "@/core/repositories";
import type { User, Prisma } from "@prisma/client";

export class UserService {
  /**
   * ID로 사용자 조회
   */
  async getUserById(id: string): Promise<User | null> {
    return await userRepository.findById(id);
  }

  /**
   * 이메일로 사용자 조회
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return await userRepository.findByEmail(email);
  }

  /**
   * Apple ID로 사용자 조회
   */
  async getUserByAppleId(appleId: string): Promise<User | null> {
    return await userRepository.findByAppleId(appleId);
  }

  /**
   * 사용자 생성
   */
  async createUser(userData: {
    name: string;
    email: string;
    googleId?: string;
    appleId?: string;
    profileImageUrl?: string;
    gender?: string;
    birth?: Date;
  }): Promise<User> {
    // 필수 필드 검증
    if (!userData.name || !userData.email) {
      throw new Error("이름과 이메일은 필수 입력 항목입니다.");
    }

    // linked_providers 배열 설정
    const linkedProviders: string[] = [];
    if (userData.googleId) linkedProviders.push("google");
    if (userData.appleId) linkedProviders.push("apple");

    const createData: Prisma.UserCreateInput = {
      name: userData.name,
      email: userData.email,
      googleId: userData.googleId,
      appleId: userData.appleId,
      profileImageUrl: userData.profileImageUrl,
      gender: userData.gender || "other",
      birth: userData.birth || new Date(),
      linkedProviders,
    };

    return await userRepository.create(createData);
  }

  /**
   * 사용자 정보 업데이트
   */
  async updateUser(id: string, updates: Prisma.UserUpdateInput): Promise<User> {
    return await userRepository.update(id, updates);
  }

  /**
   * 사용자 삭제
   */
  async deleteUser(id: string): Promise<User> {
    return await userRepository.delete(id);
  }
}

// Singleton 인스턴스 export
export const userService = new UserService();
