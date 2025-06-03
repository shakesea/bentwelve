import AuthRegister from '../AuthRegister';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-[#AF5475] items-center justify-center">
      {/* Container */}
      <div className="flex w-[90%] max-w-4xl rounded-[60px] overflow-hidden bg-pink-100 shadow-lg">
        {/* Left Side - Logo */}
        <div className="w-1/2 bg-[#D3628B] text-pink-100 flex items-center justify-center text-4xl font-bold rounded-tr-[60px] rounded-br-[60px]">
          <img src="icons/fs.png" alt="Logo" className="w-80 h-auto" />
        </div>

        {/* Right Side - Register Form */}
        <AuthRegister />
      </div>
    </div>
  );
}