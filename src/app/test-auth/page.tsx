'use client'

import { useAuth } from '@/hooks'

export default function TestAuthPage() {
  const { user, signInWithGoogle, signOut, loading, error } = useAuth()

  const handleGoogleLogin = async () => {
    console.log('Google login clicked')
    try {
      const success = await signInWithGoogle()
      console.log('Login result:', success)
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>

      {user ? (
        <div>
          <p>Logged in as: {user.email}</p>
          <button
            onClick={signOut}
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
            disabled={loading}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Google Sign In'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )}
    </div>
  )
}