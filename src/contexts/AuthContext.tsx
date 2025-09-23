'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '@/lib/services/auth-service';
import { User } from '@/lib/services/supabase-service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<boolean>;
  signInWithApple: () => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authService] = useState(() => new AuthService());

  // 컴포넌트 마운트 시 저장된 사용자 정보 로드
  useEffect(() => {
    const currentUser = authService.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
  }, [authService]);

  const signInWithGoogle = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const success = await authService.signInWithGoogle();
      if (success) {
        setUser(authService.currentUser);
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google 로그인 실패';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signInWithApple = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const success = await authService.signInWithApple();
      if (success) {
        setUser(authService.currentUser);
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Apple 로그인 실패';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '로그아웃 실패';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithApple,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
export type { User };