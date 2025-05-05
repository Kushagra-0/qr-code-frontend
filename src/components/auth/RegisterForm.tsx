import { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
  };

  return (
    <div className="bg-[#F5F5F5]/80 h-6/7 w-2/5 rounded-2xl px-8 pt-8 pb-4 flex flex-col justify-between">
      <div>
        <h2 className="text-5xl font-bold text-center text-[#141414]">LET'S</h2>
        <h2 className="text-5xl font-bold text-center text-[#141414] mb-6">
          GET STARTED
        </h2>
      </div>

      <div>
        <form onSubmit={handleRegister}>
          <div className="mb-8">
            <input
              type="email"
              className="w-full p-4 rounded-xl focus:outline-none bg-[#FFFFFF] placeholder-[#141414] font-semibold text-3xl"
              required
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-8 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full p-4 rounded-xl focus:outline-none bg-[#FFFFFF] placeholder-[#141414] font-semibold text-3xl"
              required
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 mt-6 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {/* {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} */}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-xl ${
              isLoading ? 'bg-gray-400' : 'bg-[#036AFF]'
            } text-white text-3xl font-bold`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="spinner-border animate-spin w-5 h-5 border-4 border-white rounded-full border-t-transparent" />
              </div>
            ) : (
              'REGISTER'
            )}
          </button>
        </form>

        <p className="text-center text-[#141414] font-semibold mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-[#036AFF] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
