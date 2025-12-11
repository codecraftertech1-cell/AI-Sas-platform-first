'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(email, password, name);
      toast.success('Account created successfully!');
      // Redirect immediately after successful registration
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 px-4 sm:px-6 md:px-8">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 border border-white/20">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">Start your AI journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2 sm:mb-3">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition backdrop-blur"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2 sm:mb-3">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition backdrop-blur"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2 sm:mb-3">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition backdrop-blur"
              placeholder="••••••••"
            />
            <p className="mt-1 text-sm text-gray-400">Minimum 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg sm:rounded-xl hover:from-red-600 hover:to-pink-600 active:from-red-700 active:to-pink-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-bold shadow-lg hover:shadow-xl"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-gray-300 text-sm sm:text-base">
            Already have an account?{' '}
            <Link href="/login" className="text-red-400 hover:text-red-300 font-semibold transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

