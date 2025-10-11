/**
 * 사용자 데이터 액세스 레이어
 * Prisma와 직접 상호작용하는 Repository 패턴
 */

import { prisma } from "@/lib/db/client";
import type { User, Prisma } from "@prisma/client";

export class UserRepository {
  /**
   * ID로 사용자 조회
   */
  async findById(id: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error("[UserRepository] findById 오류:", error);
      throw new Error(
        `사용자 조회 실패: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * 이메일로 사용자 조회
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error("[UserRepository] findByEmail 오류:", error);
      throw new Error(
        `이메일로 사용자 조회 실패: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Apple ID로 사용자 조회
   */
  async findByAppleId(appleId: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { appleId },
      });
    } catch (error) {
      console.error("[UserRepository] findByAppleId 오류:", error);
      throw new Error(
        `Apple ID로 사용자 조회 실패: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * 사용자 생성
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await prisma.user.create({ data });
    } catch (error) {
      console.error("[UserRepository] create 오류:", error);
      throw new Error(
        `사용자 생성 실패: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * 사용자 정보 업데이트
   */
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error("[UserRepository] update 오류:", error);
      throw new Error(
        `사용자 업데이트 실패: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * 사용자 삭제
   */
  async delete(id: string): Promise<User> {
    try {
      return await prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      console.error("[UserRepository] delete 오류:", error);
      throw new Error(
        `사용자 삭제 실패: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

// Singleton 인스턴스 export
export const userRepository = new UserRepository();
