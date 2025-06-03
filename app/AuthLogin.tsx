import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { User, Lock } from 'lucide-react';
import Link from 'next/link';

const AuthLogin = () => {
  const router = useRouter();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const username = usernameRef.current?.value || '';
    const password = passwordRef.current?.value || '';

    if (username === 'admin123' && password === '12345') {
      router.push('/dashboard2');
    } else if (username === 'user123' && password === '12345') {
      router.push('/customers/home');
    } else {
      errorRef.current = 'Invalid username or password';
      (document.querySelector('#error-message') as HTMLParagraphElement).textContent = errorRef.current;
    }
  };

  return (
    <div className="w-1/2 p-10 flex flex-col justify-center items-center text-center">
      <h1 className="text-2xl font-bold text-black mb-4">Login</h1>
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        {/* Username */}
        <div className="relative">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 pr-10 rounded shadow border border-gray-300 focus:outline-none"
            ref={usernameRef}
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
        <p id="error-message" className="text-sm text-red-600 text-left"></p>

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
  );
};

export default AuthLogin;