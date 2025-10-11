/**
 * 인증 관련 타입 정의
 */

import type { auth } from "@/lib/auth";

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
}
