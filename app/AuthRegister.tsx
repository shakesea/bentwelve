'use client';

import { FaUser, FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import Link from 'next/link';
import { useRef } from 'react';

const AuthRegister = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      username: usernameRef.current?.value,
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    });
  };

  return (
    <div className="w-1/2 p-10 flex flex-col justify-center items-center text-center">
      <h2 className="text-2xl font-bold text-black mb-6">Registration</h2>
      <form onSubmit={handleRegister} className="w-full max-w-sm space-y-4">
        {/* Username */}
        <div className="relative">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 pr-10 rounded shadow border border-gray-300 focus:outline-none"
            ref={usernameRef}
          />
          <FaUser className="absolute right-3 top-2.5 text-gray-500" />
        </div>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 pr-10 rounded shadow border border-gray-300 focus:outline-none"
            ref={emailRef}
          />
          <FaEnvelope className="absolute right-3 top-2.5 text-gray-500" />
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 pr-10 rounded shadow border border-gray-300 focus:outline-none"
            ref={passwordRef}
          />
          <FaLock className="absolute right-3 top-2.5 text-gray-500" />
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="w-full py-2 bg-[#C4587B] text-white font-semibold rounded hover:bg-[#b74c77] transition"
        >
          Register
        </button>

        {/* Google Button */}
        <button
          type="button"
          className="w-full py-2 bg-white border shadow text-black rounded flex items-center justify-center gap-2 hover:bg-gray-100 transition"
        >
          <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
          Sign in with Google
        </button>

        {/* Login Link */}
        <p className="text-sm text-gray-700">
          Already have an account?{" "}
          <Link href="/" className="text-pink-600 hover:underline font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AuthRegister;