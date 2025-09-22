import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../common/constant';

const FindEmailForm = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFindEmail = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            setError('');
            const response = await fetch(`${baseUrl}/auth/request-forgot-password-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Something went wrong');
                return;
            }

            console.log(data)

            navigate("/verify-otp", {
                state: {
                    userId: data.user._id.toString(),
                    email: data.user.email,
                    purpose: 'forgot_password'
                }
            })

        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="bg-[#F5F5F5]/80 w-full sm:w-4/6 md:w-3/6 lg:w-2/6 rounded-2xl px-8 pt-8 pb-4 flex flex-col justify-between">
            <div className='mb-44'>
                <h2 className="text-5xl font-bold text-center text-[#141414]">
                    ENTER
                </h2>
                <h2 className="text-5xl font-bold text-center text-[#141414]">
                    YOUR EMAIL
                </h2>
            </div>

            <div>
                <form onSubmit={handleFindEmail}>
                    {error && (
                        <div className="text-red-500 font-semibold text-sm mb-4 text-center">
                            {error}
                        </div>
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
                            'GET OTP'
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

export default FindEmailForm;
