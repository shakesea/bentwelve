// app/AuthRegister.tsx
"use client";

import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import Link from "next/link";
import { useRef, FormEvent, useState } from "react";
import { createUser } from 'app/lib/actions';
import { useRouter } from 'next/navigation';

const AuthRegister = () => {
  const router = useRouter();
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const handleRegister = async (e: FormEvent) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("username", usernameRef.current?.value || "");
  formData.append("email", emailRef.current?.value || "");
  formData.append("password", passwordRef.current?.value || "");

  try {
    await createUser(formData);
    setNotification({ message: "Registration successful! Redirecting to login...", type: 'success' });
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (error) {
    setNotification({ message: (error as Error).message || "Registration failed", type: 'error' });
  }
};

  return (
    <div className="w-1/2 p-10 flex flex-col justify-center items-center text-center">
      <h2 className="text-2xl font-bold text-black mb-6">Registration</h2>
      {notification && (
        <div className={`w-full max-w-sm p-3 mb-4 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {notification.message}
        </div>
      )}
      <form onSubmit={handleRegister} className="w-full max-w-sm space-y-4">
        {/* Username */}
        <div className="relative">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full px-4 py-2 pr-10 rounded shadow border border-gray-300 focus:outline-none"
            ref={usernameRef}
            required
          />
          <FaUser className="absolute right-3 top-2.5 text-gray-500" />
        </div>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 pr-10 rounded shadow border border-gray-300 focus:outline-none"
            ref={emailRef}
            required
          />
          <FaEnvelope className="absolute right-3 top-2.5 text-gray-500" />
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 pr-10 rounded shadow border border-gray-300 focus:outline-none"
            ref={passwordRef}
            required
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
          <Link href="/login" className="text-pink-600 hover:underline font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AuthRegister;