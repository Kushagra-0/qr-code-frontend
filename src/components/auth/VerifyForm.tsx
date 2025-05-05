import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const VerifyForm = () => {
    const [otp, setOtp] = useState<any>(Array(5).fill(''));
    // const inputRef = useRef([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
  };

  return (
    <div className="bg-[#F5F5F5]/80 h-6/7 w-2/5 rounded-2xl px-8 pt-8 pb-4 flex flex-col justify-between">
      <div>
        <h2 className="text-5xl font-bold text-center text-[#141414]">CHECK</h2>
        <h2 className="text-5xl font-bold text-center text-[#141414] mb-6">
          YOUR EMAIL
        </h2>
      </div>

      <div>
        <form onSubmit={handleRegister}>
          <div className="flex gap-2 mb-8">
            {otp.map((digit: any, i: any) => {
                // <input
                //     key={i}
                //     // ref={(e: any) => (inputRef.current[i] = e)}
                //     type="text"
                //     inputMode='numeric'
                //     maxLength={1}
                //     value={digit}
                //     // onChange={(e) => handleChange(e.target.value, i)}
                //     // onKeyDown={(e) => handleKeyDown(e, i)}
                //     className='w-3 h-3 text-center text-xl bg-[#FFFFFF]'
                // />
                <label>
                    asgdhj
                </label>
            })}
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
              'VERIFY OTP'
            )}
          </button>
        </form>

        <p className="text-center text-[#141414] font-semibold mt-4">
          Didn't received it?{' '}
          <Link to="/login" className="text-[#036AFF] hover:underline">
            Resend OTP
          </Link>
        </p>
      </div>
    </div>
  );
};

export default  VerifyForm;
