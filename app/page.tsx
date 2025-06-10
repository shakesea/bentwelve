"use client";

import AuthLogin from './AuthLogin';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#AF5475]">
      <div className="flex w-[90%] max-w-4xl rounded-[60px] overflow-hidden bg-pink-100 shadow-lg">
        {/* Left - Logo */}
        <div className="w-1/2 bg-[#D3628B] text-pink-100 flex items-center justify-center text-4xl font-bold rounded-tr-[60px] rounded-br-[60px]">
          <img src="/icons/fs.png" alt="Logo" className="w-80 h-auto" />
        </div>

        {/* Right - Login Form */}
        <AuthLogin />
      </div>
    </div>
  );
}