'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { User, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === 'admin123' && password === '12345') {
      router.push('/dashboard2');
    } else if (username === 'user123' && password === '12345') {
      router.push('/customers/home');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#AF5475]">
      <div className="flex w-[90%] max-w-4xl rounded-[60px] overflow-hidden bg-pink-100 shadow-lg">
        {/* Left - Logo */}
        <div className="w-1/2 bg-[#D3628B] text-pink-100 flex items-center justify-center text-4xl font-bold rounded-tr-[60px] rounded-br-[60px]">
          <img src="icons/fs.png" alt="Logo" className="w-80 h-auto" />
        </div>

        {/* Right - Login Form */}
        <div className="w-1/2 p-10 flex flex-col justify-center items-center text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Login</h1>

          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
            {/* Username */}
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 pr-10 rounded shadow border border-gray-300 focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <User className="absolute right-3 top-2.5 text-gray-500" size={20} />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 pr-10 rounded shadow border border-gray-300 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="absolute right-3 top-2.5 text-gray-500" size={20} />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-600 text-left">{error}</p>
            )}

            {/* Forgot Password */}
            <div className="text-right text-sm">
              <Link href="/forgot-password" className="text-pink-600 hover:underline font-semibold">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-2 bg-[#cc5a84] text-white font-semibold rounded hover:bg-[#b74c77] transition"
            >
              Login
            </button>

            {/* Google Sign In */}
            <button
              type="button"
              className="w-full py-2 bg-white border shadow text-black rounded flex items-center justify-center gap-2 hover:bg-gray-100 transition"
            >
              <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>

            {/* Sign up link */}
            <p className="text-sm text-gray-700">
              Don't have an account?{' '}
              <Link href="/register" className="text-pink-600 hover:underline font-semibold">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}