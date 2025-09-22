import { useState } from 'react';
import { Eye, EyeOff } from 'react-feather';
import { Link, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../common/constant';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validation, setValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const rules = validatePassword(password);

    if (!rules.length || !rules.uppercase || !rules.lowercase || !rules.number) {
      setError('Password does not meet security requirements.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const res = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'user' }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Registration failed.');

      navigate("/verify-otp", {
        state: {
          userId: data.user._id.toString(),
          purpose: 'email_verification'
        }
      })
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setValidation(validatePassword(value));
  };

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    };
  };

  return (
    <div className="bg-[#F5F5F5]/80 w-full sm:w-4/6 md:w-3/6 lg:w-2/6 rounded-2xl px-4 md:px-8 pt-8 pb-4 flex flex-col justify-between">
      <div className='mb-10'>
        <h2 className="text-5xl font-bold text-center text-[#141414]">LET'S</h2>
        <h2 className="text-5xl font-bold text-center text-[#141414] mb-6">
          GET STARTED
        </h2>
      </div>

      <div>
        <form onSubmit={handleRegister}>
          {error && (
            <p className="text-red-500 font-semibold text-sm mb-4 text-center">{error}</p>
          )}

          <div className="mb-4 md:mb-8">
            <input
              type="email"
              className="w-full p-3 md:p-4 rounded-xl focus:outline-none bg-[#FFFFFF] font-semibold text-lg"
              required
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4 md:mb-8 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full p-3 md:p-4 rounded-xl focus:outline-none bg-[#FFFFFF] font-semibold text-lg"
              required
              value={password}
              placeholder="Password"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setTimeout(() => setPasswordFocused(false), 100)}
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-4 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

            {passwordFocused && (
              <div className="absolute top-full md:top-0 left-0 md:left-full mt-4 md:mt-0 ml-0 md:ml-4 w-64 p-4 rounded-xl bg-white shadow-lg border border-gray-200 z-10">
                <div className="md:hidden absolute left-4 -top-2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>

                <div className="hidden md:block absolute -left-2 md:-left-2 top-0 md:top-4 w-0 h-0 md:border-t-8 md:border-b-8 md:border-r-8 md:border-t-transparent md:border-b-transparent md:border-r-white"></div>

                <p className={`${validation.length ? 'text-green-600' : 'text-red-500'}`}>
                  {validation.length ? '✅' : '❌'} At least 8 characters
                </p>
                <p className={`${validation.uppercase ? 'text-green-600' : 'text-red-500'}`}>
                  {validation.uppercase ? '✅' : '❌'} One uppercase letter
                </p>
                <p className={`${validation.lowercase ? 'text-green-600' : 'text-red-500'}`}>
                  {validation.lowercase ? '✅' : '❌'} One lowercase letter
                </p>
                <p className={`${validation.number ? 'text-green-600' : 'text-red-500'}`}>
                  {validation.number ? '✅' : '❌'} One number
                </p>
              </div>
            )}
          </div>

          <div className="mb-4 md:mb-8 relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="w-full p-3 md:p-4 rounded-xl focus:outline-none bg-[#FFFFFF] font-semibold text-lg"
              required
              value={confirmPassword}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-4 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full py-3 md:py-4 rounded-xl ${isLoading ? 'bg-gray-400' : 'bg-[#036AFF]'
              } text-white text-xl font-bold`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="spinner-border animate-spin w-7 h-7 border-4 border-white rounded-full border-t-transparent" />
              </div>
            ) : (
              'REGISTER'
            )}
          </button>
        </form>

        <p className="text-center text-[#141414] mt-4 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[#036AFF] hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
