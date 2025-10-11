"use client";

/**
 * 인증 관련 커스텀 훅
 */

import React, { createContext, useContext } from "react";
import { useSession, signIn, signOut } from "@/lib/auth-client";
import type { AuthContextType, User } from "@/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 인증 컨텍스트 제공자
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, isPending: loading, error } = useSession();

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      return result.error === null;
    } catch (err) {
      console.error("Google 로그인 실패:", err);
      return false;
    }
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/";
          },
        },
      });
    } catch (err) {
      console.error("로그아웃 실패:", err);
      throw err;
    }
  };

  const value: AuthContextType = {
    user: session?.user || null,
    loading,
    error: error?.message || null,
    signInWithGoogle,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * 인증 상태 및 메서드를 사용하는 커스텀 훅
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export type { User };
