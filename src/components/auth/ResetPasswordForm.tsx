import { useState } from 'react';
import { Eye, EyeOff } from 'react-feather';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../common/constant';

const ResetPasswordForm = () => {
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
    const location = useLocation();

    const token = location.state?.token;

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setError('Some issue. Please request password reset again.');
            return;
        }

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

            const res = await fetch(`${baseUrl}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ newPassword: password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Password reset failed');

            navigate('/login');
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
        <div className="bg-[#F5F5F5]/80 h-6/7 w-2/6 rounded-2xl px-8 pt-8 pb-4 flex flex-col justify-between">
            <div>
                <h2 className="text-5xl font-bold text-center text-[#141414]">ENTER</h2>
                <h2 className="text-5xl font-bold text-center text-[#141414] mb-6">
                    NEW PASSWORD
                </h2>
            </div>

            <div>
                <form onSubmit={handleResetPassword}>
                    {error && (
                        <p className="text-red-500 font-semibold text-sm mb-4 text-center">{error}</p>
                    )}

                    <div className="mb-8 relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full p-4 rounded-xl focus:outline-none bg-[#FFFFFF] font-semibold text-lg"
                            required
                            value={password}
                            placeholder="New Password"
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
                            <div className="absolute top-0 left-full ml-4 w-64 p-4 rounded-xl bg-white shadow-lg border border-gray-200 z-10">

                                <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white"></div>

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

                    <div className="mb-8 relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="w-full p-4 rounded-xl focus:outline-none bg-[#FFFFFF] font-semibold text-lg"
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
                        className={`w-full py-4 rounded-xl ${isLoading || !token ? 'bg-gray-400' : 'bg-[#036AFF]'
                            } text-white text-xl font-bold`}
                        disabled={isLoading || !token}
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                                <div className="spinner-border animate-spin w-7 h-7 border-4 border-white rounded-full border-t-transparent" />
                            </div>
                        ) : (
                            'RESET PASSWORD'
                        )}
                    </button>
                </form>

                <p className="text-center text-[#141414] mt-4 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-[#036AFF] hover:underline font-semibold">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
