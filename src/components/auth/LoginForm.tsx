import { useState } from 'react';
import { Eye, EyeOff } from 'react-feather';
import { Link, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../common/constant';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError('');
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        setIsLoading(false);
        return;
      }

      login(data.token, data.user);
      navigate("/dashboard")

    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-[#F5F5F5]/80 h-6/7 w-2/6 rounded-2xl px-8 pt-8 pb-4 flex flex-col justify-between">
      <div>
        <h2 className="text-5xl font-bold text-center text-[#141414]">
          WELCOME BACK
        </h2>
      </div>

      <div>
        <form onSubmit={handleLogin}>
          {error && (
            <div className="text-red-500 font-semibold text-sm mb-4 text-center">
              {error}
            </div>
          )}
          <div className="mb-8">
            <input
              type="email"
              className="w-full p-4 rounded-xl focus:outline-none bg-[#FFFFFF] font-semibold text-lg"
              required
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative mb-2">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full p-4 rounded-xl focus:outline-none bg-[#FFFFFF] font-semibold text-lg"
              required
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-4 mb-5  flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

            <div className="text-right items-baseline">
              <Link
                to="/find-email"
                className="text-[#036AFF] font-semibold text-sm hover:underline items-baseline"
              >
                Forgot Your Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-xl ${isLoading ? 'bg-gray-400' : 'bg-[#036AFF]'
              } text-white text-xl font-bold`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="spinner-border animate-spin w-7 h-7 border-4 border-white rounded-full border-t-transparent" />
              </div>
            ) : (
              'LOGIN'
            )}
          </button>
        </form>

        <p className="text-center text-[#141414] text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#036AFF] hover:underline font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
