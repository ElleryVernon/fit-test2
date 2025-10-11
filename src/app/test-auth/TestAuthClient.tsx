"use client";

import { authClient } from "@/lib/auth-client";
import type { User } from "@/lib/auth";

interface TestAuthClientProps {
  initialUser: User | null;
}

export default function TestAuthClient({ initialUser }: TestAuthClientProps) {
  const handleGoogleLogin = async () => {
    console.log("Google login clicked");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/test-auth",
      });
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/test-auth";
          },
        },
      });
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>

      {initialUser ? (
        <div>
          <p>Logged in as: {initialUser.email}</p>
          <button
            onClick={handleSignOut}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <p>Not logged in</p>
          <button
            onClick={handleGoogleLogin}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Google Sign In
          </button>
        </div>
      )}
    </div>
  );
}
