import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../common/constant';

const VerifyOtpForm = () => {
  const [otp, setOtp] = useState<any>(Array(5).fill(''));
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [hasResentOnce, setHasResentOnce] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { userId, email, purpose } = location.state || {};

  const endpoint = purpose === 'email_verification' ? `${baseUrl}/auth/verify-email-otp` : `${baseUrl}/auth/verify-forgot-password-otp`

  const resendEndpoint = purpose === 'email_verification' ? `${baseUrl}/auth/resend-email-otp` : `${baseUrl}/auth/request-forgot-password-otp`;

  useEffect(() => {
    let interval: any;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isResendDisabled]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 5 || !userId) {
      setError('Please enter a valid 5-digit OTP.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp: enteredOtp }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'OTP verification failed');

      console.log(data);

      if (purpose == 'email_verification') {
        navigate('/login')
      }
      else {
        navigate("/reset-password", {
          state: {
            token: data.resetToken
          }
        });

      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!userId || hasResentOnce) return;

    try {
      setResendLoading(true);
      setError('');

      const body =
        purpose === 'email_verification'
          ? { userId }
          : { email };

      const res = await fetch(resendEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to resend OTP');

      setTimer(30);
      setIsResendDisabled(true);
      setHasResentOnce(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="bg-[#F5F5F5]/80 h-6/7 w-2/6 rounded-2xl px-8 pt-8 pb-4 flex flex-col justify-between">
      <div>
        <h2 className="text-5xl font-bold text-center text-[#141414]">CHECK</h2>
        <h2 className="text-5xl font-bold text-center text-[#141414] mb-6">
          YOUR EMAIL
        </h2>
      </div>

      <div>
        <form onSubmit={handleVerify}>
          {error && <p className="text-red-500 font-semibold text-sm mb-4 text-center">{error}</p>}

          <div className="flex justify-center gap-8 mb-8">
            {otp.map((digit: any, i: any) => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                placeholder='0'
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                ref={(el) => {
                  inputRefs.current[i] = el!;
                }}
                className="w-15 h-15 text-center font-semibold text-lg bg-[#FFFFFF] rounded-lg shadow"
              />
            ))}
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-xl ${isLoading || !userId ? 'bg-gray-400' : 'bg-[#036AFF]'
              } text-white text-xl font-bold`}
            disabled={isLoading || !userId}
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="spinner-border animate-spin w-7 h-7 border-4 border-white rounded-full border-t-transparent" />
              </div>
            ) : (
              'VERIFY OTP'
            )}
          </button>
        </form>

        <p className="text-center text-[#141414] text-sm mt-4">
          Didn't receive it?{' '}
          <button
            onClick={handleResendOtp}
            disabled={isResendDisabled || resendLoading || hasResentOnce}
            className={`ml-1 font-semibold ${isResendDisabled || resendLoading || hasResentOnce ? 'text-gray-400' : 'text-[#036AFF] hover:underline'
              }`}
          >
            {resendLoading
              ? 'Sending...'
              : hasResentOnce
                ? 'OTP Resent'
                : `Resend OTP ${isResendDisabled ? `in ${timer}s` : ''}`}
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtpForm;
