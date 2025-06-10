"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { User, Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";

const AuthLogin = () => {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email atau password salah.");
    } else {
      const session = await fetch("/api/auth/session").then((res) => res.json());
      if (session.user?.role === "admin") {
        router.push("/dashboard2");
      } else if (session.user?.role === "user") {
        router.push("/customers/home");
      } else {
        setError("Role tidak dikenali.");
      }
    }
  };

  return (
    <div className="w-1/2 p-10 flex flex-col justify-center items-center text-center">
      <h1 className="text-2xl font-bold text-black mb-4">Login</h1>
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        {/* Email */}
        <div className="relative">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 pr-10 rounded shadow border border-gray-300 focus:outline-none"
            ref={emailRef}
          />
          <User className="absolute right-3 top-2.5 text-gray-500" size={20} />
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 pr-10 rounded shadow border border-gray-300 focus:outline-none"
            ref={passwordRef}
          />
          <Lock className="absolute right-3 top-2.5 text-gray-500" size={20} />
        </div>

        {/* Error Message */}
        {error && <p id="error-message" className="text-sm text-red-600 text-left">{error}</p>}

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

        {/* Sign up link */}
        <p className="text-sm text-gray-700">
          Don't have an account?{' '}
          <Link href="/register" className="text-pink-600 hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AuthLogin;