'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold mb-8">Story Craft</h1>
      
      {user ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg">Welcome, {user.username}!</p>
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Log Out
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}
